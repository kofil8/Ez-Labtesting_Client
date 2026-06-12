"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hook/use-toast";
import {
  Check,
  Copy,
  Facebook,
  Linkedin,
  Mail,
  Share2,
  Twitter,
} from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
  testName: string;
  testSlug: string;
  description?: string;
}

export function ShareButton({
  testName,
  testSlug,
  description,
}: ShareButtonProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/tests/${testSlug}`
      : "";
  const shareText = `Check out this lab test: ${testName}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Test link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: testName,
          text: description || shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled share or error occurred
        console.log("Share cancelled or failed", err);
      }
    }
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText,
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=550,height=420");
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl,
    )}`;
    window.open(url, "_blank", "width=550,height=420");
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareUrl,
    )}`;
    window.open(url, "_blank", "width=550,height=420");
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Lab Test: ${testName}`);
    const body = encodeURIComponent(
      `I thought you might be interested in this lab test:\n\n${testName}\n${
        description || ""
      }\n\n${shareUrl}`,
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  // Check if native share is available
  const hasNativeShare =
    typeof navigator !== "undefined" && navigator.share !== undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm' className='gap-2'>
          <Share2 className='h-4 w-4' />
          <span className='hidden sm:inline'>Share</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48'>
        <DropdownMenuItem onClick={handleCopyLink} className='gap-2'>
          {copied ? (
            <Check className='h-4 w-4 text-green-600' />
          ) : (
            <Copy className='h-4 w-4' />
          )}
          {copied ? "Copied!" : "Copy Link"}
        </DropdownMenuItem>

        {hasNativeShare && (
          <DropdownMenuItem onClick={handleNativeShare} className='gap-2'>
            <Share2 className='h-4 w-4' />
            Share...
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={shareOnTwitter} className='gap-2'>
          <Twitter className='h-4 w-4' />
          Twitter
        </DropdownMenuItem>

        <DropdownMenuItem onClick={shareOnFacebook} className='gap-2'>
          <Facebook className='h-4 w-4' />
          Facebook
        </DropdownMenuItem>

        <DropdownMenuItem onClick={shareOnLinkedIn} className='gap-2'>
          <Linkedin className='h-4 w-4' />
          LinkedIn
        </DropdownMenuItem>

        <DropdownMenuItem onClick={shareViaEmail} className='gap-2'>
          <Mail className='h-4 w-4' />
          Email
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
