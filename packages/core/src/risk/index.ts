import type { Confidence, RecommendedAction, RiskLevel, Severity } from "../types/index.js";
import { clamp, roundScore } from "../utils/index.js";

/**
 * Risk engine.
 *
 * Converts a set of weighted observations (anything carrying a `severity` and
 * `confidence`) into a single 0–100 score, a coarse risk level, and a
 * recommended action. The same math powers both runtime-integrity reports and
 * AI-guard results, keeping scoring consistent across the SDK.
 *
 * The combination is a probabilistic OR ("noisy-or"): each observation has an
 * independent chance of indicating real compromise, and the aggregate is the
 * probability that *at least one* is real. This means more signals push the
 * score up, but it saturates gracefully toward 100 instead of overflowing.
 */

/** Anything the risk engine can score. */
export interface Scorable {
  severity: Severity;
  confidence: Confidence;
}

/** Base contribution of each severity, on a 0–100 scale. */
export const SEVERITY_WEIGHT: Record<Severity, number> = {
  low: 12,
  medium: 35,
  high: 65,
  critical: 92,
};

/** Confidence discounts a signal's contribution toward its severity weight. */
export const CONFIDENCE_MULTIPLIER: Record<Confidence, number> = {
  low: 0.5,
  medium: 0.8,
  high: 1,
};

/**
 * Inclusive lower score bounds for each risk level. Tuned so a single
 * high-severity, high-confidence signal lands in "high", and a critical signal
 * (or several high ones) reaches "critical".
 */
export const RISK_THRESHOLDS: Record<RiskLevel, number> = {
  low: 0,
  medium: 20,
  high: 50,
  critical: 85,
};

/** Per-observation contribution on a 0–100 scale. */
export function signalScore(item: Scorable): number {
  return SEVERITY_WEIGHT[item.severity] * CONFIDENCE_MULTIPLIER[item.confidence];
}

/**
 * Combine many observations into a single 0–100 score using probabilistic OR.
 * Returns 0 for an empty set.
 */
export function aggregateScore(items: readonly Scorable[]): number {
  if (items.length === 0) return 0;
  let survivingClean = 1;
  for (const item of items) {
    const p = clamp(signalScore(item) / 100, 0, 1);
    survivingClean *= 1 - p;
  }
  return roundScore(clamp((1 - survivingClean) * 100, 0, 100));
}

/** Map a 0–100 score to a coarse risk level. */
export function riskLevelFromScore(score: number): RiskLevel {
  if (score >= RISK_THRESHOLDS.critical) return "critical";
  if (score >= RISK_THRESHOLDS.high) return "high";
  if (score >= RISK_THRESHOLDS.medium) return "medium";
  return "low";
}

/** A device is considered compromised once risk reaches "high". */
export function isCompromised(level: RiskLevel): boolean {
  return level === "high" || level === "critical";
}

/**
 * Recommend an integrity action from a risk level. `hasSignals` distinguishes a
 * genuinely clean device (`allow`) from a low-risk-but-noisy one (`monitor`).
 */
export function recommendedActionFromRisk(
  level: RiskLevel,
  hasSignals: boolean,
): RecommendedAction {
  switch (level) {
    case "critical":
      return "block_session";
    case "high":
      return "block_sensitive_action";
    case "medium":
      return "warn_user";
    default:
      return hasSignals ? "monitor" : "allow";
  }
}

/** Full risk assessment of a set of observations. */
export interface RiskAssessment {
  score: number;
  riskLevel: RiskLevel;
  compromised: boolean;
  recommendedAction: RecommendedAction;
}

/** Score a set of observations end-to-end. */
export function assessRisk(items: readonly Scorable[]): RiskAssessment {
  const score = aggregateScore(items);
  const riskLevel = riskLevelFromScore(score);
  return {
    score,
    riskLevel,
    compromised: isCompromised(riskLevel),
    recommendedAction: recommendedActionFromRisk(riskLevel, items.length > 0),
  };
}
