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

// ── Primary API ──────────────────────────────────────────────────────────────
export { createSentinel, type Sentinel, SentinelRN, VERSION } from "./core/sentinel.js";
export { DEFAULT_CONFIG, resolveConfig } from "./core/config.js";

// ── Shared types ─────────────────────────────────────────────────────────────
export * from "./types/index.js";

// ── Integrity ────────────────────────────────────────────────────────────────
export {
  createIntegrityModule,
  type IntegrityDeps,
  type IntegrityModule,
  type IntegrityProvider,
} from "./integrity/index.js";

// ── Risk engine ──────────────────────────────────────────────────────────────
export {
  aggregateScore,
  assessRisk,
  CONFIDENCE_MULTIPLIER,
  isCompromised,
  recommendedActionFromRisk,
  type RiskAssessment,
  riskLevelFromScore,
  RISK_THRESHOLDS,
  type Scorable,
  SEVERITY_WEIGHT,
  signalScore,
} from "./risk/index.js";

// ── Threat engine ────────────────────────────────────────────────────────────
export {
  buildThreatReport,
  type BuildReportOptions,
  defaultsForType,
  type NormalizeOptions,
  normalizeSignal,
  normalizeSignals,
} from "./threat/index.js";

// ── AI security ──────────────────────────────────────────────────────────────
export {
  detectFindings,
  type DetectOptions,
  findInjections,
  guardPrompt,
  type GuardOptions,
  INJECTION_RULES,
  inspectAndRedact,
  type InjectionRule,
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

// ── Policy engine ────────────────────────────────────────────────────────────
export { evaluateAI, evaluateIntegrity, type ResolvedPolicy, resolvePolicy } from "./policy/index.js";

// ── Utilities ────────────────────────────────────────────────────────────────
export { clamp, slugId } from "./utils/index.js";
