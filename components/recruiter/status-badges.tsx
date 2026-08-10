import { Badge } from "@/components/ui/badge";
import type { ApplicationStage, ApplicationStatus, ExtractionStatus, ResumeStatus } from "@/lib/types";

const RESUME_STATUS_TONE: Record<ResumeStatus, "neutral" | "info" | "success" | "warning" | "danger"> = {
  UPLOADED: "neutral",
  PARSING: "info",
  PARSED: "success",
  PARSE_FAILED: "danger",
  QUARANTINED: "warning",
};

export function ResumeStatusBadge({ status }: { status: ResumeStatus }) {
  return <Badge tone={RESUME_STATUS_TONE[status]}>{status.replace("_", " ")}</Badge>;
}

const EXTRACTION_STATUS_TONE: Record<ExtractionStatus, "neutral" | "info" | "success" | "warning" | "danger"> = {
  PENDING: "neutral",
  RUNNING: "info",
  SUCCEEDED: "success",
  FAILED: "danger",
};

export function ExtractionStatusBadge({ status }: { status: ExtractionStatus }) {
  return <Badge tone={EXTRACTION_STATUS_TONE[status]}>{status}</Badge>;
}

const STAGE_LABEL: Record<ApplicationStage, string> = {
  APPLIED: "Applied",
  SCREENING: "Screening",
  SHORTLISTED: "Shortlisted",
  INTERVIEW_SCHEDULED: "Interview scheduled",
  INTERVIEWED: "Interviewed",
  OFFER: "Offer",
};

export function ApplicationStageBadge({ stage }: { stage: ApplicationStage }) {
  return <Badge tone="info">{STAGE_LABEL[stage]}</Badge>;
}

const APPLICATION_STATUS_TONE: Record<ApplicationStatus, "neutral" | "success" | "warning" | "danger"> = {
  ACTIVE: "neutral",
  HIRED: "success",
  REJECTED: "danger",
  WITHDRAWN: "warning",
};

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  if (status === "ACTIVE") return null;
  return <Badge tone={APPLICATION_STATUS_TONE[status]}>{status}</Badge>;
}
