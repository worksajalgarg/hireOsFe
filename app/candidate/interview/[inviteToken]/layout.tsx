import type { ReactNode } from "react";

export default function CandidateInterviewRoomLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[var(--color-navy)] text-white">{children}</div>;
}
