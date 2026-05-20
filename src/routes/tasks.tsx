import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard-layout";
import { AiToolForm } from "@/components/ai-tool-form";

export const Route = createFileRoute("/tasks")({
  component: TasksPage,
});

function TasksPage() {
  return (
    <DashboardLayout
      title="AI Task Planner"
      description="Break goals into prioritized, time-blocked tasks"
    >
      <AiToolForm
        storageKey="aurelia.tasks"
        emptyHint="Describe a goal and timeframe to get a structured plan."
        system="You are an expert project planner. Produce a markdown task plan with: a brief **Strategy** paragraph, a **Milestones** list, and a **Tasks** table with columns: Task | Priority (High/Med/Low) | Estimated time | Suggested deadline. End with a short **Risks & dependencies** section."
        fields={[
          {
            name: "goal",
            label: "Goal or project",
            type: "textarea",
            placeholder: "What do you want to accomplish?",
            required: true,
            rows: 3,
          },
          {
            name: "timeframe",
            label: "Timeframe",
            type: "input",
            placeholder: "e.g. 2 weeks, by end of quarter",
            required: true,
          },
          {
            name: "constraints",
            label: "Constraints / context (optional)",
            type: "textarea",
            placeholder: "Team size, budget, dependencies, working hours...",
            rows: 3,
          },
        ]}
        titleFromInputs={(i) => i.goal?.slice(0, 60) || "Task plan"}
        buildPrompt={(i) => `Create a task plan.

Goal: ${i.goal}
Timeframe: ${i.timeframe}
Constraints: ${i.constraints || "(none)"}`}
      />
    </DashboardLayout>
  );
}
