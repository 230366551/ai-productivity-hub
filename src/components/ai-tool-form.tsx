import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Loader2, Save, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export type GenToolField = {
  name: string;
  label: string;
  placeholder?: string;
  type?: "input" | "textarea" | "select";
  options?: string[];
  required?: boolean;
  rows?: number;
};

type SavedItem = {
  id: string;
  title: string;
  output: string;
  inputs: Record<string, string>;
  createdAt: number;
};

export function AiToolForm({
  storageKey,
  fields,
  buildPrompt,
  system,
  emptyHint,
  titleFromInputs,
}: {
  storageKey: string;
  fields: GenToolField[];
  buildPrompt: (inputs: Record<string, string>) => string;
  system?: string;
  emptyHint: string;
  titleFromInputs: (inputs: Record<string, string>) => string;
}) {
  const [inputs, setInputs] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, ""])),
  );
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState<SavedItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setSaved(JSON.parse(raw));
    } catch {}
  }, [storageKey]);

  const persist = (next: SavedItem[]) => {
    setSaved(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const onChange = (name: string, value: string) =>
    setInputs((prev) => ({ ...prev, [name]: value }));

  const submit = async () => {
    for (const f of fields) {
      if (f.required && !inputs[f.name]?.trim()) {
        toast.error(`Please fill in: ${f.label}`);
        return;
      }
    }
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: buildPrompt(inputs), system }),
      });
      if (!res.ok) {
        if (res.status === 429) toast.error("Rate limit reached. Please try again shortly.");
        else if (res.status === 402)
          toast.error("AI credits exhausted. Add credits in Workspace > Usage.");
        else toast.error("Generation failed. Please try again.");
        return;
      }
      const data = (await res.json()) as { text: string };
      setOutput(data.text);
    } catch (err) {
      console.error(err);
      toast.error("Network error.");
    } finally {
      setLoading(false);
    }
  };

  const save = () => {
    if (!output.trim()) return;
    const item: SavedItem = {
      id: crypto.randomUUID(),
      title: titleFromInputs(inputs) || "Untitled",
      output,
      inputs,
      createdAt: Date.now(),
    };
    persist([item, ...saved]);
    toast.success("Saved to this browser");
  };

  const load = (item: SavedItem) => {
    setInputs({ ...Object.fromEntries(fields.map((f) => [f.name, ""])), ...item.inputs });
    setOutput(item.output);
  };

  const remove = (id: string) => persist(saved.filter((s) => s.id !== id));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6">
      {/* Input column */}
      <div className="space-y-5">
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-primary" /> Inputs
          </div>
          {fields.map((f) => (
            <div key={f.name} className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {f.label}
                {f.required && <span className="text-destructive"> *</span>}
              </label>
              {f.type === "select" ? (
                <select
                  className="w-full h-10 px-3 rounded-md bg-input border border-border text-sm"
                  value={inputs[f.name]}
                  onChange={(e) => onChange(f.name, e.target.value)}
                >
                  <option value="">Select...</option>
                  {f.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : f.type === "input" ? (
                <input
                  className="w-full h-10 px-3 rounded-md bg-input border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder={f.placeholder}
                  value={inputs[f.name]}
                  onChange={(e) => onChange(f.name, e.target.value)}
                />
              ) : (
                <Textarea
                  rows={f.rows ?? 4}
                  placeholder={f.placeholder}
                  value={inputs[f.name]}
                  onChange={(e) => onChange(f.name, e.target.value)}
                  className="bg-input border-border resize-none"
                />
              )}
            </div>
          ))}
          <Button onClick={submit} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" /> Generate
              </>
            )}
          </Button>
        </div>

        {saved.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="text-sm font-medium mb-3">Saved (this browser)</div>
            <ul className="space-y-2">
              {saved.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-2 rounded-md border border-border bg-background/40 px-3 py-2 text-sm"
                >
                  <button
                    onClick={() => load(s)}
                    className="flex-1 text-left truncate hover:text-primary"
                  >
                    {s.title}
                  </button>
                  <button
                    onClick={() => remove(s.id)}
                    className="text-muted-foreground hover:text-destructive p-1"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Output column */}
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col min-h-[420px]">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium">Output (editable)</div>
          <Button
            size="sm"
            variant="outline"
            onClick={save}
            disabled={!output.trim()}
          >
            <Save className="h-4 w-4 mr-1.5" /> Save
          </Button>
        </div>
        {output ? (
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              className="bg-background/40 border-border resize-none font-mono text-xs leading-relaxed"
            />
            <div className="rounded-md border border-border bg-background/40 p-4 overflow-auto prose prose-sm prose-invert max-w-none">
              <ReactMarkdown>{output}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center text-sm text-muted-foreground">
            <div className="max-w-xs">
              <Sparkles className="h-6 w-6 mx-auto mb-2 text-primary/60" />
              {emptyHint}
            </div>
          </div>
        )}
        <p className="mt-3 text-[11px] text-muted-foreground">
          AI-generated. Review and edit before using. Do not include confidential info you don't want processed.
        </p>
      </div>
    </div>
  );
}
