import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

const SYSTEM = `You are an AI Workplace Productivity Assistant for professionals. You help with email drafting, meeting notes summarization, task planning, research, and general workplace questions. Be concise, structured, and use markdown (headings, bold, lists) when helpful. Always be professional and friendly. If a request requires confidential, legal, medical, or financial advice, remind the user to verify with a qualified professional.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const { messages, system } = (await request.json()) as {
          messages?: UIMessage[];
          system?: string;
        };
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        try {
          const result = streamText({
            model,
            system: system || SYSTEM,
            messages: await convertToModelMessages(messages),
          });
          return result.toUIMessageStreamResponse({ originalMessages: messages });
        } catch (err) {
          console.error("AI error", err);
          return new Response("AI request failed", { status: 500 });
        }
      },
    },
  },
});
