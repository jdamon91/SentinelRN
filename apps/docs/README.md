# SentinelRN Documentation

The documentation site, built with [VitePress](https://vitepress.dev).

## Develop

```bash
pnpm install
pnpm --filter @sentinelrn/docs dev
```

## Build

```bash
pnpm --filter @sentinelrn/docs build     # outputs .vitepress/dist
pnpm --filter @sentinelrn/docs preview
```

Content lives in `guide/` and `reference/`; navigation is configured in
`.vitepress/config.ts`.
