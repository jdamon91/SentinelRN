import { defineConfig } from "vitepress";

export default defineConfig({
  title: "SentinelRN",
  description: "Runtime Integrity and AI Security for React Native apps.",
  lang: "en-US",
  cleanUrls: true,
  lastUpdated: true,
  head: [["meta", { name: "theme-color", content: "#5b8cff" }]],
  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "API", link: "/reference/api" },
      { text: "Roadmap", link: "/reference/roadmap" },
      {
        text: "0.1",
        items: [
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
