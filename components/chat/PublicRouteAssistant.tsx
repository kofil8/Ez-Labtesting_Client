"use client";

import {
  type AssistantContextKey,
  type AssistantQuickAction,
  HomepageLabAssistant,
} from "@/components/chat/HomepageLabAssistant";
import { useAuth } from "@/lib/auth-context";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

type AssistantConfig = {
  contextKey: AssistantContextKey;
  launcherTitle: string;
  launcherDescription: string;
  assistantTitle: string;
  welcomeMessage: string;
  quickActions: readonly AssistantQuickAction[];
  disclaimer: string;
};

const SHARED_DISCLAIMER =
  "Powered by AI | General support only | Not medical advice | Do not share personal or payment details";

const HOME_QUICK_ACTIONS: readonly AssistantQuickAction[] = [
  {
    label: "Pick a test",
    prompt: "Help me choose the right lab test for my needs.",
  },
  {
    label: "How it works",
    prompt: "Explain how Ez LabTesting works from ordering to getting results.",
  },
  {
    label: "Result timing",
    prompt: "How long do most test results take?",
  },
];

const TESTS_QUICK_ACTIONS: readonly AssistantQuickAction[] = [
  {
    label: "Compare tests",
    prompt: "Help me compare popular test options and what each one is used for.",
  },
  {
    label: "Fasting rules",
    prompt: "Which lab tests usually require fasting, and how can I check before ordering?",
  },
  {
    label: "Pricing help",
    prompt: "Explain test pricing, turnaround time, and what to expect before checkout.",
  },
];

const PANELS_QUICK_ACTIONS: readonly AssistantQuickAction[] = [
  {
    label: "Compare panels",
    prompt: "Help me compare panel options and what each panel includes.",
  },
  {
    label: "What's included?",
    prompt: "How can I tell what biomarkers or tests are included in a panel?",
  },
  {
    label: "Who is it for?",
    prompt: "Help me understand which type of panel may fit different goals.",
  },
];

const SUPPORT_QUICK_ACTIONS: readonly AssistantQuickAction[] = [
  {
    label: "Contact support",
    prompt: "How can I contact Ez LabTesting support for help?",
  },
  {
    label: "Refund policy",
    prompt: "Explain the refund policy in simple terms.",
  },
  {
    label: "Results help",
    prompt: "Where do customers get results and what should they do if they need help?",
  },
];

const LABS_QUICK_ACTIONS: readonly AssistantQuickAction[] = [
  {
    label: "Find a lab",
    prompt: "Help me understand how to find a nearby lab center.",
  },
  {
    label: "Book a visit",
    prompt: "How do I schedule or prepare for a lab visit?",
  },
  {
    label: "What to bring",
    prompt: "What should I bring to the lab center for sample collection?",
  },
];

const AUTH_QUICK_ACTIONS: readonly AssistantQuickAction[] = [
  {
    label: "Create account",
    prompt: "How do I create an Ez LabTesting account?",
  },
  {
    label: "Sign in help",
    prompt: "Help me with common login and account access issues.",
  },
  {
    label: "Reset password",
    prompt: "How does the forgot password process work?",
  },
];

function matchesPath(pathname: string, route: string) {
  if (route === "/") {
    return pathname === "/";
  }

  return pathname === route || pathname.startsWith(`${route}/`);
}

function getAssistantConfig(pathname: string): AssistantConfig | null {
  if (matchesPath(pathname, "/")) {
    return {
      contextKey: "home",
      launcherTitle: "Need help choosing a test?",
      launcherDescription:
        "Ask about tests, pricing, lab visits, and result timing.",
      assistantTitle: "Ez Lab Assistant",
      welcomeMessage:
        "Hi! I can help you browse tests, understand pricing, explain turnaround times, and point you to the right public pages before you create an account.",
      quickActions: HOME_QUICK_ACTIONS,
      disclaimer: SHARED_DISCLAIMER,
    };
  }

  if (matchesPath(pathname, "/tests")) {
    return {
      contextKey: "tests",
      launcherTitle: "Questions about lab tests?",
      launcherDescription:
        "Ask about test categories, preparation, pricing, and turnaround.",
      assistantTitle: "Test Selection Assistant",
      welcomeMessage:
        "I can help you compare tests, understand common preparation rules, and explain what to expect before ordering.",
      quickActions: TESTS_QUICK_ACTIONS,
      disclaimer: SHARED_DISCLAIMER,
    };
  }

  if (matchesPath(pathname, "/panels")) {
    return {
      contextKey: "panels",
      launcherTitle: "Need help comparing panels?",
      launcherDescription:
        "Ask what each panel includes and how to compare your options.",
      assistantTitle: "Panel Comparison Assistant",
      welcomeMessage:
        "I can help you compare panel options, explain what they include, and answer common pre-order questions.",
      quickActions: PANELS_QUICK_ACTIONS,
      disclaimer: SHARED_DISCLAIMER,
    };
  }

  if (matchesPath(pathname, "/find-lab-center")) {
    return {
      contextKey: "labs",
      launcherTitle: "Need help finding a lab?",
      launcherDescription:
        "Ask about locations, scheduling, and what to bring to your visit.",
      assistantTitle: "Lab Visit Assistant",
      welcomeMessage:
        "I can help with lab-center basics like finding a location, scheduling a visit, and preparing for sample collection.",
      quickActions: LABS_QUICK_ACTIONS,
      disclaimer: SHARED_DISCLAIMER,
    };
  }

  if (matchesPath(pathname, "/help-center")) {
    return {
      contextKey: "support",
      launcherTitle: "Need quick support help?",
      launcherDescription:
        "Ask about support options, refunds, results, and next steps.",
      assistantTitle: "Support Assistant",
      welcomeMessage:
        "I can help you find support options, explain common policies, and point you to the right public resources.",
      quickActions: SUPPORT_QUICK_ACTIONS,
      disclaimer: SHARED_DISCLAIMER,
    };
  }

  if (
    matchesPath(pathname, "/login") ||
    matchesPath(pathname, "/register") ||
    matchesPath(pathname, "/forgot-password") ||
    matchesPath(pathname, "/reset-password")
  ) {
    return {
      contextKey: "auth",
      launcherTitle: "Need account help?",
      launcherDescription:
        "Ask about signing in, registering, or resetting your password.",
      assistantTitle: "Account Help Assistant",
      welcomeMessage:
        "I can help with account basics like creating an account, signing in, and resetting a password. For account-specific issues, use support instead of sharing private details here.",
      quickActions: AUTH_QUICK_ACTIONS,
      disclaimer: SHARED_DISCLAIMER,
    };
  }

  return null;
}

export function PublicRouteAssistant() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  const assistantConfig = useMemo(
    () => getAssistantConfig(pathname),
    [pathname],
  );

  if (isLoading || isAuthenticated || !assistantConfig) {
    return null;
  }

  return <HomepageLabAssistant key={pathname} {...assistantConfig} />;
}
