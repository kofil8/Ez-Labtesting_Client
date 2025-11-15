"use client";

import { ChatWidget } from "@/components/chat/ChatWidget";

// This component previously rendered a multi-action speed dial.
// Per new requirements, we only keep a functional Chat widget.
export function FloatingActionButton() {
  return <ChatWidget />;
}
