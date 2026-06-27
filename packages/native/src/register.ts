import { type Sentinel, SentinelRN } from "@sentinelrn/core";
import { createNativeIntegrityProvider, type NativeProviderOptions } from "./provider.js";

/**
 * Register the native integrity provider with a SentinelRN instance.
 *
 * Call once at app startup, before the first `integrity.check()`:
 *
 * ```ts
 * import { SentinelRN } from "@sentinelrn/core";
 * import { registerSentinelNative } from "@sentinelrn/native";
 *
 * registerSentinelNative();
 * ```
 *
 * @param target - The instance to register against. Defaults to the shared
 *   `SentinelRN` singleton.
 */
export function registerSentinelNative(
  target: Sentinel = SentinelRN,
  options?: NativeProviderOptions,
): void {
  target.registerIntegrityProvider(createNativeIntegrityProvider(options));
}
