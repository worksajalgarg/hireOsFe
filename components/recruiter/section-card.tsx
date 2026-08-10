import type { ReactNode } from "react";

/** Titled white card with an optional count pill — the standard wrapper for
 * a group of extracted claims (requirements, skills, work history, ...) on
 * both the job role overview page and the candidate detail page. */
export function SectionCard({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-white p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
        {title}
        {count !== undefined && (
          <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-xs font-normal tabular-nums text-gray-500">
            {count}
          </span>
        )}
      </h3>
      {children}
    </section>
  );
}
