import { assessRisk } from "../risk/index.js";
import type {
  Confidence,
  RawSignal,
  Severity,
  ThreatReport,
  ThreatSignal,
  ThreatSignalType,
} from "../types/index.js";
import { nowIso, slugId } from "../utils/index.js";

/**
 * Threat engine.
 *
 * Sits between raw platform detectors and the risk engine. Detectors emit
 * loosely-typed {@link RawSignal}s; the threat engine normalizes them into
 * fully-formed {@link ThreatSignal}s (stable id, sensible default severity and
 * confidence, human-readable message) and then assembles a {@link ThreatReport}
 * by delegating aggregate scoring to the risk engine.
 *
 * Default severity/confidence reflect the threat model: hooking and tampering
 * are the most dangerous (they imply active runtime manipulation), while a
 * simulator or developer-mode flag is low-severity but high-confidence.
 */

interface SignalDefault {
  severity: Severity;
  confidence: Confidence;
  message: string;
}

const SIGNAL_DEFAULTS: Record<ThreatSignalType, SignalDefault> = {
  root: {
    severity: "high",
    confidence: "medium",
    message: "Device shows indicators of being rooted.",
  },
  jailbreak: {
    severity: "high",
    confidence: "medium",
    message: "Device shows indicators of being jailbroken.",
  },
  emulator: {
    severity: "medium",
    confidence: "high",
    message: "Application appears to be running inside an emulator.",
  },
  simulator: {
    severity: "low",
    confidence: "high",
    message: "Application appears to be running inside a simulator.",
  },
  debugger: {
    severity: "medium",
    confidence: "high",
    message: "A debugger appears to be attached to the application.",
  },
  developer_mode: {
    severity: "low",
    confidence: "high",
    message: "Developer mode is enabled on this device.",
  },
  mock_location: {
    severity: "medium",
    confidence: "high",
    message: "Mock location providers are enabled on this device.",
  },
  hooking: {
    severity: "critical",
    confidence: "medium",
    message: "Runtime hooking or instrumentation framework indicators detected.",
  },
  tampering: {
    severity: "critical",
    confidence: "medium",
    message: "Application tampering or repackaging indicators detected.",
  },
  unknown: {
    severity: "low",
    confidence: "low",
    message: "An unclassified runtime integrity signal was detected.",
  },
};

/** Options controlling how signals are normalized. */
export interface NormalizeOptions {
  /** Keep `evidence` on the normalized signal. Off by default (may be sensitive). */
  includeEvidence?: boolean;
}

/** Default severity/confidence/message for a given signal type. */
export function defaultsForType(type: ThreatSignalType): SignalDefault {
  return SIGNAL_DEFAULTS[type] ?? SIGNAL_DEFAULTS.unknown;
}

/**
 * Normalize a single raw observation into a complete {@link ThreatSignal},
 * filling in any fields the detector left off.
 */
export function normalizeSignal(raw: RawSignal, options: NormalizeOptions = {}): ThreatSignal {
  const defaults = defaultsForType(raw.type);
  const platform = raw.platform ?? "unknown";
  const signal: ThreatSignal = {
    id: raw.id ?? slugId("integrity", raw.type, platform),
    type: raw.type,
    platform,
    severity: raw.severity ?? defaults.severity,
    confidence: raw.confidence ?? defaults.confidence,
    message: raw.message ?? defaults.message,
  };
  if (options.includeEvidence && raw.evidence) {
    signal.evidence = raw.evidence;
  }
  return signal;
}

/** Normalize a batch of raw observations. */
export function normalizeSignals(
  raws: readonly RawSignal[],
  options?: NormalizeOptions,
): ThreatSignal[] {
  return raws.map((raw) => normalizeSignal(raw, options));
}

/** Options for assembling a report. */
export interface BuildReportOptions extends NormalizeOptions {
  /** Override the timestamp (primarily for testing). */
  checkedAt?: string;
}

/**
 * Build a complete {@link ThreatReport} from raw observations: normalize each
 * signal, then score the set with the risk engine.
 */
export function buildThreatReport(
  raws: readonly RawSignal[],
  options: BuildReportOptions = {},
): ThreatReport {
  const signals = normalizeSignals(raws, options);
  const assessment = assessRisk(signals);
  return {
    riskLevel: assessment.riskLevel,
    score: assessment.score,
    compromised: assessment.compromised,
    signals,
    recommendedAction: assessment.recommendedAction,
    checkedAt: options.checkedAt ?? nowIso(),
  };
}
