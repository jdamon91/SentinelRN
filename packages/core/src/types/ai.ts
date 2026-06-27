import type { Confidence, Severity } from "./common.js";

/**
 * Categories of risky content SentinelRN can detect in AI-bound input.
 * Secrets/credentials, structured PII, and prompt-injection attempts each map
 * to threats described in the threat model.
 */
export type AIFindingType =
  | "secret"
  | "credential"
  | "jwt"
  | "api_key"
  | "email"
  | "phone"
  | "ssn"
  | "credit_card"
  | "ip_address"
  | "prompt_injection"
  | "sensitive_context";

/**
 * A single piece of risky content found in AI-bound input. `match` and
 * `redacted` are only populated when the active policy permits returning them.
 */
export interface AIFinding {
  /** Stable identifier, e.g. `"ai.secret.openai_key"`. */
  id: string;
  /** What kind of risky content this is. */
  type: AIFindingType;
  /** How serious this finding is. */
  severity: Severity;
  /** How confident the detector is in the match. */
  confidence: Confidence;
  /** Human-readable explanation. */
  message: string;
  /** Character offset range `[start, end)` of the match within the input. */
  range?: [number, number];
  /** The raw matched substring. Omitted unless `ai.includeFindings` allows it. */
  match?: string;
  /** What the match looks like after redaction, e.g. `"sk-•••••"`. */
  redacted?: string;
}

/** Policy modes that govern how `guardPrompt` reacts to findings. */
export type AIGuardPolicy = "monitor" | "warn" | "block" | "strict";

/** What the AI guard recommends doing with a given input. */
export type AIRecommendedAction = "allow" | "redact" | "warn" | "block";

/** Arguments to {@link AIModule.guardPrompt}. */
export interface GuardPromptArgs {
  /** The user-generated text about to be sent to an AI provider. */
  input: string;
  /** Override the configured policy for this single call. */
  policy?: AIGuardPolicy;
}

/**
 * The structured result of guarding an AI prompt. Mirrors `ThreatReport` for
 * runtime integrity: explainable findings plus a recommended action.
 */
export interface AIGuardResult {
  /** Whether the input is allowed to proceed under the active policy. */
  allowed: boolean;
  /** Policy that produced this decision. */
  policy: AIGuardPolicy;
  /** The original input, echoed back. */
  input: string;
  /** Input with sensitive matches redacted, when redaction applies. */
  sanitizedInput?: string;
  /** Every finding detected in the input. */
  findings: AIFinding[];
  /** What SentinelRN recommends doing with this input. */
  recommendedAction: AIRecommendedAction;
}

/** Result of {@link RedactionModule.inspectAndRedact}. */
export interface RedactionResult {
  /** Input with all matched sensitive content replaced by placeholders. */
  sanitizedInput: string;
  /** Findings describing what was redacted. */
  findings: AIFinding[];
}
