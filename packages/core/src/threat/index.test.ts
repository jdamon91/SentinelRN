import { describe, expect, it } from "vitest";
import type { RawSignal } from "../types/index.js";
import { buildThreatReport, defaultsForType, normalizeSignal } from "./index.js";

describe("normalizeSignal", () => {
  it("fills defaults for a sparse raw signal", () => {
    const signal = normalizeSignal({ type: "jailbreak" });
    expect(signal).toMatchObject({
      type: "jailbreak",
      platform: "unknown",
      severity: "high",
      confidence: "medium",
    });
    expect(signal.id).toBe("integrity.jailbreak.unknown");
    expect(signal.message).toMatch(/jailbroken/i);
  });

  it("respects explicit overrides", () => {
    const signal = normalizeSignal({
      type: "debugger",
      platform: "ios",
      severity: "critical",
      confidence: "high",
      message: "custom",
      id: "my.id",
    });
    expect(signal).toMatchObject({
      id: "my.id",
      platform: "ios",
      severity: "critical",
      confidence: "high",
      message: "custom",
    });
  });

  it("drops evidence unless includeEvidence is set", () => {
    const raw: RawSignal = { type: "root", evidence: { path: "/sbin/su" } };
    expect(normalizeSignal(raw).evidence).toBeUndefined();
    expect(normalizeSignal(raw, { includeEvidence: true }).evidence).toEqual({ path: "/sbin/su" });
  });
});

describe("defaultsForType", () => {
  it("treats hooking and tampering as critical", () => {
    expect(defaultsForType("hooking").severity).toBe("critical");
    expect(defaultsForType("tampering").severity).toBe("critical");
  });
});

describe("buildThreatReport", () => {
  it("returns a clean report when there are no signals", () => {
    const report = buildThreatReport([], { checkedAt: "2026-01-01T00:00:00.000Z" });
    expect(report).toMatchObject({
      riskLevel: "low",
      score: 0,
      compromised: false,
      recommendedAction: "allow",
      signals: [],
      checkedAt: "2026-01-01T00:00:00.000Z",
    });
  });

  it("scores a jailbroken device as compromised and blocks sensitive actions", () => {
    const report = buildThreatReport([
      { type: "jailbreak", platform: "ios", confidence: "high" },
      { type: "debugger", platform: "ios" },
    ]);
    expect(report.compromised).toBe(true);
    expect(["high", "critical"]).toContain(report.riskLevel);
    expect(report.signals).toHaveLength(2);
    expect(report.recommendedAction).toMatch(/^block_/);
  });

  it("stamps an ISO timestamp by default", () => {
    const report = buildThreatReport([]);
    expect(report.checkedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
