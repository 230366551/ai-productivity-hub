import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard-layout";
import { AiToolForm } from "@/components/ai-tool-form";

export const Route = createFileRoute("/email")({
  component: EmailPage,
});

function EmailPage() {
  return (
    <DashboardLayout
      title="Smart Email Generator"
      description="Draft professional emails with the right tone and structure"
    >
      <AiToolForm
        storageKey="aurelia.emails"
        emptyHint="Fill in the details and click Generate to draft a polished email."
        system="You are an expert business email writer. Produce a complete email with subject line, greeting, body, and sign-off. Use markdown. Match the requested tone precisely. Keep it concise and skimmable."
        fields={[
          {
            name: "recipient",
            label: "Recipient",
            type: "input",
            placeholder: "e.g. Hiring manager at Acme Corp",
            required: true,
          },
          {
            name: "purpose",
            label: "Purpose of email",
            type: "textarea",
            placeholder: "What do you want to accomplish?",
            required: true,
            rows: 3,
          },
          {
            name: "tone",
            label: "Tone",
            type: "select",
            options: [
              "Professional",
              "Friendly",
              "Formal",
              "Persuasive",
              "Apologetic",
              "Direct",
            ],
            required: true,
          },
          {
            name: "context",
            label: "Background / context (optional)",
            type: "textarea",
            placeholder: "Relevant details, prior conversation, deadlines...",
            rows: 4,
          },
        ]}
        titleFromInputs={(i) => `Email to ${i.recipient || "recipient"}`}
        buildPrompt={(i) => `Write an email with the following details:

- Recipient: ${i.recipient}
- Purpose: ${i.purpose}
- Tone: ${i.tone}
- Context: ${i.context || "(none)"}

Format with a clear **Subject:** line first, then the email body. Use markdown.`}
      />
    </DashboardLayout>
  );
}
