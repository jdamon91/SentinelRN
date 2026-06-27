/**
 * @sentinelrn/core — the Application Trust Runtime for React Native.
 *
 * The primary entry point is the cohesive {@link SentinelRN} object:
 *
 * ```ts
 * import { SentinelRN } from "@sentinelrn/core";
 *
 * const report = await SentinelRN.integrity.check();
 * const result = SentinelRN.ai.guardPrompt({ input, policy: "strict" });
 * ```
 *
 * Lower-level engines (risk, threat, AI detectors, policy) are also exported for
 * advanced use and extension, but most apps only need `SentinelRN`.
 */

// ── AI security ──────────────────────────────────────────────────────────────
export {
  type DetectOptions,
  detectFindings,
  findInjections,
  type GuardOptions,
  guardPrompt,
  INJECTION_RULES,
  type InjectionRule,
  inspectAndRedact,
  luhnValid,
  maskMatch,
  PATTERN_DETECTORS,
  type PatternDetector,
  PII_DETECTORS,
  placeholderFor,
  redact,
  SECRET_DETECTORS,
  ssnValid,
} from "./ai/index.js";
export { DEFAULT_CONFIG, resolveConfig } from "./core/config.js";
// ── Primary API ──────────────────────────────────────────────────────────────
export { createSentinel, type Sentinel, SentinelRN, VERSION } from "./core/sentinel.js";

// ── Integrity ────────────────────────────────────────────────────────────────
export {
  createIntegrityModule,
  type IntegrityDeps,
  type IntegrityModule,
  type IntegrityProvider,
} from "./integrity/index.js";
// ── Policy engine ────────────────────────────────────────────────────────────
export {
  evaluateAI,
  evaluateIntegrity,
  type ResolvedPolicy,
  resolvePolicy,
} from "./policy/index.js";
// ── Risk engine ──────────────────────────────────────────────────────────────
export {
  aggregateScore,
  assessRisk,
  CONFIDENCE_MULTIPLIER,
  isCompromised,
  RISK_THRESHOLDS,
  type RiskAssessment,
  recommendedActionFromRisk,
  riskLevelFromScore,
  type Scorable,
  SEVERITY_WEIGHT,
  signalScore,
} from "./risk/index.js";
// ── Threat engine ────────────────────────────────────────────────────────────
export {
  type BuildReportOptions,
  buildThreatReport,
  defaultsForType,
  type NormalizeOptions,
  normalizeSignal,
  normalizeSignals,
} from "./threat/index.js";
// ── Shared types ─────────────────────────────────────────────────────────────
export * from "./types/index.js";

// ── Utilities ────────────────────────────────────────────────────────────────
export { clamp, slugId } from "./utils/index.js";
