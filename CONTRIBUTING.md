# Contributing to SentinelRN

Thanks for your interest in making React Native apps safer! SentinelRN is a
risk-based security framework, and contributions of all kinds are welcome.

## Prerequisites

- Node.js 20+
- pnpm 10+ (`corepack enable`)

## Getting started

```bash
git clone https://github.com/sentinelrn/sentinelrn.git
cd sentinelrn
pnpm install
pnpm build
pnpm test
```

## Workspace layout

See [docs/REPO_ARCHITECTURE.md](docs/REPO_ARCHITECTURE.md). In short:

- `packages/core` — the engine. **No platform or React code.**
- `packages/native` — Android/iOS detectors.
- `packages/react` — hooks and provider.
- `apps/example` — the demo app.

## Development workflow

```bash
pnpm typecheck        # tsc across all packages
pnpm lint             # biome check
pnpm format           # biome format --write
pnpm test             # vitest across all packages
```

Per-package, e.g.:

```bash
pnpm --filter @sentinelrn/core test:watch
```

## Guidelines

1. **Every feature maps to a documented threat.** If it doesn't reduce, detect,
   explain, or help respond to something in
   [the threat model](docs/THREAT_MODEL.md), it probably doesn't belong here.
2. **Explain everything.** Never return bare booleans — return structured
   results with severity, confidence, and a recommended action.
3. **Be honest about limitations.** No "unhackable" / "guaranteed" claims.
   Detection is probabilistic.
4. **Secure defaults.** The safest path should be the easiest path.
5. **Keep `core` pure.** No platform or React imports in `@sentinelrn/core`.
6. **Tests required.** Add or update Vitest tests for behavior changes; aim to
   keep `@sentinelrn/core` at ≥ 90% coverage.

## Commits & PRs

- Use clear, conventional-style commit messages (`feat(core): …`, `fix(native): …`).
- Keep PRs focused. Ensure `pnpm lint`, `pnpm typecheck`, `pnpm test`, and
  `pnpm build` all pass before requesting review.
- Update relevant docs and the [CHANGELOG](CHANGELOG.md).

## Reporting security issues

Please **do not** open public issues for vulnerabilities. See
[SECURITY.md](SECURITY.md).

## License

By contributing, you agree your contributions are licensed under the MIT License.
