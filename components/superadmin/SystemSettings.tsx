"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Loader2, Save } from "lucide-react";
import { useToast } from "@/hook/use-toast";
import { useEffect, useState } from "react";

interface SystemSetting {
  id: string;
  name: string;
  description: string;
  value: string | number | boolean;
  type: "text" | "number" | "boolean" | "select";
  options?: { label: string; value: string }[];
}

const INITIAL_SETTINGS: SystemSetting[] = [
  {
    id: "1",
    name: "Platform Name",
    description: "The name of the platform",
    value: "Ez LabTesting",
    type: "text",
  },
  {
    id: "2",
    name: "Support Email",
    description: "Email for customer support",
    value: "support@ezlabtesting.com",
    type: "text",
  },
  {
    id: "3",
    name: "Max Upload Size (MB)",
    description: "Maximum file upload size in megabytes",
    value: 50,
    type: "number",
  },
  {
    id: "4",
    name: "Enable Email Notifications",
    description: "Allow system to send email notifications",
    value: true,
    type: "boolean",
  },
  {
    id: "5",
    name: "Invoice Format",
    description: "Default invoice format for orders",
    value: "pdf",
    type: "select",
    options: [
      { label: "PDF", value: "pdf" },
      { label: "HTML", value: "html" },
      { label: "Both", value: "both" },
    ],
  },
  {
    id: "6",
    name: "Currency",
    description: "Platform currency",
    value: "USD",
    type: "select",
    options: [
      { label: "US Dollar (USD)", value: "USD" },
      { label: "Euro (EUR)", value: "EUR" },
      { label: "Canadian Dollar (CAD)", value: "CAD" },
    ],
  },
];

export function SystemSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SystemSetting[]>(INITIAL_SETTINGS);
  const [modifiedSettings, setModifiedSettings] = useState<
    Record<string, SystemSetting["value"]>
  >({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCurrentSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/superadmin/settings", {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch settings");
      const data = await response.json();
      if (data?.data) {
        const fetched = data.data as SystemSetting[];
        setSettings((prev) =>
          prev.map((s) => {
            const fetchedSetting = fetched.find((f) => f.id === s.id);
            return fetchedSetting ? { ...s, value: fetchedSetting.value } : s;
          }),
        );
      }
    } catch {
      toast({
        title: "Failed to fetch settings",
        description: "Unable to reach the server. Using local defaults.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      const updates = Object.entries(modifiedSettings).map(
        ([id, value]) => ({
          key: id,
          value,
        }),
      );

      const results = await Promise.all(
        updates.map((update) =>
          fetch("/api/v1/superadmin/settings", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(update),
          }),
        ),
      );

      const allOk = results.every((r) => r.ok);
      if (!allOk) {
        throw new Error("Some settings failed to save");
      }

      const updatedSettings = settings.map((setting) =>
        modifiedSettings.hasOwnProperty(setting.id)
          ? { ...setting, value: modifiedSettings[setting.id] }
          : setting,
      );
      setSettings(updatedSettings);
      setModifiedSettings({});
      setHasChanges(false);
      toast({ title: "Settings saved successfully" });
    } catch {
      toast({
        title: "Failed to save settings",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChanges = () => {
    setModifiedSettings({});
    setHasChanges(false);
  };

  const handleSettingChange = (
    id: string,
    newValue: SystemSetting["value"],
  ) => {
    setModifiedSettings({
      ...modifiedSettings,
      [id]: newValue,
    });
    setHasChanges(true);
  };

  useEffect(() => {
    fetchCurrentSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderSettingInput = (setting: SystemSetting) => {
    const value = modifiedSettings.hasOwnProperty(setting.id)
      ? modifiedSettings[setting.id]
      : setting.value;

    switch (setting.type) {
      case "text":
        return (
          <Input
            type='text'
            value={value as string}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
          />
        );
      case "number":
        return (
          <Input
            type='number'
            value={value as number}
            onChange={(e) =>
              handleSettingChange(setting.id, parseFloat(e.target.value) || 0)
            }
          />
        );
      case "boolean":
        return (
          <Select
            value={value ? "true" : "false"}
            onValueChange={(v) => handleSettingChange(setting.id, v === "true")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='true'>Enabled</SelectItem>
              <SelectItem value='false'>Disabled</SelectItem>
            </SelectContent>
          </Select>
        );
      case "select":
        return (
          <Select
            value={value as string}
            onValueChange={(v) => handleSettingChange(setting.id, v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {setting.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return null;
    }
  };

  const generalSettings = settings.slice(0, 3);
  const emailSettings = settings.slice(3, 4);
  const formatSettings = settings.slice(4);

  return (
    <div className='space-y-6'>
      {/* Warning Banner */}
      <div className='bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4 flex gap-3'>
        <AlertCircle className='h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5' />
        <div>
          <h3 className='font-semibold text-amber-900 dark:text-amber-200'>
            System Configuration
          </h3>
          <p className='text-sm text-amber-800 dark:text-amber-300 mt-1'>
            Changes to system settings affect the entire platform. Proceed with
            caution.
          </p>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue='general' className='w-full'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='general'>General</TabsTrigger>
          <TabsTrigger value='email'>Email</TabsTrigger>
          <TabsTrigger value='formats'>Formats</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value='general' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic platform settings
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              {generalSettings.map((setting) => (
                <div key={setting.id}>
                  <Label
                    htmlFor={setting.id}
                    className='text-base font-semibold'
                  >
                    {setting.name}
                  </Label>
                  <p className='text-sm text-muted-foreground mb-2'>
                    {setting.description}
                  </p>
                  {renderSettingInput(setting)}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value='email' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>
                Manage email notification settings
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              {emailSettings.map((setting) => (
                <div key={setting.id}>
                  <Label
                    htmlFor={setting.id}
                    className='text-base font-semibold'
                  >
                    {setting.name}
                  </Label>
                  <p className='text-sm text-muted-foreground mb-2'>
                    {setting.description}
                  </p>
                  {renderSettingInput(setting)}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Format Settings */}
        <TabsContent value='formats' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Format Settings</CardTitle>
              <CardDescription>
                Configure output formats and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              {formatSettings.map((setting) => (
                <div key={setting.id}>
                  <Label
                    htmlFor={setting.id}
                    className='text-base font-semibold'
                  >
                    {setting.name}
                  </Label>
                  <p className='text-sm text-muted-foreground mb-2'>
                    {setting.description}
                  </p>
                  {renderSettingInput(setting)}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Buttons */}
      {hasChanges && (
        <Card className='border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20'>
          <CardContent className='pt-6 flex gap-3 justify-end'>
            <Button variant='outline' onClick={handleResetChanges}>
              Discard Changes
            </Button>
            <Button
              onClick={handleSaveSettings}
              disabled={isLoading}
              className='gap-2 bg-red-600 hover:bg-red-700'
            >
              {isLoading ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Save className='h-4 w-4' />
              )}
              {isLoading ? "Saving..." : "Save Settings"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
