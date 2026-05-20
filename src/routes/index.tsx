import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Mail,
  FileText,
  ListChecks,
  Search,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Overview,
});

const tools = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    desc: "Draft professional emails in seconds with tone control and clear structure.",
  },
  {
    to: "/notes",
    icon: FileText,
    title: "Meeting Notes Summarizer",
    desc: "Turn raw notes or transcripts into concise summaries with action items.",
  },
  {
    to: "/tasks",
    icon: ListChecks,
    title: "AI Task Planner",
    desc: "Break goals into prioritized, time-blocked tasks with owners and deadlines.",
  },
  {
    to: "/research",
    icon: Search,
    title: "AI Research Assistant",
    desc: "Explore topics, compare options, and synthesize structured briefs.",
  },
  {
    to: "/chat",
    icon: MessageSquare,
    title: "AI Chatbot",
    desc: "Ask anything — a conversational assistant for everyday work questions.",
  },
];

function Overview() {
  return (
    <DashboardLayout
      title="Welcome to Aurelia"
      description="Your AI workplace productivity assistant"
    >
      <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/20 via-card to-card p-6 md:p-10 mb-8">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary-foreground/90 mb-4">
            <Sparkles className="h-3 w-3" /> Powered by Lovable AI
          </div>
          <h2 className="text-2xl md:text-4xl font-semibold tracking-tight mb-3">
            Automate the busywork. Focus on what matters.
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mb-6">
            Aurelia helps professionals draft emails, summarize meetings, plan tasks, and research topics — all from a single, modern dashboard.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
            >
              Start chatting <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/email"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent transition"
            >
              Draft an email
            </Link>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((t) => {
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              className="group rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:bg-accent/40 transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/15 ring-1 ring-primary/30 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition" />
              </div>
              <h3 className="text-sm font-semibold mb-1">{t.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t.desc}
              </p>
            </Link>
          );
        })}
      </div>

      <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Feature
          icon={Zap}
          title="Structured prompts"
          desc="Each tool guides you to the inputs that produce great output, every time."
        />
        <Feature
          icon={FileText}
          title="Editable outputs"
          desc="Refine AI drafts inline before sending, saving, or sharing."
        />
        <Feature
          icon={ShieldCheck}
          title="Responsible AI"
          desc="Outputs may be wrong. Review, verify, and never paste confidential data."
        />
      </section>
    </DashboardLayout>
  );
}

function Feature({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <Icon className="h-5 w-5 text-primary mb-3" />
      <div className="text-sm font-semibold mb-1">{title}</div>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
