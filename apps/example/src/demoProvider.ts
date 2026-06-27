import type { IntegrityProvider, RawSignal } from "@sentinelrn/core";

/**
 * A demo integrity provider that injects sample signals so the report UI is
 * meaningful in the simulator / Expo Go, where the native detectors aren't
 * available. In a real app you would call `registerSentinelNative()` instead.
 */
export const DEMO_SCENARIOS = {
  clean: [] as RawSignal[],
  jailbroken: [
    {
      type: "jailbreak",
      platform: "ios",
      confidence: "high",
      message: "Jailbreak filesystem path detected: /Applications/Cydia.app",
      evidence: { path: "/Applications/Cydia.app" },
    },
    {
      type: "debugger",
      platform: "ios",
      message: "A debugger appears to be attached to the application.",
    },
  ] as RawSignal[],
  rooted: [
    {
      type: "root",
      platform: "android",
      confidence: "high",
      message: "Root binary detected: /system/xbin/su",
      evidence: { path: "/system/xbin/su" },
    },
    {
      type: "hooking",
      platform: "android",
      message: "Frida instrumentation artifacts detected in process maps.",
    },
    { type: "developer_mode", platform: "android" },
  ] as RawSignal[],
  emulator: [{ type: "emulator", platform: "android", confidence: "high" }] as RawSignal[],
} satisfies Record<string, RawSignal[]>;

export type DemoScenario = keyof typeof DEMO_SCENARIOS;

/** Build an integrity provider that returns a fixed scenario's signals. */
export function createDemoProvider(scenario: DemoScenario): IntegrityProvider {
  return {
    name: `demo:${scenario}`,
    collectSignals: () => DEMO_SCENARIOS[scenario],
  };
}
