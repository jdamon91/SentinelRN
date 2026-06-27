import { describe, expect, it } from "vitest";
import type { Scorable } from "./index.js";
import {
  aggregateScore,
  assessRisk,
  isCompromised,
  recommendedActionFromRisk,
  riskLevelFromScore,
  signalScore,
} from "./index.js";

const sig = (severity: Scorable["severity"], confidence: Scorable["confidence"]): Scorable => ({
  severity,
  confidence,
});

describe("signalScore", () => {
  it("weights severity by confidence", () => {
    expect(signalScore(sig("critical", "high"))).toBe(92);
    expect(signalScore(sig("critical", "low"))).toBe(46);
    expect(signalScore(sig("low", "low"))).toBe(6);
  });
});

describe("aggregateScore", () => {
  it("is 0 for no signals", () => {
    expect(aggregateScore([])).toBe(0);
  });

  it("returns a single signal's contribution rounded", () => {
    expect(aggregateScore([sig("high", "high")])).toBe(65);
  });

  it("combines signals so more risk pushes the score up but saturates", () => {
    const one = aggregateScore([sig("medium", "high")]);
    const many = aggregateScore([
      sig("medium", "high"),
      sig("medium", "high"),
      sig("medium", "high"),
    ]);
    expect(many).toBeGreaterThan(one);
    expect(many).toBeLessThanOrEqual(100);
  });

  it("never exceeds 100 even with many critical signals", () => {
    expect(
      aggregateScore(Array.from({ length: 10 }, () => sig("critical", "high"))),
    ).toBeLessThanOrEqual(100);
  });
});

describe("riskLevelFromScore", () => {
  it("maps scores to levels at documented thresholds", () => {
    expect(riskLevelFromScore(0)).toBe("low");
    expect(riskLevelFromScore(19)).toBe("low");
    expect(riskLevelFromScore(20)).toBe("medium");
    expect(riskLevelFromScore(49)).toBe("medium");
    expect(riskLevelFromScore(50)).toBe("high");
    expect(riskLevelFromScore(82)).toBe("high");
    expect(riskLevelFromScore(85)).toBe("critical");
    expect(riskLevelFromScore(100)).toBe("critical");
  });
});

describe("recommendedActionFromRisk", () => {
  it("escalates the action with the risk level", () => {
    expect(recommendedActionFromRisk("low", false)).toBe("allow");
    expect(recommendedActionFromRisk("low", true)).toBe("monitor");
    expect(recommendedActionFromRisk("medium", true)).toBe("warn_user");
    expect(recommendedActionFromRisk("high", true)).toBe("block_sensitive_action");
    expect(recommendedActionFromRisk("critical", true)).toBe("block_session");
  });
});

describe("isCompromised", () => {
  it("is true only at high or critical", () => {
    expect(isCompromised("low")).toBe(false);
    expect(isCompromised("medium")).toBe(false);
    expect(isCompromised("high")).toBe(true);
    expect(isCompromised("critical")).toBe(true);
  });
});

describe("assessRisk", () => {
  it("produces a clean assessment for no signals", () => {
    expect(assessRisk([])).toEqual({
      score: 0,
      riskLevel: "low",
      compromised: false,
      recommendedAction: "allow",
    });
  });

  it("flags a jailbroken-style high-confidence device as compromised", () => {
    const result = assessRisk([sig("high", "high"), sig("medium", "medium")]);
    expect(result.compromised).toBe(true);
    expect(result.riskLevel).toBe("high");
    expect(result.recommendedAction).toBe("block_sensitive_action");
  });
});
