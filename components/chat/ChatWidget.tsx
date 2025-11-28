"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { MessageCircle, SendHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const systemPrompt =
  "You are Ez LabTesting's helpful support assistant. Be concise and friendly. When asked about orders, scheduling, or medical advice, include a gentle disclaimer and suggest contacting a licensed professional for medical decisions.";

const faqSuggestions = [
  {
    label: "How long do results take?",
    keywords: ["how long", "results", "turnaround", "time"],
    answer:
      "Most lab results are ready in 1–3 business days. Some specialized tests can take longer, while a few are available the same day. On our site you’ll see the expected turnaround time on each test page, and we’ll email you as soon as your results are ready.",
  },
  {
    label: "Do I need a doctor's order?",
    keywords: ["doctor", "order", "prescription", "referral"],
    answer:
      "In most cases you do not need your own doctor’s order. Our physician network reviews and authorizes the lab order where required, so you can purchase tests directly through the site. For complex medical conditions, we still recommend consulting your own provider before making testing decisions.",
  },
  {
    label: "Do I need to fast?",
    keywords: ["fast", "fasting", "food", "eat", "drink"],
    answer:
      "Some tests require fasting for 8–12 hours (for example, certain cholesterol or glucose tests). Each test page on our site clearly lists whether fasting is required and for how long. If you’re unsure, avoid heavy meals and contact our support or your healthcare provider for guidance.",
  },
  {
    label: "Do you take insurance?",
    keywords: ["insurance", "HSA", "FSA", "pay", "payment"],
    answer:
      "Most orders are self-pay at checkout and not billed directly to insurance. However, many customers use HSA/FSA cards, and you can usually submit your receipt to your insurance plan to see if they will reimburse you. For exact coverage, please check with your insurance provider.",
  },
  {
    label: "Are my results private?",
    keywords: ["private", "privacy", "hipaa", "secure", "confidential"],
    answer:
      "Yes. Your information and results are protected with industry-standard encryption and HIPAA-compliant safeguards. Only you and the ordering physician can see your results in the portal, unless you choose to share them.",
  },
  {
    label: "How do I schedule a lab visit?",
    keywords: ["schedule", "appointment", "lab", "location"],
    answer:
      "After you complete your order, you’ll receive instructions to choose a nearby partner lab and schedule your visit. In many areas you can walk in, but we recommend scheduling an appointment when possible to reduce wait times.",
  },
];

function findFaqAnswer(text: string): string | null {
  const lower = text.toLowerCase();
  for (const faq of faqSuggestions) {
    if (faq.keywords.some((kw) => lower.includes(kw))) {
      return faq.answer;
    }
  }
  return null;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I’m here to help with test selection, ordering, and general questions. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const conversationForApi = useMemo(
    () => [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    [messages]
  );

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const send = async (overrideText?: string) => {
    const trimmed = (overrideText ?? input).trim();
    if (!trimmed || isSending) return;

    // First, check for a predefined FAQ answer
    const faqAnswer = findFaqAnswer(trimmed);
    if (faqAnswer) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: trimmed },
        { role: "assistant", content: faqAnswer },
      ]);
      setInput("");
      return;
    }

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);
    
    // API integration removed
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Chat API integration has been removed. Please contact support directly for assistance.",
        },
      ]);
      setIsSending(false);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  return (
    <div className='fixed bottom-6 right-6 z-50'>
      {/* Toggle Button */}
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Button
          size='lg'
          onClick={() => setIsOpen((v) => !v)}
          className={cn(
            "h-14 w-14 rounded-full shadow-2xl bg-gradient-to-br from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700"
          )}
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          {isOpen ? (
            <X className='h-5 w-5' />
          ) : (
            <MessageCircle className='h-6 w-6' />
          )}
        </Button>
      </motion.div>

      {/* Chat Panel */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className='absolute bottom-20 right-0 w-[320px] sm:w-[380px]'
        >
          <Card className='shadow-2xl border-primary/20'>
            <CardHeader className='px-4 py-3 border-b bg-kalles-card-strong'>
              <div className='font-bold text-base'>
                Chat with Ez Lab Assistant
              </div>
              <div className='text-xs text-muted-foreground'>
                Typical reply: under a minute
              </div>
              <div className='mt-2 flex flex-wrap gap-2'>
                {faqSuggestions.slice(0, 4).map((faq) => (
                  <Button
                    key={faq.label}
                    variant='outline'
                    size='sm'
                    className='text-[11px] h-7 px-2 py-1'
                    onClick={() => void send(faq.label)}
                    disabled={isSending}
                  >
                    {faq.label}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent className='p-0'>
              <div className='h-[320px] overflow-y-auto'>
                <div ref={scrollRef} className='p-4 space-y-3'>
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={cn(
                        "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                        m.role === "user"
                          ? "ml-auto bg-primary text-primary-foreground"
                          : "mr-auto bg-muted"
                      )}
                    >
                      {m.content}
                    </div>
                  ))}
                  {isSending && (
                    <div className='mr-auto max-w-[85%] rounded-2xl px-3 py-2 text-sm bg-muted'>
                      <span className='opacity-70'>Assistant is typing…</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className='p-3 border-t bg-background'>
              <div className='flex w-full items-center gap-2'>
                <Input
                  placeholder='Type your message…'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isSending}
                />
                <Button
                  size='icon'
                  onClick={() => void send()}
                  disabled={isSending || !input.trim()}
                >
                  <SendHorizontal className='h-4 w-4' />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
