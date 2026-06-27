/**
 * Shared primitive vocabulary used across every SentinelRN module.
 *
 * These types intentionally mirror the language used in the threat model and
 * API design docs: severity, confidence, and risk are kept as small, ordered
 * string unions so they read clearly in application code and serialize cleanly.
 */

/** Overall risk level of a report or evaluation. Ordered low → critical. */
export type RiskLevel = "low" | "medium" | "high" | "critical";

/** Severity of an individual signal or finding. Ordered low → critical. */
export type Severity = "low" | "medium" | "high" | "critical";

/** How confident a detector is that a signal is a true positive. */
export type Confidence = "low" | "medium" | "high";

/** Platform a signal originated from. `unknown` for environment-agnostic checks. */
export type Platform = "ios" | "android" | "unknown";

/**
 * Action SentinelRN recommends the application take. This is advice, not an
 * enforced behavior — applications decide how to honor it via the policy engine.
 */
export type RecommendedAction =
  | "allow"
  | "monitor"
  | "warn_user"
  | "block_sensitive_action"
  | "block_session";

/** Ordered severity scale, lowest first. Useful for comparisons and scoring. */
export const SEVERITY_ORDER: readonly Severity[] = ["low", "medium", "high", "critical"];

/** Ordered confidence scale, lowest first. */
export const CONFIDENCE_ORDER: readonly Confidence[] = ["low", "medium", "high"];

/** Ordered risk scale, lowest first. */
export const RISK_ORDER: readonly RiskLevel[] = ["low", "medium", "high", "critical"];

/** Numeric rank of a severity (0–3), for comparisons and weighting. */
export function severityRank(severity: Severity): number {
  return SEVERITY_ORDER.indexOf(severity);
}

/** Numeric rank of a confidence (0–2), for comparisons and weighting. */
export function confidenceRank(confidence: Confidence): number {
  return CONFIDENCE_ORDER.indexOf(confidence);
}

/** Numeric rank of a risk level (0–3). */
export function riskRank(level: RiskLevel): number {
  return RISK_ORDER.indexOf(level);
}
