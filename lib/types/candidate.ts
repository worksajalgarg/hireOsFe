/** Hand-maintained duplicate of hireOsFe's lib/types/candidate.ts. */

import type { Resume } from "./resume";
import type { Application } from "./application";

export type CandidateSource = "RESUME_UPLOAD" | "MANUAL" | "REFERRAL" | "IMPORT";

export interface Candidate {
  id: string;
  tenantId: string;
  fullName: string;
  primaryEmail: string | null;
  primaryPhone: string | null;
  currentTitle: string | null;
  location: string | null;
  source: CandidateSource;
  createdAt: string;
  updatedAt: string;
  /** Included on GET /candidates/:id — non-deleted resumes with their
   * active extraction, newest first. */
  resumes: Resume[];
  /** Included on GET /candidates/:id — every application this candidate
   * has, each with its job role's id/title/status. */
  applications: (Application & { jobRole: { id: string; title: string; status: string } })[];
}
