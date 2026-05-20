import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

export const Route = createFileRoute("/api/generate")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const { prompt, system } = (await request.json()) as {
          prompt?: string;
          system?: string;
        };
        if (!prompt) return new Response("Prompt required", { status: 400 });
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        try {
          const { text } = await generateText({
            model,
            system:
              system ||
              "You are an AI Workplace Productivity Assistant. Produce clear, professional, structured output using markdown.",
            prompt,
          });
          return Response.json({ text });
        } catch (err) {
          console.error("AI error", err);
          return new Response("AI request failed", { status: 500 });
        }
      },
    },
  },
});
