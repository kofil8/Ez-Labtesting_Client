"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hook/use-toast";
import {
  sendCustomSuperAdminNotification,
  type SuperAdminNotificationBroadcastResult,
  type SuperAdminNotificationRole,
} from "@/lib/services/superadmin-notifications.service";
import { cn } from "@/lib/utils";
import {
  Bell,
  Loader2,
  Megaphone,
  Shield,
  UserRound,
  Users,
} from "lucide-react";
import { useMemo, useState, type ComponentType } from "react";

type RoleOption = {
  value: SuperAdminNotificationRole;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};

const ROLE_OPTIONS: RoleOption[] = [
  {
    value: "CUSTOMER",
    label: "Customers",
    description: "Send to all customer accounts",
    icon: UserRound,
  },
  {
    value: "LAB_PARTNER",
    label: "Lab Partners",
    description: "Send to lab partner accounts",
    icon: Shield,
  },
  {
    value: "ADMIN",
    label: "Admins",
    description: "Send to admin users only",
    icon: Users,
  },
];

const DEFAULT_TITLE = "";
const DEFAULT_BODY = "";

function parseOptionalData(
  rawValue: string,
): Record<string, unknown> | undefined {
  if (!rawValue.trim()) {
    return undefined;
  }

  const parsed = JSON.parse(rawValue);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Advanced data must be a JSON object.");
  }

  return parsed as Record<string, unknown>;
}

function formatCount(value: number | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function SuperAdminNotifications() {
  const { toast } = useToast();
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [body, setBody] = useState(DEFAULT_BODY);
  const [selectedRoles, setSelectedRoles] = useState<
    SuperAdminNotificationRole[]
  >(["CUSTOMER"]);
  const [advancedData, setAdvancedData] = useState("{}");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] =
    useState<SuperAdminNotificationBroadcastResult | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const selectedRoleLabels = useMemo(
    () =>
      ROLE_OPTIONS.filter((option) => selectedRoles.includes(option.value)).map(
        (option) => option.label,
      ),
    [selectedRoles],
  );

  const toggleRole = (role: SuperAdminNotificationRole) => {
    setSelectedRoles((current) =>
      current.includes(role)
        ? current.filter((value) => value !== role)
        : [...current, role],
    );
  };

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    if (!trimmedTitle || !trimmedBody) {
      setFieldError("Title and message body are required.");
      return;
    }

    if (selectedRoles.length === 0) {
      setFieldError("Select at least one recipient role.");
      return;
    }

    let parsedData: Record<string, unknown> | undefined;

    try {
      parsedData = parseOptionalData(advancedData);
    } catch (error: any) {
      setFieldError(error?.message || "Advanced data must be valid JSON.");
      return;
    }

    setIsSubmitting(true);
    setFieldError(null);

    try {
      const response = await sendCustomSuperAdminNotification({
        title: trimmedTitle,
        body: trimmedBody,
        targetRoles: selectedRoles,
        data: parsedData,
      });

      setResult(response);
      toast({
        title: "Notification queued",
        description: `${formatCount(response.totalQueued)} recipients queued successfully.`,
      });
    } catch (error: any) {
      const message = error?.message || "Failed to send notification.";
      setFieldError(message);
      toast({
        title: "Send failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='grid gap-6 lg:grid-cols-[1.25fr_0.75fr]'>
      <Card className='border-border/70 shadow-sm'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Bell className='h-5 w-5 text-primary' />
            Compose notification
          </CardTitle>
          <CardDescription>
            Send a custom announcement to selected platform roles.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='notification-title'>Title</Label>
            <Input
              id='notification-title'
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder='System maintenance update'
              maxLength={200}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='notification-body'>Message</Label>
            <Textarea
              id='notification-body'
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder='Write the notification message here...'
              className='min-h-[160px]'
              maxLength={2000}
            />
          </div>

          <div className='space-y-3'>
            <div className='flex items-center justify-between gap-3'>
              <div>
                <Label>Recipient roles</Label>
                <p className='text-sm text-muted-foreground'>
                  Select one or more target roles for this announcement.
                </p>
              </div>
              <span className='text-xs font-medium text-muted-foreground'>
                {selectedRoles.length} selected
              </span>
            </div>

            <div className='grid gap-3 sm:grid-cols-3'>
              {ROLE_OPTIONS.map((option) => {
                const Icon = option.icon;
                const checked = selectedRoles.includes(option.value);

                return (
                  <button
                    key={option.value}
                    type='button'
                    onClick={() => toggleRole(option.value)}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-all hover:border-primary/60 hover:bg-muted/40",
                      checked && "border-primary bg-primary/5 shadow-sm",
                    )}
                  >
                    <div className='flex items-start gap-3'>
                      <Checkbox
                        checked={checked}
                        onClick={(event) => event.stopPropagation()}
                        onCheckedChange={() => toggleRole(option.value)}
                        aria-label={option.label}
                        className='mt-1'
                      />
                      <div className='min-w-0 flex-1'>
                        <div className='flex items-center gap-2'>
                          <Icon className='h-4 w-4 text-primary' />
                          <p className='font-semibold'>{option.label}</p>
                        </div>
                        <p className='mt-1 text-sm text-muted-foreground'>
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='advanced-data'>Advanced JSON data</Label>
            <Textarea
              id='advanced-data'
              value={advancedData}
              onChange={(event) => setAdvancedData(event.target.value)}
              className='min-h-[140px] font-mono text-sm'
              placeholder='{"clickAction": "/dashboard", "bannerId": "summer-campaign"}'
            />
            <p className='text-xs text-muted-foreground'>
              Optional. Leave as an empty object or include JSON metadata for
              downstream notification handling.
            </p>
          </div>

          {fieldError ? (
            <Alert variant='destructive'>
              <Megaphone className='h-4 w-4' />
              <AlertTitle>Unable to send notification</AlertTitle>
              <AlertDescription>{fieldError}</AlertDescription>
            </Alert>
          ) : null}

          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div className='text-sm text-muted-foreground'>
              {selectedRoleLabels.length > 0 ? (
                <span>Sending to: {selectedRoleLabels.join(", ")}</span>
              ) : (
                <span>No roles selected</span>
              )}
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className='gap-2 sm:w-auto'
            >
              {isSubmitting ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Megaphone className='h-4 w-4' />
              )}
              Send notification
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className='space-y-6'>
        <Card className='border-border/70 shadow-sm'>
          <CardHeader>
            <CardTitle>Delivery summary</CardTitle>
            <CardDescription>
              Review the last send result from the backend.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <dl className='grid gap-4 sm:grid-cols-2'>
                <div className='rounded-lg border bg-muted/30 p-3'>
                  <dt className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
                    Queued
                  </dt>
                  <dd className='mt-1 text-2xl font-bold'>
                    {formatCount(result.totalQueued)}
                  </dd>
                </div>
                <div className='rounded-lg border bg-muted/30 p-3'>
                  <dt className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
                    Recipients
                  </dt>
                  <dd className='mt-1 text-2xl font-bold'>
                    {formatCount(result.totalUsers)}
                  </dd>
                </div>
                <div className='rounded-lg border bg-muted/30 p-3'>
                  <dt className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
                    Failed
                  </dt>
                  <dd className='mt-1 text-2xl font-bold'>
                    {formatCount(result.failedCount)}
                  </dd>
                </div>
                <div className='rounded-lg border bg-muted/30 p-3'>
                  <dt className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
                    Type
                  </dt>
                  <dd className='mt-1 text-lg font-semibold'>
                    {result.type || "ADMIN_ANNOUNCEMENT"}
                  </dd>
                </div>
              </dl>
            ) : (
              <div className='rounded-lg border border-dashed p-6 text-sm text-muted-foreground'>
                No notification has been sent yet.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className='border-border/70 shadow-sm'>
          <CardHeader>
            <CardTitle>Usage notes</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3 text-sm text-muted-foreground'>
            <p>
              This page sends fixed{" "}
              <span className='font-semibold text-foreground'>
                ADMIN_ANNOUNCEMENT
              </span>
              notifications through the existing backend delivery pipeline.
            </p>
            <p>
              Customers, lab partners, and admins can be targeted together or
              separately. Superadmin recipients are intentionally excluded.
            </p>
            <p>
              Use the advanced JSON field only when you need extra payload data
              for downstream click actions or client-side context.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
