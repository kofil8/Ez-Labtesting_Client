"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

const THEME_STORAGE_KEY = "ezlab-theme";
const THEME_CHANGE_EVENT = "ezlab-theme-change";

type StoredTheme = "light" | "dark";

function getPreferredTheme(): StoredTheme {
  // Always return light mode for now (dark mode disabled)
  if (typeof window === "undefined") return "light";

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  // Default to light mode; dark mode will be enabled later
  return "light";
}

function applyTheme(theme: StoredTheme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

function subscribeToThemeChanges(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const notify = () => callback();
  const notifySystemChange = () => {
    if (!window.localStorage.getItem(THEME_STORAGE_KEY)) {
      applyTheme(getPreferredTheme());
      callback();
    }
  };

  window.addEventListener(THEME_CHANGE_EVENT, notify);
  window.addEventListener("storage", notify);
  media.addEventListener("change", notifySystemChange);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, notify);
    window.removeEventListener("storage", notify);
    media.removeEventListener("change", notifySystemChange);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeToThemeChanges,
    getPreferredTheme,
    () => "light",
  );

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  };

  return (
    <Button
      type='button'
      variant='ghost'
      size='icon'
      onClick={toggleTheme}
      className='rounded-full text-muted-foreground hover:bg-muted hover:text-foreground'
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
    >
      {theme === "dark" ? (
        <Sun className='h-5 w-5' />
      ) : (
        <Moon className='h-5 w-5' />
      )}
    </Button>
  );
}
