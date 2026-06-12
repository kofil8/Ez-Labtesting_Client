"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface MessageBubbleProps {
  message: {
    id: string;
    senderId: string;
    senderType: "CUSTOMER" | "ADMIN" | "SYSTEM";
    sender: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role?: string;
    };
    message: string;
    createdAt: string;
  };
  currentUserId: string;
}

export function MessageBubble({ message, currentUserId }: MessageBubbleProps) {
  const isCurrentUser = message.senderId === currentUserId;
  const isAdmin = message.senderType === "ADMIN";
  const isSystem = message.senderType === "SYSTEM";

  const senderName = isSystem
    ? "System"
    : isAdmin
      ? `Support Team (${message.sender.firstName || message.sender.email})`
      : message.sender.firstName
        ? `${message.sender.firstName} ${message.sender.lastName || ""}`
        : "You";

  return (
    <div
      className={cn(
        "flex w-full",
        isCurrentUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-3",
          isSystem
            ? "bg-muted text-muted-foreground text-center w-full max-w-full"
            : isCurrentUser
              ? "bg-primary text-primary-foreground"
              : isAdmin
                ? "bg-blue-500 text-white"
                : "bg-muted text-foreground",
        )}
      >
        {!isSystem && (
          <div className='text-xs font-medium mb-1 opacity-90'>
            {senderName}
          </div>
        )}
        <div className='text-sm whitespace-pre-wrap'>{message.message}</div>
        <div
          className={cn(
            "text-xs mt-1",
            isCurrentUser || isAdmin
              ? "text-primary-foreground/70"
              : "text-muted-foreground",
          )}
        >
          {format(new Date(message.createdAt), "MMM d, h:mm a")}
        </div>
      </div>
    </div>
  );
}
