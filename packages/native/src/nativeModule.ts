import type { SentinelNativeModule } from "./types.js";

/**
 * Locates the SentinelRN native module without hard-importing `react-native`,
 * so this package can be imported in plain JS/test/SSR environments where RN is
 * absent. Resolution is attempted once and cached.
 */

// `require` and `__DEV__` are provided by the Metro/React Native runtime. They
// are declared loosely here so the package type-checks without RN installed.
declare const require: ((id: string) => unknown) | undefined;

let resolved = false;
let cached: SentinelNativeModule | null = null;

interface ReactNativeLike {
  TurboModuleRegistry?: { get?: (name: string) => unknown };
  NativeModules?: Record<string, unknown>;
}

function loadReactNative(): ReactNativeLike | null {
  if (typeof require !== "function") return null;
  try {
    return require("react-native") as ReactNativeLike;
  } catch {
    return null;
  }
}

/** Module name registered by the Android/iOS native code. */
export const NATIVE_MODULE_NAME = "SentinelRNNative";

/** Get the native module, or `null` if it is unavailable in this environment. */
export function getNativeModule(): SentinelNativeModule | null {
  if (resolved) return cached;
  resolved = true;

  const rn = loadReactNative();
  if (!rn) return cached;

  const fromTurbo = rn.TurboModuleRegistry?.get?.(NATIVE_MODULE_NAME);
  const candidate = fromTurbo ?? rn.NativeModules?.[NATIVE_MODULE_NAME] ?? null;
  if (candidate && typeof (candidate as SentinelNativeModule).getIntegritySnapshot === "function") {
    cached = candidate as SentinelNativeModule;
  }
  return cached;
}

/** Reset the cached module. Intended for tests. */
export function __resetNativeModuleCache(): void {
  resolved = false;
  cached = null;
}
