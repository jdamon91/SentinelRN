import type { IntegrityProvider, Platform, RawSignal, ThreatSignalType } from "@sentinelrn/core";
import { fallbackSnapshot } from "./fallback.js";
import { getNativeModule } from "./nativeModule.js";
import type { IntegritySnapshot } from "./types.js";

/**
 * Bridges native integrity snapshots into the core integrity pipeline.
 *
 * The native module emits a flat boolean snapshot; this provider maps each set
 * flag to a {@link RawSignal} of the appropriate type. Severity/confidence are
 * deliberately left for the core threat engine to assign, so scoring stays
 * consistent across platforms and providers.
 */

interface FlagMapping {
  key: keyof IntegritySnapshot;
  type: ThreatSignalType;
  /** Some signals warrant higher confidence than the type default. */
  confidence?: RawSignal["confidence"];
}

/** Order matters only for readability; scoring is order-independent. */
const FLAG_MAPPINGS: FlagMapping[] = [
  { key: "isRooted", type: "root" },
  { key: "isJailbroken", type: "jailbreak" },
  { key: "isEmulator", type: "emulator", confidence: "high" },
  { key: "isSimulator", type: "simulator", confidence: "high" },
  { key: "isDebuggerAttached", type: "debugger", confidence: "high" },
  { key: "isDeveloperModeEnabled", type: "developer_mode", confidence: "high" },
  { key: "isMockLocationEnabled", type: "mock_location", confidence: "high" },
  { key: "isHookingDetected", type: "hooking" },
  { key: "isTamperingDetected", type: "tampering" },
];

/** Convert a native snapshot into raw integrity signals. */
export function snapshotToSignals(snapshot: IntegritySnapshot): RawSignal[] {
  const platform: Platform = snapshot.platform;
  const signals: RawSignal[] = [];
  for (const mapping of FLAG_MAPPINGS) {
    if (snapshot[mapping.key] === true) {
      const signal: RawSignal = { type: mapping.type, platform };
      if (mapping.confidence) signal.confidence = mapping.confidence;
      if (snapshot.evidence) signal.evidence = snapshot.evidence;
      signals.push(signal);
    }
  }
  return signals;
}

/** Options for {@link createNativeIntegrityProvider}. */
export interface NativeProviderOptions {
  /**
   * When the native module is unavailable, fall back to best-effort JS-only
   * heuristics (e.g. dev-mode detection). Defaults to `true`. The fallback is
   * intentionally weak — real integrity detection requires the native module.
   */
  useFallback?: boolean;
}

/**
 * Create an {@link IntegrityProvider} backed by the native module. If the native
 * module is missing it degrades to JS heuristics (or no signals), never throwing.
 */
export function createNativeIntegrityProvider(
  options: NativeProviderOptions = {},
): IntegrityProvider {
  const { useFallback = true } = options;
  return {
    name: "@sentinelrn/native",
    async collectSignals(): Promise<RawSignal[]> {
      const native = getNativeModule();
      if (native) {
        const snapshot = await native.getIntegritySnapshot();
        return snapshotToSignals(snapshot);
      }
      return useFallback ? snapshotToSignals(fallbackSnapshot()) : [];
    },
  };
}

/** Default native integrity provider instance. */
export const nativeIntegrityProvider: IntegrityProvider = createNativeIntegrityProvider();
