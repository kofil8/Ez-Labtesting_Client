"use client";

import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface CapsLockIndicatorProps {
  className?: string;
}

export function CapsLockIndicator({ className = "" }: CapsLockIndicatorProps) {
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  useEffect(() => {
    const handleKeyChange = (e: KeyboardEvent) => {
      // Use getModifierState to detect Caps Lock
      const capsLockState = e.getModifierState?.("CapsLock") ?? false;
      setIsCapsLockOn(capsLockState);
    };

    window.addEventListener("keydown", handleKeyChange);
    window.addEventListener("keyup", handleKeyChange);

    return () => {
      window.removeEventListener("keydown", handleKeyChange);
      window.removeEventListener("keyup", handleKeyChange);
    };
  }, []);

  // Only render if Caps Lock is detected
  if (!isCapsLockOn) return null;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-md animate-in fade-in slide-in-from-top-1 duration-200 ${className}`}
      role='alert'
      aria-live='polite'
    >
      <AlertCircle className='h-4 w-4 text-amber-600 flex-shrink-0' />
      <span className='text-sm font-medium text-amber-900'>
        Caps Lock is on
      </span>
    </div>
  );
}
