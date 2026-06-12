"use client";

import type { SupportMessage } from "@/components/support/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  connectSupportSocket,
  getSupportSocket,
  joinTicket,
  leaveTicket,
  onNewMessage,
  onError as onSocketError,
  sendMessage,
} from "@/lib/services/support.socket";
import { cn } from "@/lib/utils";
import { Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MessageBubble } from "./MessageBubble";

interface SupportChatProps {
  ticketId: string;
  currentUserId: string;
  initialMessages: SupportMessage[];
  ticketStatus: string;
  onTicketUpdate?: (status: string) => void;
  className?: string;
}

export function SupportChat({
  ticketId,
  currentUserId,
  initialMessages,
  ticketStatus,
  onTicketUpdate,
  className,
}: SupportChatProps) {
  const [messages, setMessages] = useState<SupportMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [socketError, setSocketError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Connect to socket and join ticket room
  useEffect(() => {
    let cleanup: (() => void) | null = null;

    const setupSocket = async () => {
      try {
        await connectSupportSocket();
        setIsConnected(true);
        await joinTicket(ticketId);

        // Subscribe to new messages
        const cleanupMessages = onNewMessage((message: SupportMessage) => {
          if (message.ticketId === ticketId) {
            setMessages((prev) => {
              if (prev.find((m) => m.id === message.id)) return prev;
              return [...prev, message];
            });
          }
        });

        const cleanupErrors = onSocketError((err) => {
          console.error("Support socket error:", err);
          setSocketError(err.message);
          setTimeout(() => setSocketError(null), 5000);
        });

        cleanup = () => {
          cleanupMessages();
          cleanupErrors();
        };
      } catch (error) {
        console.error("Failed to connect support socket:", error);
        // Still allow sending if socket object exists even if join failed
        const raw = getSupportSocket();
        if (raw?.connected) setIsConnected(true);
      }
    };

    setupSocket();

    // Cleanup on unmount
    return () => {
      if (cleanup) {
        cleanup();
      }
      leaveTicket(ticketId).catch(console.error);
    };
  }, [ticketId]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!newMessage.trim() || ticketStatus === "CLOSED" || isSending) {
      return;
    }

    setIsSending(true);

    try {
      await sendMessage(ticketId, newMessage.trim());
      setNewMessage("");
      inputRef.current?.focus();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const isTicketClosed =
    ticketStatus === "CLOSED" || ticketStatus === "RESOLVED";

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Messages Area */}
      <ScrollArea className='flex-1 p-4' ref={scrollRef}>
        <div className='space-y-4'>
          {messages.length === 0 ? (
            <div className='text-center text-muted-foreground py-8'>
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                currentUserId={currentUserId}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className='border-t p-4'>
        {isTicketClosed ? (
          <div className='text-center text-muted-foreground py-2'>
            This ticket is {ticketStatus.toLowerCase()}. To continue the
            conversation, please create a new ticket.
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className='flex gap-2'>
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder='Type your message...'
              disabled={!isConnected || isSending}
              className='flex-1'
            />
            <Button
              type='submit'
              disabled={!isConnected || !newMessage.trim() || isSending}
              size='icon'
            >
              {isSending ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Send className='h-4 w-4' />
              )}
            </Button>
          </form>
        )}
        {!isConnected && !isTicketClosed && (
          <div className='text-xs text-muted-foreground mt-2 text-center'>
            Connecting to chat...
          </div>
        )}
        {socketError && (
          <div className='text-xs text-destructive mt-2 text-center'>
            {socketError}
          </div>
        )}
      </div>
    </div>
  );
}
