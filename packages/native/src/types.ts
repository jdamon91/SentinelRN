/**
 * The flat integrity snapshot returned by the native module. Each platform
 * populates the fields it can detect; absent fields are simply `undefined`.
 * Keeping the bridge as a flat boolean snapshot keeps the native code simple —
 * all severity/confidence/scoring lives in `@sentinelrn/core`.
 */
export interface IntegritySnapshot {
  platform: "ios" | "android";
  /** iOS: known jailbreak indicators present. */
  isJailbroken?: boolean;
  /** Android: known root indicators present. */
  isRooted?: boolean;
  /** Android: running inside an emulator. */
  isEmulator?: boolean;
  /** iOS: running inside the iOS Simulator. */
  isSimulator?: boolean;
  /** A debugger appears to be attached. */
  isDebuggerAttached?: boolean;
  /** Android: developer options enabled. */
  isDeveloperModeEnabled?: boolean;
  /** Android: mock location providers allowed. */
  isMockLocationEnabled?: boolean;
  /** Runtime hooking / instrumentation framework indicators (Frida, etc.). */
  isHookingDetected?: boolean;
  /** App tampering / repackaging indicators (signature mismatch, etc.). */
  isTamperingDetected?: boolean;
  /** Optional supporting evidence (paths, properties). May be sensitive. */
  evidence?: Record<string, unknown>;
}

/** The TurboModule / NativeModule contract implemented by the platform code. */
export interface SentinelNativeModule {
  /** Collect an integrity snapshot asynchronously (preferred). */
  getIntegritySnapshot(): Promise<IntegritySnapshot>;
}
