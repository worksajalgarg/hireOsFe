export type ResumeStatus =
  | "UPLOADED"
  | "EXTRACTING"
  | "EXTRACTED"
  | "FAILED"
  | "EDITED";

export type ResumeListItem = {
  id: string;
  originalFilename: string;
  contentType: string;
  sizeBytes: number;
  status: ResumeStatus;
  contactName: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ResumeDetail = ResumeListItem & {
  tenantId: string;
  createdByUserId: string;
  storageKey: string;
  extractedJson: Record<string, unknown> | null;
  workingJson: Record<string, unknown> | null;
  parseSource: string | null;
  errorMessage: string | null;
};
