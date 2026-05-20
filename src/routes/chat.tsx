import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/chat")({
  component: ChatPage,
});

const STORAGE_KEY = "aurelia.chat.messages";

function loadInitial(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function ChatPage() {
  const [initial] = useState<UIMessage[]>(() => loadInitial());
  const [chatId, setChatId] = useState(() => crypto.randomUUID());
  const transportRef = useRef(new DefaultChatTransport({ api: "/api/chat" }));

  const { messages, sendMessage, status, setMessages } = useChat({
    id: chatId,
    messages: initial,
    transport: transportRef.current,
    onError: (err) => {
      console.error(err);
      toast.error("Chat error. Please try again.");
    },
  });

  // Persist messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  const isLoading = status === "submitted" || status === "streaming";

  const newConversation = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    setChatId(crypto.randomUUID());
  };

  return (
    <DashboardLayout
      title="AI Chatbot"
      description="Conversational assistant — saved in this browser"
    >
      <div className="flex flex-col h-[calc(100vh-10rem)] rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="text-xs text-muted-foreground">
            {messages.length === 0
              ? "No messages yet"
              : `${messages.length} message${messages.length === 1 ? "" : "s"} in this conversation`}
          </div>
          <Button size="sm" variant="outline" onClick={newConversation}>
            <Plus className="h-4 w-4 mr-1.5" /> New conversation
          </Button>
        </div>

        <Conversation className="flex-1 min-h-0">
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<MessageSquare className="h-8 w-8 text-primary" />}
                title="Start a conversation"
                description="Ask anything — drafting, brainstorming, summarizing, planning. Aurelia is here to help."
              />
            ) : (
              messages.map((m) => (
                <Message key={m.id} from={m.role === "user" ? "user" : "assistant"}>
                  {m.role === "assistant" ? (
                    <MessageResponse>
                      {m.parts
                        .map((p) => (p.type === "text" ? p.text : ""))
                        .join("")}
                    </MessageResponse>
                  ) : (
                    <MessageContent>
                      <div className="whitespace-pre-wrap">
                        {m.parts
                          .map((p) => (p.type === "text" ? p.text : ""))
                          .join("")}
                      </div>
                    </MessageContent>
                  )}
                </Message>
              ))
            )}
            {status === "submitted" && (
              <Message from="assistant">
                <Shimmer>Thinking...</Shimmer>
              </Message>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="border-t border-border p-3">
          <PromptInput
            onSubmit={(msg) => {
              const text = msg.text?.trim();
              if (!text) return;
              sendMessage({ text });
            }}
          >
            <PromptInputTextarea placeholder="Message Aurelia..." />
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit status={status} disabled={isLoading} />
            </PromptInputFooter>
          </PromptInput>
          <p className="mt-2 text-[11px] text-muted-foreground text-center">
            Responsible AI: outputs may be inaccurate. Don't share confidential information.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
