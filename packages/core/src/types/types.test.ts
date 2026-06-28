import { describe, expect, it } from "vitest";
import { confidenceRank, riskRank, severityRank } from "./common.js";
import { SentinelError } from "./error.js";

describe("rank helpers", () => {
  it("orders severity lowest to highest", () => {
    expect(severityRank("low")).toBe(0);
    expect(severityRank("critical")).toBe(3);
    expect(severityRank("high")).toBeGreaterThan(severityRank("medium"));
  });

  it("orders confidence lowest to highest", () => {
    expect(confidenceRank("low")).toBe(0);
    expect(confidenceRank("high")).toBe(2);
  });

  it("orders risk lowest to highest", () => {
    expect(riskRank("low")).toBe(0);
    expect(riskRank("critical")).toBe(3);
  });
});

describe("SentinelError", () => {
  it("is a real Error carrying structured fields", () => {
    const cause = new Error("boom");
    const err = new SentinelError({
      code: "native_unavailable",
      module: "native",
      message: "Native bridge missing",
      cause,
    });
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("SentinelError");
    expect(err.code).toBe("native_unavailable");
    expect(err.module).toBe("native");
    expect(err.message).toBe("Native bridge missing");
    expect(err.cause).toBe(cause);
  });

  it("serializes to a plain structured shape", () => {
    const err = new SentinelError({ code: "x", module: "core", message: "m" });
    expect(err.toJSON()).toEqual({ code: "x", module: "core", message: "m", cause: undefined });
  });
});
