import type { Sentinel } from "@sentinelrn/core";
import { createContext } from "react";

/**
 * React context carrying the active {@link Sentinel} instance. Consumers should
 * use the {@link useSentinel} hook rather than reading the context directly; it
 * falls back to the shared singleton when no provider is mounted.
 */
export const SentinelContext = createContext<Sentinel | null>(null);
SentinelContext.displayName = "SentinelContext";
