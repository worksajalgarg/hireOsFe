"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, FileText, CheckCircle2 } from "lucide-react";
import { platformClient } from "@/lib/platform-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PromptTemplate {
  id: string;
  title: string;
  description?: string;
  category: string;
  conversationFlow?: string;
  openingInstructions?: string;
  silenceInstructions?: string;
  systemBoundaries?: string;
  isDefault: boolean;
  createdAt: string;
}

export default function PromptsManagementPage() {
  const [prompts, setPrompts] = useState<PromptTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Technical");
  const [conversationFlow, setConversationFlow] = useState("");
  const [openingInstructions, setOpeningInstructions] = useState("");
  const [silenceInstructions, setSilenceInstructions] = useState("");
  const [systemBoundaries, setSystemBoundaries] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadPrompts = async () => {
    try {
      const data = await platformClient.listPrompts();
      setPrompts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load prompts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // loadPrompts sets state only after its internal `await`, in the async
    // continuation, not synchronously within this effect body; the rule
    // can't see across that async boundary and flags the standard
    // fetch-on-mount pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPrompts();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setCategory("Technical");
    setConversationFlow("");
    setOpeningInstructions("");
    setSilenceInstructions("");
    setSystemBoundaries("");
    setShowModal(true);
  };

  const openEditModal = (p: PromptTemplate) => {
    setEditingId(p.id);
    setTitle(p.title);
    setDescription(p.description || "");
    setCategory(p.category);
    setConversationFlow(p.conversationFlow || "");
    setOpeningInstructions(p.openingInstructions || "");
    setSilenceInstructions(p.silenceInstructions || "");
    setSystemBoundaries(p.systemBoundaries || "");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title,
        description: description || undefined,
        category,
        conversationFlow: conversationFlow || undefined,
        openingInstructions: openingInstructions || undefined,
        silenceInstructions: silenceInstructions || undefined,
        systemBoundaries: systemBoundaries || undefined,
      };

      if (editingId) {
        await platformClient.updatePrompt(editingId, payload);
      } else {
        await platformClient.createPrompt(payload);
      }

      setShowModal(false);
      await loadPrompts();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save prompt template");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this prompt template?")) return;
    try {
      await platformClient.deletePrompt(id);
      await loadPrompts();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete prompt template");
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Interview Prompt Templates
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Manage custom system prompt templates stored in your database to tailor AI interviews.
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/recruiter/dashboard"
            className="rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            ← Back to Dashboard
          </a>
          <Button onClick={openCreateModal} className="flex items-center gap-1.5">
            <Plus className="h-4 w-4" /> Create Prompt Template
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 text-center text-sm text-gray-500">Loading prompt templates…</div>
      ) : error ? (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      ) : prompts.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-12 text-center">
          <FileText className="mx-auto h-8 w-8 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No prompt templates yet</h3>
          <p className="mt-1 text-xs text-gray-500">
            Create your first prompt template to start generating customized AI interview links.
          </p>
          <Button onClick={openCreateModal} className="mt-4">
            Create Prompt Template
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {prompts.map((p) => (
            <div
              key={p.id}
              className="flex flex-col justify-between rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    {p.category}
                  </span>
                  {p.isDefault && (
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Default
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-base font-semibold text-gray-900">{p.title}</h3>
                <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                  {p.description || "No description provided."}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t pt-4">
                <span className="text-[10px] text-gray-400">
                  ID: {p.id.slice(0, 8)}…
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(p)}
                    className="h-8 px-2 text-xs"
                  >
                    <Edit2 className="mr-1 h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(p.id)}
                    className="h-8 px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
          <div className="w-[80vw] max-w-[80vw] rounded-2xl bg-white p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  {editingId ? "Edit Prompt Template" : "Create Prompt Template"}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Configure custom AI Voice Interview instructions, conversation flow, and system boundaries.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Template Title *
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g. Senior Frontend Engineer Screening"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Category
                  </Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 flex w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Behavioral">Behavioral</option>
                    <option value="Management">Management</option>
                    <option value="Hiring Manager">Hiring Manager</option>
                    <option value="Discovery">Discovery</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Description (Optional)
                  </Label>
                  <Input
                    id="description"
                    placeholder="Short summary of what role or assessment this prompt focuses on"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Section 1: Conversation Flow */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="flow" className="text-xs font-semibold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-indigo-600"></span>
                    Conversation Flow & Questions
                  </Label>
                  <span className="text-[11px] text-gray-400 font-mono">Main system prompt instructions</span>
                </div>
                <textarea
                  id="flow"
                  placeholder="Define structured phases, question sequences, and deep-dive technical guidelines..."
                  value={conversationFlow}
                  onChange={(e) => setConversationFlow(e.target.value)}
                  rows={8}
                  className="flex w-full rounded-xl border border-gray-200 bg-slate-50/70 p-4 font-mono text-sm leading-relaxed text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 shadow-inner"
                />
              </div>

              {/* Section 2: Opening Instructions */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="opening" className="text-xs font-semibold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-600"></span>
                    Opening Greeting Instructions
                  </Label>
                  <span className="text-[11px] text-gray-400 font-mono">First turn speech behavior</span>
                </div>
                <textarea
                  id="opening"
                  placeholder="Instructions for how the voice interviewer welcomes the candidate on call connect..."
                  value={openingInstructions}
                  onChange={(e) => setOpeningInstructions(e.target.value)}
                  rows={3}
                  className="flex w-full rounded-xl border border-gray-200 bg-slate-50/70 p-3.5 font-mono text-sm leading-relaxed text-gray-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 shadow-inner"
                />
              </div>

              {/* Section 3: Silence Nudge */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="silence" className="text-xs font-semibold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-600"></span>
                    Silence Handling Nudge Instructions
                  </Label>
                  <span className="text-[11px] text-gray-400 font-mono">Re-engagement trigger</span>
                </div>
                <textarea
                  id="silence"
                  placeholder="Instructions when the candidate is silent for more than 5 seconds..."
                  value={silenceInstructions}
                  onChange={(e) => setSilenceInstructions(e.target.value)}
                  rows={3}
                  className="flex w-full rounded-xl border border-gray-200 bg-slate-50/70 p-3.5 font-mono text-sm leading-relaxed text-gray-800 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100 shadow-inner"
                />
              </div>

              {/* Section 4: System Boundaries */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="boundaries" className="text-xs font-semibold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-rose-600"></span>
                    System Boundaries & Security Guardrails
                  </Label>
                  <span className="text-[11px] text-gray-400 font-mono">Injection defense & policy</span>
                </div>
                <textarea
                  id="boundaries"
                  placeholder="Define anti-injection rules, topics off-limits, and candidate boundaries..."
                  value={systemBoundaries}
                  onChange={(e) => setSystemBoundaries(e.target.value)}
                  rows={4}
                  className="flex w-full rounded-xl border border-gray-200 bg-slate-50/70 p-3.5 font-mono text-sm leading-relaxed text-gray-800 outline-none transition focus:border-rose-500 focus:bg-white focus:ring-2 focus:ring-rose-100 shadow-inner"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="px-5"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md">
                  {submitting ? "Saving…" : editingId ? "Save Prompt Template" : "Create Prompt Template"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
