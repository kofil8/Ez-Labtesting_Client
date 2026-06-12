"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hook/use-toast";
import { requestSupport } from "@/lib/services/order.service";
import { AlertCircle, Send } from "lucide-react";
import { useState } from "react";

interface ManualLabSupportRequestProps {
  orderId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

type IssueType =
  | "lab_submission_failed"
  | "payment_issue"
  | "address_issue"
  | "other";

const ISSUE_LABELS: Record<IssueType, string> = {
  lab_submission_failed: "Lab Submission Failed",
  payment_issue: "Payment Issue",
  address_issue: "Address/Location Issue",
  other: "Other Issue",
};

export default function ManualLabSupportRequest({
  orderId,
  onSuccess,
  onError,
}: ManualLabSupportRequestProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [issueType, setIssueType] = useState<IssueType>(
    "lab_submission_failed",
  );
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide email and description.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await requestSupport(orderId, {
        type: issueType,
        email,
        phone: phone || undefined,
        description: description.trim(),
        timestamp: new Date().toISOString(),
      });

      toast({
        title: "Support Request Submitted",
        description:
          "Our team will investigate and contact you shortly. Check your email for updates.",
      });

      // Reset form
      setEmail("");
      setPhone("");
      setDescription("");
      setIssueType("lab_submission_failed");

      onSuccess?.();
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to submit request");
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      onError?.(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-6 space-y-4'
    >
      <div className='flex items-start gap-3'>
        <AlertCircle className='h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0' />
        <div>
          <h3 className='font-semibold'>Lab Order Issue</h3>
          <p className='text-sm text-muted-foreground'>
            Tell us what went wrong so our team can resolve it manually
          </p>
        </div>
      </div>

      <div className='space-y-3'>
        <div>
          <label className='text-sm font-medium'>Issue Type *</label>
          <Select
            value={issueType}
            onValueChange={(v) => setIssueType(v as IssueType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(ISSUE_LABELS) as Array<[IssueType, string]>).map(
                ([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className='text-sm font-medium'>Email Address *</label>
          <Input
            type='email'
            placeholder='your@email.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className='text-sm font-medium'>Phone (Optional)</label>
          <Input
            type='tel'
            placeholder='+1 (555) 000-0000'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className='text-sm font-medium'>Describe the Issue *</label>
          <Textarea
            placeholder='Please provide details about what happened...'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            rows={4}
            className='resize-none'
          />
          <p className='text-xs text-muted-foreground mt-1'>
            Order ID: {orderId}
          </p>
        </div>
      </div>

      <div className='pt-2'>
        <Button
          type='submit'
          disabled={isSubmitting || !email || !description.trim()}
          className='w-full'
        >
          {isSubmitting ? (
            <>
              <span className='animate-spin mr-2'>⟳</span>
              Submitting...
            </>
          ) : (
            <>
              <Send className='h-4 w-4 mr-2' />
              Submit Support Request
            </>
          )}
        </Button>
      </div>

      <div className='bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded p-3 text-sm'>
        <p className='font-medium text-blue-900 dark:text-blue-100 mb-1'>
          What happens next:
        </p>
        <ul className='text-xs text-blue-800 dark:text-blue-200 space-y-1'>
          <li>• Our support team reviews your request</li>
          <li>• We investigate the lab order issue</li>
          <li>• We manually submit your order if possible</li>
          <li>• You'll receive email updates with status</li>
        </ul>
      </div>
    </form>
  );
}
