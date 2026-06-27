import { type Sentinel, SentinelRN } from "@sentinelrn/core";
import { useContext } from "react";
import { SentinelContext } from "./context.js";

/**
 * Access the active SentinelRN instance. Returns the instance from the nearest
 * {@link SentinelProvider}, or the shared singleton if no provider is mounted —
 * so hooks work even without a provider.
 */
export function useSentinel(): Sentinel {
  return useContext(SentinelContext) ?? SentinelRN;
}
