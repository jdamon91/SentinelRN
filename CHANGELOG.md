# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project aims to
follow [Semantic Versioning](https://semver.org/) after 1.0.

## [Unreleased]

### Added

- **`@sentinelrn/core` 0.1.0** — the Application Trust Runtime engine:
  - Shared trust/threat type vocabulary.
  - Risk engine: probabilistic scoring → score, risk level, recommended action.
  - Threat engine: signal normalization and structured `ThreatReport`s.
  - AI guard: detection of API keys, secrets, credentials, JWTs, emails, phone
    numbers, SSNs, credit cards (Luhn-validated), IPs, and prompt-injection.
  - Redaction utilities (`redact`, `inspectAndRedact`).
  - Policy engine: `monitor` / `warn` / `block`, plus `strict` for AI prompts.
  - Cohesive `SentinelRN` API with `configure()` and a shared singleton.
- **`@sentinelrn/native` 0.1.0** — Android (Kotlin) and iOS (Swift) runtime
  integrity detectors behind a pluggable `IntegrityProvider`, with a graceful
  JS-only fallback.
- **`@sentinelrn/react` 0.1.0** — `SentinelProvider` and the `useDeviceIntegrity`,
  `useAISecurity`, `useSentinelPolicy`, and `useSentinel` hooks.
- **Example app** — an Expo demo exercising integrity reports, the prompt guard,
  redaction, and live policy switching.
- Monorepo tooling: pnpm workspaces, Turborepo, tsup, Vitest, Biome, and CI.
