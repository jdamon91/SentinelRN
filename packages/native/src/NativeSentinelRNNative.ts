import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

/**
 * React Native **new architecture** codegen spec for the SentinelRN native
 * module.
 *
 * `react-native-codegen` parses this file at the app's native build time (driven
 * by the `codegenConfig` block in package.json) to generate the Java/Kotlin and
 * Objective-C++/Swift TurboModule interfaces. It is intentionally excluded from
 * this package's own `tsc`/`tsup` pipeline — it depends on `react-native`, which
 * is a peer dependency only present inside a real app.
 *
 * At runtime the module is resolved through {@link getNativeModule} (which uses
 * `TurboModuleRegistry.get` so it degrades gracefully); this default export
 * exists for codegen and for consumers that prefer the typed accessor.
 *
 * Codegen supports a constrained type system, so the snapshot here uses only
 * primitives and optionals. The richer `IntegritySnapshot` (with `evidence`)
 * lives in `./types` and is a superset of this shape.
 */
export interface Spec extends TurboModule {
  getIntegritySnapshot(): Promise<{
    platform: string;
    isJailbroken?: boolean;
    isRooted?: boolean;
    isEmulator?: boolean;
    isSimulator?: boolean;
    isDebuggerAttached?: boolean;
    isDeveloperModeEnabled?: boolean;
    isMockLocationEnabled?: boolean;
    isHookingDetected?: boolean;
    isTamperingDetected?: boolean;
  }>;
}

export default TurboModuleRegistry.get<Spec>("SentinelRNNative");
