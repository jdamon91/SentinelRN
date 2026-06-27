# SentinelRN Example App

An Expo app demonstrating the full SentinelRN MVP:

- **Runtime integrity** — structured threat reports with scoring, signal
  explanations, and live policy decisions. Uses a demo provider so the report UI
  is meaningful in Expo Go / the simulator. In a real build, call
  `registerSentinelNative()` from `@sentinelrn/native` instead.
- **AI prompt guard** — detect secrets, PII, and prompt-injection in AI-bound
  text, with redaction.
- **Policy modes** — switch between `monitor` / `warn` / `block` and watch the
  decisions change across both features.

## Run

```bash
pnpm install
pnpm --filter @sentinelrn/example start
```

Then press `i` (iOS simulator), `a` (Android emulator), or `w` (web).

> The bundled native detectors require a development build (`expo prebuild` +
> `expo run:ios` / `expo run:android`). Expo Go falls back to the JS-only
> heuristics, which is why this demo injects sample integrity scenarios.
