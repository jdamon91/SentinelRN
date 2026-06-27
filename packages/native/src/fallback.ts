import type { IntegritySnapshot } from "./types.js";

/**
 * Best-effort JS-only integrity heuristics for when the native module is not
 * installed (Expo Go, web, tests). This is intentionally minimal — meaningful
 * root/jailbreak/hooking detection requires native code. The only thing JS can
 * say with any confidence is whether the app is running a development build.
 */

// Provided by the React Native / Metro runtime; declared loosely so this file
// type-checks without RN types installed.
declare const __DEV__: boolean | undefined;

function detectPlatform(): IntegritySnapshot["platform"] {
  // Without react-native we cannot know the OS; default to a neutral value.
  // The platform mainly affects display, not scoring.
  return "android";
}

/** Produce a low-signal snapshot from JS-observable state only. */
export function fallbackSnapshot(): IntegritySnapshot {
  const isDev = typeof __DEV__ !== "undefined" && __DEV__ === true;
  return {
    platform: detectPlatform(),
    // A debug build implies developer tooling is in play — low severity, but
    // worth surfacing in monitor mode.
    isDeveloperModeEnabled: isDev ? true : undefined,
  };
}
