import type { Confidence, Platform, RecommendedAction, RiskLevel, Severity } from "./common.js";

/**
 * Categories of runtime-integrity threats SentinelRN can surface. These map
 * directly to the threat model: each value describes *what kind* of compromise
 * a signal indicates, independent of platform.
 */
export type ThreatSignalType =
  | "root"
  | "jailbreak"
  | "emulator"
  | "simulator"
  | "debugger"
  | "developer_mode"
  | "mock_location"
  | "hooking"
  | "tampering"
  | "unknown";

/**
 * A single normalized runtime-integrity observation. Detectors emit raw
 * observations; the threat engine normalizes them into `ThreatSignal`s with a
 * stable id, severity, and confidence so applications never see bare booleans.
 */
export interface ThreatSignal {
  /** Stable identifier for this signal, e.g. `"integrity.jailbreak.path"`. */
  id: string;
  /** What kind of threat this signal indicates. */
  type: ThreatSignalType;
  /** Platform the signal originated from. */
  platform: Platform;
  /** How serious this signal is on its own. */
  severity: Severity;
  /** How confident the detector is that this is a true positive. */
  confidence: Confidence;
  /** Human-readable explanation of what was detected and why it matters. */
  message: string;
  /**
   * Optional supporting detail (paths, property names, hashes). Only included
   * when `integrity.includeEvidence` is enabled, since evidence may itself be
   * sensitive.
   */
  evidence?: Record<string, unknown>;
}

/**
 * A raw observation as emitted by a platform detector, before normalization.
 * `severity`/`confidence` are optional here — the threat engine fills in
 * sensible defaults per signal type when a detector omits them.
 */
export interface RawSignal {
  type: ThreatSignalType;
  platform?: Platform;
  severity?: Severity;
  confidence?: Confidence;
  message?: string;
  evidence?: Record<string, unknown>;
  /** Optional explicit id; otherwise the threat engine derives one. */
  id?: string;
}

/**
 * The structured result of a runtime-integrity check. This is the central
 * "trust report" the product is built around — it explains what was detected,
 * how risky it is, and what the app should consider doing.
 */
export interface ThreatReport {
  /** Aggregate risk level derived from all signals. */
  riskLevel: RiskLevel;
  /** Aggregate numeric risk score, 0 (clean) – 100 (critical). */
  score: number;
  /** Whether the environment appears compromised enough to act on. */
  compromised: boolean;
  /** Every normalized signal contributing to this report. */
  signals: ThreatSignal[];
  /** What SentinelRN recommends the app do given this report. */
  recommendedAction: RecommendedAction;
  /** ISO-8601 timestamp of when the check completed. */
  checkedAt: string;
}
