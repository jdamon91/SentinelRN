import { defineConfig } from "vitepress";

// Inline shield favicon (data URI so the build stays self-contained).
const favicon =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22d3ee"/><stop offset="1" stop-color="#34d399"/></linearGradient></defs><path d="M16 2l11 4v8c0 7-4.7 13-11 16C9.7 27 5 21 5 14V6z" fill="none" stroke="url(#g)" stroke-width="2.2" stroke-linejoin="round"/><path d="M11 16l3.5 3.5L21 12" fill="none" stroke="url(#g)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  );

export default defineConfig({
  title: "SentinelRN",
  description: "Runtime Integrity and AI Security for React Native apps.",
  lang: "en-US",
  cleanUrls: true,
  lastUpdated: true,
  base: "/SentinelRN/",
  appearance: "dark",
  head: [
    ["link", { rel: "icon", href: favicon }],
    ["meta", { name: "theme-color", content: "#22d3ee" }],
    ["meta", { property: "og:type", content: "website" }],
    [
      "meta",
      {
        property: "og:title",
        content: "SentinelRN — Runtime Integrity & AI Security for React Native",
      },
    ],
    [
      "meta",
      {
        property: "og:description",
        content:
          "The application trust runtime for React Native. Structured, explainable threat reports — never bare booleans.",
      },
    ],
  ],
  themeConfig: {
    logo: favicon,
    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "API", link: "/reference/api" },
      { text: "Roadmap", link: "/reference/roadmap" },
      {
        text: "0.1",
        items: [
          { text: "npm", link: "https://www.npmjs.com/package/@sentinelrn/core" },
          {
            text: "Changelog",
            link: "https://github.com/jdamon91/SentinelRN/blob/main/CHANGELOG.md",
          },
          {
            text: "Contributing",
            link: "https://github.com/jdamon91/SentinelRN/blob/main/CONTRIBUTING.md",
          },
        ],
      },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "Introduction",
          items: [
            { text: "What is SentinelRN?", link: "/guide/what-is-sentinelrn" },
            { text: "Getting Started", link: "/guide/getting-started" },
          ],
        },
        {
          text: "Features",
          items: [
            { text: "Runtime Integrity", link: "/guide/runtime-integrity" },
            { text: "AI Security", link: "/guide/ai-security" },
            { text: "Policies", link: "/guide/policies" },
            { text: "React Integration", link: "/guide/react" },
          ],
        },
      ],
      "/reference/": [
        {
          text: "Reference",
          items: [
            { text: "API", link: "/reference/api" },
            { text: "Threat Model", link: "/reference/threat-model" },
            { text: "Architecture", link: "/reference/architecture" },
            { text: "Roadmap", link: "/reference/roadmap" },
          ],
        },
      ],
    },
    socialLinks: [{ icon: "github", link: "https://github.com/jdamon91/SentinelRN" }],
    footer: {
      message:
        "Released under the MIT License. SentinelRN is risk-based — always enforce trust on the server too.",
      copyright: "Copyright © 2026 SentinelRN",
    },
    search: { provider: "local" },
  },
});
