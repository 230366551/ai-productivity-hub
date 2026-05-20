import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard-layout";
import { AiToolForm } from "@/components/ai-tool-form";

export const Route = createFileRoute("/notes")({
  component: NotesPage,
});

function NotesPage() {
  return (
    <DashboardLayout
      title="Meeting Notes Summarizer"
      description="Turn raw notes or transcripts into clear summaries and action items"
    >
      <AiToolForm
        storageKey="aurelia.notes"
        emptyHint="Paste raw notes or a transcript, then click Generate."
        system="You are an expert meeting-notes summarizer. Produce a structured markdown summary with sections: **Overview**, **Key Decisions**, **Discussion Highlights**, **Action Items** (with owner and due date when available), and **Open Questions**."
        fields={[
          {
            name: "title",
            label: "Meeting title",
            type: "input",
            placeholder: "e.g. Q3 Planning Sync",
            required: true,
          },
          {
            name: "attendees",
            label: "Attendees (optional)",
            type: "input",
            placeholder: "Alex, Priya, Jordan...",
          },
          {
            name: "notes",
            label: "Raw notes or transcript",
            type: "textarea",
            placeholder: "Paste meeting notes or transcript here...",
            required: true,
            rows: 10,
          },
        ]}
        titleFromInputs={(i) => i.title || "Meeting summary"}
        buildPrompt={(i) => `Summarize the following meeting.

Meeting: ${i.title}
Attendees: ${i.attendees || "(unspecified)"}

Raw notes:
"""
${i.notes}
"""`}
      />
    </DashboardLayout>
  );
}
