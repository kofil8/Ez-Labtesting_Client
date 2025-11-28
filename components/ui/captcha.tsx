"use client";

// TODO: Re-enable reCAPTCHA
import { forwardRef } from "react";
// import { forwardRef, useEffect, useState } from "react";
// import ReCAPTCHA from "react-google-recaptcha";

interface CaptchaProps {
  onChange: (token: string | null) => void;
  onExpired?: () => void;
  onError?: () => void;
}

// TODO: Re-enable reCAPTCHA - uncomment the code below
export const Captcha = forwardRef<any, CaptchaProps>(
  ({ onChange, onExpired, onError }, ref) => {
    // Temporarily disabled - returns null
    return null;

    /* TODO: Re-enable reCAPTCHA - uncomment below
    const [siteKey, setSiteKey] = useState<string>("");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
      const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
      setSiteKey(key);

      if (!key) {
        console.warn(
          "reCAPTCHA site key is not configured. Please set NEXT_PUBLIC_RECAPTCHA_SITE_KEY in your environment variables."
        );
      }
    }, []);

    const handleError = () => {
      console.error("reCAPTCHA error occurred");
      if (onError) {
        onError();
      }
      // Also call onChange with null to reset the form state
      onChange(null);
    };

    if (!isMounted) {
      return null;
    }

    if (!siteKey) {
      return (
        <div className='flex justify-center p-4 border border-destructive rounded-md bg-destructive/10'>
          <p className='text-sm text-destructive'>
            reCAPTCHA is not configured. Please contact support.
          </p>
        </div>
      );
    }

    return (
      <div className='flex justify-center'>
        <ReCAPTCHA
          ref={ref}
          sitekey={siteKey}
          onChange={onChange}
          onExpired={onExpired}
          onErrored={handleError}
          theme='light'
          size='normal' // v2 checkbox reCAPTCHA
        />
      </div>
    );
    */
  }
);

Captcha.displayName = "Captcha";
