"use client";

import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { useCustomerPanel } from "./CustomerPanelContext";

export function DashboardPanelToggleButton({ className }: { className?: string }) {
  const panelContext = useCustomerPanel();

  if (!panelContext) {
    return null;
  }

  const { isPanelHidden, togglePanel } = panelContext;

  return (
    <button
      type='button'
      onClick={togglePanel}
      aria-label={isPanelHidden ? "Show dashboard panel" : "Hide dashboard panel"}
      aria-controls='customer-dashboard-panel'
      aria-expanded={!isPanelHidden}
      title={isPanelHidden ? "Show dashboard panel" : "Hide dashboard panel"}
      className={cn(
        "flex shrink-0 items-center justify-center border shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        className,
      )}
    >
      <Menu className='h-5 w-5' />
    </button>
  );
}
