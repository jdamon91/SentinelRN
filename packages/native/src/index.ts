/**
 * @sentinelrn/native — native runtime-integrity detectors for SentinelRN.
 *
 * Provides an {@link IntegrityProvider} backed by Android (Kotlin) and iOS
 * (Swift) detectors. Register it once at startup:
 *
 * ```ts
 * import { registerSentinelNative } from "@sentinelrn/native";
 * registerSentinelNative();
 * ```
 */
export { fallbackSnapshot } from "./fallback.js";
export {
  __resetNativeModuleCache,
  getNativeModule,
  NATIVE_MODULE_NAME,
} from "./nativeModule.js";
export {
  createNativeIntegrityProvider,
  type NativeProviderOptions,
  nativeIntegrityProvider,
  snapshotToSignals,
} from "./provider.js";
export { registerSentinelNative } from "./register.js";
export type { IntegritySnapshot, SentinelNativeModule } from "./types.js";
