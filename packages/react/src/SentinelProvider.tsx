import { type Sentinel, type SentinelConfig, SentinelRN } from "@sentinelrn/core";
import { type ReactNode, useMemo } from "react";
import { SentinelContext } from "./context.js";

/** Props for {@link SentinelProvider}. */
export interface SentinelProviderProps {
  /** Configuration applied to the SentinelRN instance. */
  config?: SentinelConfig;
  /**
   * A specific Sentinel instance to provide. Defaults to the shared
   * `SentinelRN` singleton, so native provider registration done elsewhere
   * (e.g. `registerSentinelNative()`) takes effect.
   */
  instance?: Sentinel;
  children: ReactNode;
}

/**
 * Provides a configured SentinelRN instance to the React tree.
 *
 * ```tsx
 * <SentinelProvider config={{ policy: "warn" }}>
 *   <App />
 * </SentinelProvider>
 * ```
 */
export function SentinelProvider({ config, instance, children }: SentinelProviderProps) {
  const sentinel = instance ?? SentinelRN;

  // Apply configuration whenever the instance or config changes. configure() is
  // idempotent, so re-running on re-render is safe.
  useMemo(() => {
    if (config) sentinel.configure(config);
  }, [sentinel, config]);

  return <SentinelContext.Provider value={sentinel}>{children}</SentinelContext.Provider>;
}
