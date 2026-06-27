import { buildThreatReport } from "@sentinelrn/core";
import { describe, expect, it } from "vitest";
import { createNativeIntegrityProvider, snapshotToSignals } from "./provider.js";
import type { IntegritySnapshot } from "./types.js";

describe("snapshotToSignals", () => {
  it("maps set flags to typed signals and ignores unset ones", () => {
    const snapshot: IntegritySnapshot = {
      platform: "android",
      isRooted: true,
      isEmulator: true,
      isJailbroken: false,
    };
    const signals = snapshotToSignals(snapshot);
    const types = signals.map((s) => s.type).sort();
    expect(types).toEqual(["emulator", "root"]);
    expect(signals.every((s) => s.platform === "android")).toBe(true);
  });

  it("returns no signals for a clean snapshot", () => {
    expect(snapshotToSignals({ platform: "ios" })).toHaveLength(0);
  });

  it("attaches evidence when present", () => {
    const signals = snapshotToSignals({
      platform: "ios",
      isJailbroken: true,
      evidence: { path: "/Applications/Cydia.app" },
    });
    expect(signals[0]?.evidence).toEqual({ path: "/Applications/Cydia.app" });
  });

  it("produces signals that flow through the core threat engine", () => {
    const signals = snapshotToSignals({
      platform: "ios",
      isJailbroken: true,
      isHookingDetected: true,
    });
    const report = buildThreatReport(signals);
    expect(report.compromised).toBe(true);
    expect(report.signals.map((s) => s.type).sort()).toEqual(["hooking", "jailbreak"]);
  });
});

describe("createNativeIntegrityProvider", () => {
  it("returns no signals when native module is absent and fallback disabled", async () => {
    const provider = createNativeIntegrityProvider({ useFallback: false });
    expect(await provider.collectSignals()).toEqual([]);
  });

  it("never throws when native module is unavailable", async () => {
    const provider = createNativeIntegrityProvider();
    await expect(provider.collectSignals()).resolves.toBeInstanceOf(Array);
  });

  it("is named after the package", () => {
    expect(createNativeIntegrityProvider().name).toBe("@sentinelrn/native");
  });
});
