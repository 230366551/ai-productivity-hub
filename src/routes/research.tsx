import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard-layout";
import { AiToolForm } from "@/components/ai-tool-form";

export const Route = createFileRoute("/research")({
  component: ResearchPage,
});

function ResearchPage() {
  return (
    <DashboardLayout
      title="AI Research Assistant"
      description="Synthesize structured briefs on any topic"
    >
      <AiToolForm
        storageKey="aurelia.research"
        emptyHint="Enter a topic and the angle you care about to get a research brief."
        system="You are a thorough research assistant. Produce a structured markdown brief with sections: **Executive Summary**, **Background**, **Key Points** (bulleted), **Pros & Cons** or **Comparisons** (when relevant), **Recommendations**, and **Further Reading** (general topic suggestions, not fabricated URLs). Be balanced and note uncertainty. Do not invent specific sources or citations."
        fields={[
          {
            name: "topic",
            label: "Topic",
            type: "input",
            placeholder: "e.g. Vendor evaluation criteria for CRMs",
            required: true,
          },
          {
            name: "depth",
            label: "Depth",
            type: "select",
            options: ["Quick overview", "Standard brief", "Deep dive"],
            required: true,
          },
          {
            name: "questions",
            label: "Specific questions (optional)",
            type: "textarea",
            placeholder: "What do you want answered?",
            rows: 4,
          },
        ]}
        titleFromInputs={(i) => i.topic || "Research brief"}
        buildPrompt={(i) => `Research brief.

Topic: ${i.topic}
Depth: ${i.depth}
Specific questions: ${i.questions || "(none)"}`}
      />
    </DashboardLayout>
  );
}
