import type { RiskLevel, ThreatReport } from "@sentinelrn/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSentinel } from "./useSentinel.js";

/** Options for {@link useDeviceIntegrity}. */
export interface UseDeviceIntegrityOptions {
  /** Run a check automatically on mount. Defaults to `true`. */
  auto?: boolean;
}

/** Return shape of {@link useDeviceIntegrity}. */
export interface UseDeviceIntegrityResult {
  /** The latest integrity report, or `null` before the first check. */
  report: ThreatReport | null;
  /** Whether a check is currently in flight. */
  loading: boolean;
  /** The error from the last check, if any. */
  error: unknown;
  /** Manually run (or re-run) an integrity check. */
  refresh: () => Promise<ThreatReport | null>;
  /** Convenience: `report?.compromised ?? false`. */
  compromised: boolean;
  /** Convenience: `report?.riskLevel ?? "low"`. */
  riskLevel: RiskLevel;
}

/**
 * Run runtime-integrity checks from React. Performs a check on mount (unless
 * disabled) and exposes a `refresh` for manual re-checks.
 *
 * ```tsx
 * const { report, loading, compromised, refresh } = useDeviceIntegrity();
 * ```
 */
export function useDeviceIntegrity(
  options: UseDeviceIntegrityOptions = {},
): UseDeviceIntegrityResult {
  const { auto = true } = options;
  const sentinel = useSentinel();
  const [report, setReport] = useState<ThreatReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const refresh = useCallback(async (): Promise<ThreatReport | null> => {
    setLoading(true);
    setError(null);
    try {
      const next = await sentinel.integrity.check();
      if (mounted.current) setReport(next);
      return next;
    } catch (err) {
      if (mounted.current) setError(err);
      return null;
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [sentinel]);

  useEffect(() => {
    if (auto) void refresh();
  }, [auto, refresh]);

  return {
    report,
    loading,
    error,
    refresh,
    compromised: report?.compromised ?? false,
    riskLevel: report?.riskLevel ?? "low",
  };
}
