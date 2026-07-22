/**
 * Mirrors the evaluation object produced by hireOsBe's AI service Evaluation
 * Engine (kept in sync by hand — see hireOsBe/platform/src/common/types for
 * the backend's copy of this contract).
 */
export type EvidenceStrength = "strong" | "moderate" | "weak" | "missing";

export interface CriterionEvaluation {
  criterionId: string;
  criterion: string;
  score: number;
  evidenceStrength: EvidenceStrength;
  confidence: "low" | "medium" | "high";
  supportingEvidence: string[];
  missingEvidence: string[];
  contradictions: string[];
  reviewFlag?: string;
}

export type EvaluationRecommendation =
  | "strong_review"
  | "review"
  | "further_assessment"
  | "insufficient_data";

export interface CandidateEvaluation {
  candidateId: string;
  roleId: string;
  rubricVersion: string;
  modelVersion: string;
  criteria: CriterionEvaluation[];
  recommendation: EvaluationRecommendation;
}
