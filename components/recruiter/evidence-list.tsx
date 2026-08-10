import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import type { SourceGrounded } from "@/lib/types";

const TONE_ICON = {
  must: { Icon: CheckCircle2, className: "text-green-600" },
  nice: { Icon: Circle, className: "text-gray-400" },
  responsibility: { Icon: ArrowRight, className: "text-navy/60" },
} as const;

const TONE_CHIP = {
  must: "border-green-200 bg-green-50 text-green-800",
  nice: "border-gray-200 bg-gray-50 text-gray-700",
  responsibility: "border-blue-200 bg-blue-50 text-blue-800",
} as const;

/** Strips whitespace/case/trailing punctuation so a claim that's a verbatim
 * (or near-verbatim) copy of its source quote is recognized as such — the
 * quote line only earns its own space in the UI when it actually adds
 * information beyond the claim itself. */
function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/[.,;:]+$/, "");
}

/** Renders a claim (whatever domain-specific field it carries — skill,
 * requirement, responsibility, ...) alongside its sourceText quote, when the
 * quote says something the claim doesn't already say. This is the component
 * that makes ai-service's evidence-grounding architecture actually visible
 * to a recruiter — every claim list should render through this rather than
 * a bare string.
 *
 * layout="chips" is for dense, short-label lists (skills, languages) where
 * 15-20 full evidence rows — often repeating the same source quote for
 * several entries when the model grounds them in one overview sentence —
 * would dominate the page. Evidence isn't dropped, just deduped into one
 * disclosure below the chip cloud instead of repeating per item. */
export function EvidenceList<T extends SourceGrounded>({
  items,
  label,
  tone = "must",
  layout = "list",
  emptyText = "None extracted",
}: {
  items: T[];
  label: (item: T) => string;
  tone?: keyof typeof TONE_ICON;
  layout?: "list" | "chips";
  emptyText?: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-gray-400">{emptyText}</p>;
  }

  if (layout === "chips") {
    const quotes = [...new Set(items.map((item) => item.sourceText.trim()).filter(Boolean))];
    return (
      <div>
        <ul className="flex flex-wrap gap-1.5">
          {items.map((item, i) => (
            <li
              key={i}
              className={`rounded-full border px-2.5 py-1 text-xs font-medium ${TONE_CHIP[tone]}`}
            >
              {label(item)}
            </li>
          ))}
        </ul>
        {quotes.length > 0 && (
          <details className="mt-2 text-xs text-gray-500">
            <summary className="cursor-pointer select-none">
              Evidence ({quotes.length} quote{quotes.length > 1 ? "s" : ""})
            </summary>
            <ul className="mt-1.5 space-y-1 pl-3">
              {quotes.map((q, i) => (
                <li key={i} className="italic leading-snug">
                  &ldquo;{q}&rdquo;
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    );
  }

  const { Icon, className: iconClassName } = TONE_ICON[tone];
  return (
    <ul className="divide-y divide-gray-100">
      {items.map((item, i) => {
        const claim = label(item);
        const showQuote = normalize(claim) !== normalize(item.sourceText);
        return (
          <li key={i} className="flex gap-2.5 py-2.5 first:pt-0 last:pb-0">
            <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${iconClassName}`} aria-hidden />
            <div className="min-w-0">
              <p className="text-sm leading-snug text-gray-900">{claim}</p>
              {showQuote && (
                <p className="mt-0.5 text-xs leading-snug text-gray-500 italic">
                  &ldquo;{item.sourceText}&rdquo;
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
