import { createSentinel } from "@sentinelrn/core";
import { act, render, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { SentinelProvider } from "./SentinelProvider.js";
import { useAISecurity } from "./useAISecurity.js";
import { useDeviceIntegrity } from "./useDeviceIntegrity.js";
import { useSentinel } from "./useSentinel.js";
import { useSentinelPolicy } from "./useSentinelPolicy.js";

function makeWrapper(configPolicy: "monitor" | "warn" | "block") {
  const instance = createSentinel({ policy: configPolicy });
  instance.registerIntegrityProvider({
    name: "fake",
    collectSignals: () => [{ type: "jailbreak", platform: "ios", confidence: "high" }],
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <SentinelProvider instance={instance}>{children}</SentinelProvider>
  );
  return { instance, wrapper };
}

describe("useSentinel", () => {
  it("falls back to the singleton without a provider", () => {
    const { result } = renderHook(() => useSentinel());
    expect(result.current.version).toBeDefined();
  });

  it("returns the provided instance", () => {
    const { instance, wrapper } = makeWrapper("warn");
    const { result } = renderHook(() => useSentinel(), { wrapper });
    expect(result.current).toBe(instance);
  });
});

describe("useDeviceIntegrity", () => {
  it("auto-checks on mount and reports compromise", async () => {
    const { wrapper } = makeWrapper("block");
    const { result } = renderHook(() => useDeviceIntegrity(), { wrapper });
    await waitFor(() => expect(result.current.report).not.toBeNull());
    expect(result.current.compromised).toBe(true);
    expect(result.current.riskLevel).toMatch(/high|critical/);
  });

  it("does not auto-check when disabled", async () => {
    const { wrapper } = makeWrapper("warn");
    const { result } = renderHook(() => useDeviceIntegrity({ auto: false }), { wrapper });
    expect(result.current.report).toBeNull();
    await act(async () => {
      await result.current.refresh();
    });
    expect(result.current.report).not.toBeNull();
  });
});

describe("useAISecurity", () => {
  it("guards prompts and stores findings", () => {
    const { wrapper } = makeWrapper("block");
    const { result } = renderHook(() => useAISecurity(), { wrapper });
    let allowed = true;
    act(() => {
      allowed = result.current.guardPrompt({ input: "key sk-abcdefghijklmnopqrstuvwx1234" }).allowed;
    });
    expect(allowed).toBe(false);
    expect(result.current.findings.length).toBeGreaterThan(0);
  });

  it("redacts via the hook", () => {
    const { wrapper } = makeWrapper("warn");
    const { result } = renderHook(() => useAISecurity(), { wrapper });
    expect(result.current.redact("ssn 123-45-6789")).toContain("[REDACTED_SSN]");
  });
});

describe("useSentinelPolicy", () => {
  it("evaluates integrity reports", async () => {
    const { wrapper } = makeWrapper("block");
    const { result } = renderHook(
      () => ({ integrity: useDeviceIntegrity(), policy: useSentinelPolicy() }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.integrity.report).not.toBeNull());
    const decision = result.current.policy.evaluateIntegrity(result.current.integrity.report!);
    expect(decision.allowed).toBe(false);
  });
});

describe("SentinelProvider", () => {
  it("renders children", () => {
    const { container } = render(
      <SentinelProvider config={{ policy: "monitor" }}>
        <span>child</span>
      </SentinelProvider>,
    );
    expect(container.textContent).toBe("child");
  });
});
