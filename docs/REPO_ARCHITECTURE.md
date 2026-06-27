# Repository Architecture

SentinelRN is a pnpm + Turborepo monorepo. The security logic lives in a single
framework-agnostic engine; everything else either feeds it signals or consumes
its reports.

## Layout

```
sentinelrn/
├── packages/
│   ├── core/      @sentinelrn/core   — the engine (pure TypeScript, no platform/React)
│   ├── native/    @sentinelrn/native — Android (Kotlin) + iOS (Swift) integrity detectors
│   └── react/     @sentinelrn/react  — SentinelProvider + hooks
├── apps/
│   ├── example/   Expo demo app exercising the full MVP
│   └── docs/      (reserved) documentation site
└── docs/          product, architecture, API, and threat-model specs
```

## Dependency rules

```
core   ──>  (no dependencies)
native ──>  core            (implements IntegrityProvider)
react  ──>  core            (consumes the SentinelRN API)
example ─>  core + native + react
```

- **Nothing depends on React except `@sentinelrn/react`.**
- **`core` contains no platform-specific code.** Platform detectors are injected
  at runtime via the `IntegrityProvider` interface.
- New capabilities (Play Integrity, App Attest, SSL pinning, …) plug into the
  threat engine as additional providers without changing the public API.

## Inside `@sentinelrn/core`

```
types/      shared vocabulary (severity, confidence, reports, findings, config)
risk/       severity + confidence  → score, risk level, recommended action
threat/     raw signals            → normalized signals → ThreatReport
ai/         secret/PII/injection detection, redaction, PromptGuard
policy/     reports                → allow/block decisions with reasons
integrity/  orchestration + IntegrityProvider interface
core/       config resolution + assembled SentinelRN facade
```

Data flow: `provider → integrity → threat → risk → report → policy → app`.

## Tooling

| Concern | Tool |
| --- | --- |
| Package manager / workspaces | pnpm |
| Task orchestration / caching | Turborepo |
| Bundling (ESM + CJS + d.ts) | tsup |
| Tests | Vitest |
| Lint + format | Biome |
| Types | TypeScript (strict, `verbatimModuleSyntax`) |

## Common commands

```bash
pnpm install          # install workspace deps
pnpm build            # build all packages (turbo)
pnpm test             # run all unit tests
pnpm typecheck        # typecheck all packages
pnpm lint             # biome check
pnpm --filter @sentinelrn/example start   # run the demo app
```
