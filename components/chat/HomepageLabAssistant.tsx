"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  LoaderCircle,
  Mic,
  MicOff,
  SendHorizontal,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type ChatRole = "user" | "assistant";
export type AssistantContextKey =
  | "home"
  | "tests"
  | "panels"
  | "support"
  | "labs"
  | "auth";

export type AssistantQuickAction = {
  label: string;
  prompt: string;
};

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  status: "streaming" | "done";
};

type ConnectionState = "idle" | "connecting" | "connected" | "unavailable";

type RealtimeServerEvent = {
  type: string;
  delta?: string;
  error?: {
    message?: string;
  };
  item_id?: string;
  response_id?: string;
  transcript?: string;
};

type SessionTokenResponse = {
  clientSecret?: {
    value?: string;
    expiresAt?: number;
  };
  error?: string;
};

type HomepageLabAssistantProps = {
  contextKey?: AssistantContextKey;
  launcherTitle?: string;
  launcherDescription?: string;
  assistantTitle?: string;
  welcomeMessage?: string;
  quickActions?: readonly AssistantQuickAction[];
  disclaimer?: string;
};

type AssistantOpenEventDetail = {
  contextKey?: AssistantContextKey;
};

const QUICK_ACTIONS = [
  {
    label: "Browse test categories",
    prompt: "Help me browse your main test categories.",
  },
  {
    label: "How does this work?",
    prompt: "Explain how Ez LabTesting works from ordering to getting results.",
  },
  {
    label: "STD testing options",
    prompt: "What STD testing options do you offer and how fast are results?",
  },
] satisfies readonly AssistantQuickAction[];

const WELCOME_MESSAGE =
  "Hi there! I'm your lab test assistant. Ask me about tests, pricing, turnaround times, or how the process works.";

const DISCLAIMER =
  "Powered by AI · Not medical advice · Do not share personal health info";

function createRealtimeItemId(prefix: string): string {
  const randomPart = Math.random().toString(36).slice(2, 12);
  const timePart = Date.now().toString(36).slice(-8);
  return `${prefix}_${timePart}${randomPart}`.slice(0, 32);
}

function createMessage(
  id: string,
  role: ChatRole,
  content: string,
  status: ChatMessage["status"] = "done",
): ChatMessage {
  return { id, role, content, status };
}

function upsertMessage(
  messages: ChatMessage[],
  nextMessage: ChatMessage,
  mode: "replace" | "append",
): ChatMessage[] {
  const existingIndex = messages.findIndex((message) => message.id === nextMessage.id);

  if (existingIndex === -1) {
    return [...messages, nextMessage];
  }

  const existing = messages[existingIndex];
  const updated: ChatMessage = {
    ...existing,
    role: nextMessage.role,
    status: nextMessage.status,
    content:
      mode === "append" ? `${existing.content}${nextMessage.content}` : nextMessage.content,
  };

  const copy = [...messages];
  copy[existingIndex] = updated;
  return copy;
}

function getMicErrorMessage(error: unknown, secureContext: boolean): string {
  if (!secureContext) {
    return "Voice mode needs HTTPS or another secure browser context.";
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "NotAllowedError"
  ) {
    return "Microphone permission was denied. Typed chat is still available.";
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "NotFoundError"
  ) {
    return "No microphone was found on this device.";
  }

  return "Voice mode is unavailable in this browser session.";
}

export function HomepageLabAssistant({
  contextKey = "home",
  launcherTitle = "Talk to our assistant",
  launcherDescription = "Ask about tests, pricing, and results with voice or chat.",
  assistantTitle = "Ez Lab Assistant",
  welcomeMessage = WELCOME_MESSAGE,
  quickActions = QUICK_ACTIONS,
  disclaimer = DISCLAIMER,
}: HomepageLabAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLauncherPopup, setShowLauncherPopup] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [connectionState, setConnectionState] = useState<ConnectionState>("idle");
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [micAvailable, setMicAvailable] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [isRequestingMic, setIsRequestingMic] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const audioSenderRef = useRef<RTCRtpSender | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const mutedRef = useRef(isMuted);

  const canSend = connectionState === "connected" && input.trim().length > 0;
  const voiceButtonDisabled =
    connectionState !== "connected" || isRequestingMic;

  const statusLabel = useMemo(() => {
    if (connectionState === "connecting") return "Connecting";
    if (connectionState === "unavailable") return "Unavailable";
    if (isListening) return "Listening";
    if (isAssistantSpeaking) return "Assistant speaking";
    if (voiceEnabled && micAvailable) return "Voice on";
    if (connectionState === "connected") return "Ready";
    return "Starting";
  }, [
    connectionState,
    isAssistantSpeaking,
    isListening,
    micAvailable,
    voiceEnabled,
  ]);

  useEffect(() => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen, connectionState, isAssistantSpeaking, isListening]);

  useEffect(() => {
    mutedRef.current = isMuted;

    if (!audioRef.current) return;

    audioRef.current.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const handleOpenAssistant = (event: Event) => {
      const customEvent = event as CustomEvent<AssistantOpenEventDetail>;
      const targetContext = customEvent.detail?.contextKey;

      if (targetContext && targetContext !== contextKey) {
        return;
      }

      setShowLauncherPopup(false);
      setIsOpen(true);
    };

    window.addEventListener("ezlab:open-assistant", handleOpenAssistant);

    return () => {
      window.removeEventListener("ezlab:open-assistant", handleOpenAssistant);
    };
  }, [contextKey]);

  function teardownSession() {
    dataChannelRef.current?.close();
    dataChannelRef.current = null;

    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    audioSenderRef.current = null;

    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.srcObject = null;
      audioRef.current = null;
    }
  }

  useEffect(() => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = voiceEnabled;
    }
  }, [voiceEnabled]);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    const connect = async () => {
      setConnectionState("connecting");
      setConnectionError(null);
      setMicError(null);
      setMicAvailable(false);
      setVoiceEnabled(false);
      setIsListening(false);
      setIsAssistantSpeaking(false);

      const audioElement = document.createElement("audio");
      audioElement.autoplay = true;
      audioElement.setAttribute("playsinline", "true");
      audioElement.muted = mutedRef.current;
      audioRef.current = audioElement;

      const tokenResponse = await fetch("/api/openai/realtime-session", {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contextKey }),
      });

      const tokenData = (await tokenResponse.json()) as SessionTokenResponse;
      const ephemeralKey = tokenData.clientSecret?.value;

      if (!tokenResponse.ok || !ephemeralKey) {
        throw new Error(
          tokenData.error || "The AI assistant is not available right now.",
        );
      }

      const peerConnection = new RTCPeerConnection();
      peerConnectionRef.current = peerConnection;
      audioSenderRef.current = peerConnection.addTransceiver("audio", {
        direction: "sendrecv",
      }).sender;

      peerConnection.ontrack = (event) => {
        if (!audioRef.current) return;
        audioRef.current.srcObject = event.streams[0];
        void audioRef.current.play().catch(() => undefined);
      };

      const dataChannel = peerConnection.createDataChannel("oai-events");
      dataChannelRef.current = dataChannel;

      dataChannel.addEventListener("open", () => {
        if (cancelled) return;
        setConnectionState("connected");
      });

      dataChannel.addEventListener("close", () => {
        if (cancelled) return;
        setConnectionState("unavailable");
        setConnectionError("The assistant session closed unexpectedly.");
        setIsListening(false);
        setIsAssistantSpeaking(false);
      });

      dataChannel.addEventListener("error", () => {
        if (cancelled) return;
        setConnectionState("unavailable");
        setConnectionError("The assistant data channel failed.");
      });

      dataChannel.addEventListener("message", (event) => {
        if (cancelled) return;

        const payload = JSON.parse(event.data) as RealtimeServerEvent;

        switch (payload.type) {
          case "input_audio_buffer.speech_started":
            setIsListening(true);
            setIsAssistantSpeaking(false);
            break;
          case "input_audio_buffer.speech_stopped":
            setIsListening(false);
            break;
          case "output_audio_buffer.started":
            setIsAssistantSpeaking(true);
            break;
          case "output_audio_buffer.stopped":
          case "output_audio_buffer.cleared":
            setIsAssistantSpeaking(false);
            break;
          case "conversation.item.input_audio_transcription.delta":
            if (!payload.item_id || !payload.delta) break;
            {
              const itemId = payload.item_id;
              const delta = payload.delta;

            setMessages((current) =>
              upsertMessage(
                current,
                createMessage(itemId, "user", delta, "streaming"),
                "append",
              ),
            );
            }
            break;
          case "conversation.item.input_audio_transcription.completed":
            if (!payload.item_id || !payload.transcript) break;
            {
              const itemId = payload.item_id;
              const transcript = payload.transcript;

            setMessages((current) =>
              upsertMessage(
                current,
                createMessage(itemId, "user", transcript, "done"),
                "replace",
              ),
            );
            }
            break;
          case "response.output_audio_transcript.delta":
            if (!payload.item_id || !payload.delta) break;
            {
              const itemId = payload.item_id;
              const delta = payload.delta;

            setMessages((current) =>
              upsertMessage(
                current,
                createMessage(
                  itemId,
                  "assistant",
                  delta,
                  "streaming",
                ),
                "append",
              ),
            );
            }
            break;
          case "response.output_audio_transcript.done":
            if (!payload.item_id || !payload.transcript) break;
            {
              const itemId = payload.item_id;
              const transcript = payload.transcript;

            setMessages((current) =>
              upsertMessage(
                current,
                createMessage(
                  itemId,
                  "assistant",
                  transcript,
                  "done",
                ),
                "replace",
              ),
            );
            }
            break;
          case "error":
            setConnectionError(
              payload.error?.message || "The AI assistant hit an unexpected error.",
            );
            break;
          default:
            break;
        }
      });

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      const sdpResponse = await fetch("https://api.openai.com/v1/realtime/calls", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ephemeralKey}`,
          "Content-Type": "application/sdp",
        },
        body: offer.sdp,
      });

      if (!sdpResponse.ok) {
        const errorText = await sdpResponse.text();
        throw new Error(errorText || "Failed to establish the realtime call.");
      }

      const answer = {
        type: "answer" as RTCSdpType,
        sdp: await sdpResponse.text(),
      };

      await peerConnection.setRemoteDescription(answer);
    };

    void connect().catch((error: unknown) => {
      if (cancelled) return;

      teardownSession();
      setConnectionState("unavailable");
      setConnectionError(
        error instanceof Error
          ? error.message
          : "The AI assistant is unavailable.",
      );
    });

    return () => {
      cancelled = true;
      teardownSession();
      setMessages([]);
      setInput("");
      setConnectionState("idle");
      setConnectionError(null);
      setMicError(null);
      setMicAvailable(false);
      setVoiceEnabled(false);
      setIsRequestingMic(false);
      setIsListening(false);
      setIsAssistantSpeaking(false);
    };
  }, [contextKey, isOpen]);

  const sendRealtimeEvent = (payload: Record<string, unknown>) => {
    if (dataChannelRef.current?.readyState !== "open") {
      setConnectionError("The assistant is still connecting. Try again in a moment.");
      return;
    }

    dataChannelRef.current.send(JSON.stringify(payload));
  };

  const sendTextMessage = (messageText?: string) => {
    const text = (messageText ?? input).trim();
    if (!text || connectionState !== "connected") return;

    const itemId = createRealtimeItemId("usr");

    setMessages((current) => [
      ...current,
      createMessage(itemId, "user", text, "done"),
    ]);
    setInput("");

    if (isAssistantSpeaking) {
      sendRealtimeEvent({ type: "response.cancel" });
      sendRealtimeEvent({ type: "output_audio_buffer.clear" });
    }

    sendRealtimeEvent({
      type: "conversation.item.create",
      item: {
        id: itemId,
        type: "message",
        role: "user",
        content: [
          {
            type: "input_text",
            text,
          },
        ],
      },
    });

    sendRealtimeEvent({ type: "response.create" });
  };

  const ensureMicrophoneAccess = async () => {
    const existingTrack = localStreamRef.current?.getAudioTracks()[0];
    if (existingTrack) {
      setMicAvailable(true);
      setMicError(null);
      return true;
    }

    const secureContext = window.isSecureContext;

    if (
      !secureContext ||
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      setMicAvailable(false);
      setMicError(getMicErrorMessage(null, secureContext));
      return false;
    }

    setIsRequestingMic(true);
    setMicError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioTrack = stream.getAudioTracks()[0];

      if (!audioTrack) {
        stream.getTracks().forEach((track) => track.stop());
        setMicAvailable(false);
        setMicError("No microphone was found on this device.");
        return false;
      }

      await audioSenderRef.current?.replaceTrack(audioTrack);
      localStreamRef.current = stream;
      setMicAvailable(true);
      return true;
    } catch (error) {
      setMicAvailable(false);
      setMicError(getMicErrorMessage(error, secureContext));
      return false;
    } finally {
      setIsRequestingMic(false);
    }
  };

  const toggleVoiceMode = async () => {
    if (voiceButtonDisabled) return;

    if (voiceEnabled) {
      await audioSenderRef.current?.replaceTrack(null);
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      setMicAvailable(false);
      setVoiceEnabled(false);
      setIsListening(false);
      return;
    }

    const hasMicrophone = await ensureMicrophoneAccess();
    if (!hasMicrophone) return;

    setVoiceEnabled(true);
    setIsListening(false);
  };

  return (
    <div className='fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6'>
      <AnimatePresence initial={false}>
        {!isOpen ? (
          <motion.div
            key='assistant-launcher'
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12 }}
            className='relative flex flex-col items-end gap-3'
          >
            <AnimatePresence>
              {showLauncherPopup && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  className='relative w-[220px] rounded-[22px] border border-blue-100 bg-white/95 p-3 pr-10 text-left shadow-[0_18px_36px_rgba(37,99,235,0.12)] backdrop-blur'
                >
                  <button
                    type='button'
                    aria-label='Dismiss assistant popup'
                    className='absolute right-2 top-2 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600'
                    onClick={() => setShowLauncherPopup(false)}
                  >
                    <X className='h-3.5 w-3.5' />
                  </button>
                  <div className='flex items-start gap-3'>
                    <div className='mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600'>
                      <Bot className='h-5 w-5' />
                    </div>
                    <div className='min-w-0'>
                      <p className='text-sm font-semibold text-slate-800'>
                        {launcherTitle}
                      </p>
                      <p className='mt-1 text-xs leading-5 text-slate-500'>
                        {launcherDescription}
                      </p>
                    </div>
                  </div>
                  <div className='absolute -bottom-2 right-7 h-4 w-4 rotate-45 border-b border-r border-blue-100 bg-white' />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type='button'
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className='group relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white shadow-[0_18px_40px_rgba(37,99,235,0.3)] transition-shadow hover:shadow-[0_24px_44px_rgba(37,99,235,0.38)]'
              aria-label='Open lab assistant'
              onClick={() => {
                setShowLauncherPopup(false);
                setIsOpen(true);
              }}
            >
              <span className='absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.28),transparent_55%)]' />
              <span className='relative flex items-center justify-center'>
                <Bot className='h-6 w-6' />
              </span>
            </motion.button>
          </motion.div>
        ) : (
          <motion.section
            key='assistant-panel'
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className='w-[min(calc(100vw-1.5rem),380px)] overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_28px_60px_rgba(15,23,42,0.18)]'
          >
            <div className='flex items-center justify-between bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 px-5 py-4 text-white'>
              <div className='flex items-center gap-2.5'>
                <span className='h-2.5 w-2.5 rounded-full bg-[#5CE17C]' />
                <div>
                  <p className='text-[1.05rem] font-semibold leading-none'>
                    {assistantTitle}
                  </p>
                  <p className='mt-1 text-xs text-white/80'>{statusLabel}</p>
                </div>
              </div>

              <div className='flex items-center gap-1'>
                <button
                  type='button'
                  aria-label={isMuted ? "Unmute assistant voice" : "Mute assistant voice"}
                  className='rounded-full p-2 text-white/80 transition-colors hover:bg-white/12 hover:text-white'
                  onClick={() => setIsMuted((current) => !current)}
                >
                  {isMuted ? (
                    <VolumeX className='h-4 w-4' />
                  ) : (
                    <Volume2 className='h-4 w-4' />
                  )}
                </button>
                <button
                  type='button'
                  aria-label={voiceEnabled ? "Turn microphone off" : "Turn microphone on"}
                  className='rounded-full p-2 text-white/80 transition-colors hover:bg-white/12 hover:text-white disabled:cursor-not-allowed disabled:opacity-50'
                  disabled={voiceButtonDisabled}
                  onClick={toggleVoiceMode}
                >
                  {voiceEnabled ? (
                    <Mic className='h-4 w-4' />
                  ) : (
                    <MicOff className='h-4 w-4' />
                  )}
                </button>
                <button
                  type='button'
                  aria-label='Close lab assistant'
                  className='rounded-full p-2 text-white/80 transition-colors hover:bg-white/12 hover:text-white'
                  onClick={() => setIsOpen(false)}
                >
                  <X className='h-4 w-4' />
                </button>
              </div>
            </div>

            <div className='bg-[#fcfefe] px-4 pb-4 pt-5'>
              <div className='mb-4 flex flex-wrap gap-2.5'>
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    type='button'
                    className='rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60'
                    disabled={connectionState !== "connected"}
                    onClick={() => sendTextMessage(action.prompt)}
                  >
                    {action.label}
                  </button>
                ))}
              </div>

              <div
                ref={scrollRef}
                className='max-h-[300px] min-h-[210px] space-y-3 overflow-y-auto pr-1'
              >
                {messages.length === 0 && (
                  <div className='rounded-[18px] border border-blue-100 bg-blue-50/70 px-4 py-5 text-[1.01rem] leading-8 text-slate-600'>
                    {welcomeMessage}
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "max-w-[88%] rounded-[22px] px-4 py-3 text-sm leading-6 shadow-sm",
                      message.role === "assistant"
                        ? "border border-blue-100 bg-white text-slate-700"
                        : "ml-auto bg-gradient-to-br from-blue-600 to-cyan-500 text-white",
                    )}
                  >
                    <p>{message.content}</p>
                    {message.status === "streaming" && (
                      <span className='mt-2 inline-flex items-center gap-1 text-[11px] opacity-70'>
                        <LoaderCircle className='h-3.5 w-3.5 animate-spin' />
                        Streaming
                      </span>
                    )}
                  </div>
                ))}

                {connectionError && (
                  <div className='rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800'>
                    {connectionError}
                  </div>
                )}

                {micError && (
                  <div className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600'>
                    {micError}
                  </div>
                )}
              </div>
            </div>

            <div className='border-t border-slate-200 bg-white px-4 py-3'>
              <div className='flex items-center gap-2'>
                <div className='flex min-w-0 flex-1 items-center rounded-full border border-blue-400 bg-white px-4 shadow-[0_0_0_3px_rgba(59,130,246,0.05)]'>
                  <input
                    className='h-12 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400'
                    placeholder={
                      connectionState === "connecting"
                        ? "Connecting assistant..."
                        : "Type your question..."
                    }
                    value={input}
                    disabled={connectionState !== "connected"}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        sendTextMessage();
                      }
                    }}
                  />
                </div>

                <button
                  type='button'
                  aria-label={voiceEnabled ? "Turn microphone off" : "Turn microphone on"}
                  className='flex h-12 w-12 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-700 transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:text-slate-300'
                  disabled={voiceButtonDisabled}
                  onClick={toggleVoiceMode}
                >
                  {voiceEnabled ? (
                    <Mic className='h-5 w-5' />
                  ) : (
                    <MicOff className='h-5 w-5' />
                  )}
                </button>

                <button
                  type='button'
                  aria-label='Send message'
                  className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white transition-colors hover:from-blue-700 hover:to-cyan-600 disabled:cursor-not-allowed disabled:from-blue-200 disabled:to-cyan-200'
                  disabled={!canSend}
                  onClick={() => sendTextMessage()}
                >
                  <SendHorizontal className='h-5 w-5' />
                </button>
              </div>
            </div>

            <div className='bg-[#fbfbfb] px-4 py-3 text-center text-xs text-slate-400'>
              {disclaimer}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
