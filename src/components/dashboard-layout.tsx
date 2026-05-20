import { Link, useLocation } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Mail,
  FileText,
  ListChecks,
  Search,
  MessageSquare,
  LayoutDashboard,
  Menu,
  X,
  ShieldAlert,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/notes", label: "Notes Summarizer", icon: FileText },
  { to: "/tasks", label: "Task Planner", icon: ListChecks },
  { to: "/research", label: "Research Assistant", icon: Search },
  { to: "/chat", label: "AI Chatbot", icon: MessageSquare },
];

export function DashboardLayout({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const SidebarInner = (
    <>
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <img src={logo} alt="Aurelia logo" width={36} height={36} className="rounded-lg" />
        <div>
          <div className="text-sm font-semibold tracking-tight text-sidebar-foreground">
            Aurelia
          </div>
          <div className="text-[11px] text-muted-foreground">Workplace AI</div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map((item) => {
          const active =
            item.to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary/15 text-primary-foreground ring-1 ring-primary/30"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="m-3 rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-3 text-[11px] leading-relaxed text-muted-foreground">
        <div className="flex items-center gap-1.5 mb-1 text-sidebar-foreground/90 font-medium text-xs">
          <ShieldAlert className="h-3.5 w-3.5" /> Responsible AI
        </div>
        AI outputs may be inaccurate. Always review before sending or sharing.
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-sidebar-border bg-sidebar">
        {SidebarInner}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 flex flex-col bg-sidebar border-r border-sidebar-border">
            {SidebarInner}
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/70 backdrop-blur px-4 md:px-8 py-4">
          <button
            className="md:hidden p-2 -ml-2 rounded-md hover:bg-accent"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="min-w-0">
            <h1 className="text-lg md:text-xl font-semibold tracking-tight truncate">
              {title}
            </h1>
            {description && (
              <p className="text-xs md:text-sm text-muted-foreground truncate">
                {description}
              </p>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
