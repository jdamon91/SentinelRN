# @sentinelrn/native

Native runtime-integrity detectors for [SentinelRN](https://github.com/jdamon91/SentinelRN), with Android (Kotlin) and iOS (Swift) implementations.

This package implements the `IntegrityProvider` interface from `@sentinelrn/core`. It collects a flat "integrity snapshot" from the device and maps it into scored threat signals — all severity/confidence/scoring lives in core, keeping detection consistent across platforms.

## Install

```bash
pnpm add @sentinelrn/core @sentinelrn/native
```

For bare React Native, install pods:

```bash
cd ios && pod install
```

## Usage

Register the provider once at startup, before the first `integrity.check()`:

```ts
import { SentinelRN } from "@sentinelrn/core";
import { registerSentinelNative } from "@sentinelrn/native";

registerSentinelNative();

const report = await SentinelRN.integrity.check();
```

## What it detects

| Platform | Signals |
| --- | --- |
| Android | root (su binaries, root packages, test-keys, writable system paths), emulator, debugger, developer mode, mock location, hooking (Frida/Xposed) |
| iOS | jailbreak (filesystem paths, sandbox escape, Cydia scheme), simulator, debugger (`P_TRACED`) |

## Graceful degradation

When the native module is unavailable (Expo Go, web, tests), the provider falls back to best-effort JS-only heuristics and **never throws** — a detection gap becomes missing signals, not a crash. Meaningful root/jailbreak/hooking detection requires the native module in a development or production build.

## Architecture support

Works on both the **legacy bridge** and the **new architecture** (Fabric /
TurboModules, bridgeless).

- A codegen spec ships at [`src/NativeSentinelRNNative.ts`](src/NativeSentinelRNNative.ts)
  and is wired via the `codegenConfig` block in `package.json`, so
  `react-native-codegen` generates typed TurboModule interfaces at app build time.
- At runtime the module is resolved through `TurboModuleRegistry.get` first, then
  `NativeModules` — so the same provider works under either architecture, and
  returns `null` (degrading gracefully) when neither is present.

> Detection is heuristic and an arms race. SentinelRN raises attacker cost; it does not guarantee detection. See the [threat model](https://github.com/jdamon91/SentinelRN/blob/main/docs/THREAT_MODEL.md).

MIT © SentinelRN
