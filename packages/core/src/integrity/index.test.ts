import { describe, expect, it } from "vitest";
import type { RawSignal } from "../types/index.js";
import { createIntegrityModule, type IntegrityProvider } from "./index.js";

const provider = (signals: RawSignal[], name = "test"): IntegrityProvider => ({
  name,
  collectSignals: () => signals,
});

describe("createIntegrityModule", () => {
  it("returns a clean report when no provider is registered", async () => {
    const mod = createIntegrityModule({ getConfig: () => ({}) });
    const report = await mod.check();
    expect(report.signals).toHaveLength(0);
    expect(report.compromised).toBe(false);
  });

  it("collects signals from the registered provider", async () => {
    const mod = createIntegrityModule({ getConfig: () => ({}) });
    mod.registerProvider(provider([{ type: "jailbreak", platform: "ios", confidence: "high" }]));
    const report = await mod.check();
    expect(report.signals).toHaveLength(1);
    expect(report.compromised).toBe(true);
  });

  it("respects includeEvidence config at call time", async () => {
    let includeEvidence = false;
    const mod = createIntegrityModule({ getConfig: () => ({ includeEvidence }) });
    mod.registerProvider(provider([{ type: "root", evidence: { path: "/sbin/su" } }]));

    expect((await mod.check()).signals[0]?.evidence).toBeUndefined();
    includeEvidence = true;
    expect((await mod.check()).signals[0]?.evidence).toEqual({ path: "/sbin/su" });
  });

  it("fails open when a provider throws", async () => {
    const mod = createIntegrityModule({ getConfig: () => ({}) });
    mod.registerProvider({
      name: "broken",
      collectSignals: () => {
        throw new Error("native bridge unavailable");
      },
    });
    const report = await mod.check();
    expect(report.signals).toHaveLength(0);
    expect(report.compromised).toBe(false);
  });

  it("supports async providers", async () => {
    const mod = createIntegrityModule({ getConfig: () => ({}) });
    mod.registerProvider({
      name: "async",
      collectSignals: async () => [{ type: "hooking", platform: "android" }],
    });
    expect((await mod.check()).signals[0]?.type).toBe("hooking");
  });
});
