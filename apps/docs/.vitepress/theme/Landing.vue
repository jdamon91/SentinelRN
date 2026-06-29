<script setup lang="ts">
import { withBase } from "vitepress";
import { ref } from "vue";
import HeroBackdrop from "./components/HeroBackdrop.vue";
import Reveal from "./components/Reveal.vue";
import ShieldMark from "./components/ShieldMark.vue";
import ThreatReportCard from "./components/ThreatReportCard.vue";

const INSTALL = "pnpm add @sentinelrn/core @sentinelrn/native @sentinelrn/react";
const copied = ref(false);
function copyInstall() {
  navigator.clipboard?.writeText(INSTALL).then(() => {
    copied.value = true;
    setTimeout(() => (copied.value = false), 1600);
  });
}

const features = [
  {
    icon: "🛡️",
    title: "Runtime Integrity",
    body: "Detect rooted, jailbroken, emulated, debugged, hooked, and tampered devices on Android & iOS.",
    accent: "cyan",
  },
  {
    icon: "🤖",
    title: "AI Security",
    body: "Catch secrets, PII, and prompt-injection in AI-bound text before it ever leaves the device.",
    accent: "indigo",
  },
  {
    icon: "⚖️",
    title: "Action-Aware Policies",
    body: "Turn risk into decisions — monitor, warn, block, strict — each with explainable reasons.",
    accent: "green",
  },
  {
    icon: "🧩",
    title: "Explainable, Never Booleans",
    body: "Every result tells you what, how severe, how confident, and what to do next.",
    accent: "cyan",
  },
  {
    icon: "⚛️",
    title: "React Native First",
    body: "A provider and hooks that feel native. TypeScript, Expo, and bare RN — both architectures.",
    accent: "indigo",
  },
  {
    icon: "📦",
    title: "Modular & Tree-shakeable",
    body: "A pure-TypeScript core with pluggable native detectors. Ship only what you use.",
    accent: "green",
  },
];

const pipeline = [
  { k: "provider", label: "Provider", desc: "native signals" },
  { k: "integrity", label: "Integrity", desc: "orchestrate" },
  { k: "threat", label: "Threat", desc: "normalize" },
  { k: "risk", label: "Risk", desc: "score" },
  { k: "report", label: "Report", desc: "explain" },
  { k: "policy", label: "Policy", desc: "decide" },
];

const aiFindings = [
  { type: "api_key", sev: "critical", redacted: "sk-•••••" },
  { type: "ssn", sev: "high", redacted: "123•••••" },
  { type: "prompt_injection", sev: "high", redacted: "“ignore all previous…”" },
];

const stats = [
  { v: "2", l: "lines to integrate" },
  { v: "0", l: "bare booleans" },
  { v: "iOS + Android", l: "native detectors" },
  { v: "MIT", l: "open source" },
];
</script>

<template>
  <div class="landing">
    <!-- Top nav -->
    <header class="nav">
      <a class="brand" :href="withBase('/')">
        <ShieldMark :size="30" />
        <span>Sentinel<span class="rn">RN</span></span>
      </a>
      <nav class="navlinks">
        <a :href="withBase('/guide/getting-started')">Docs</a>
        <a :href="withBase('/reference/api')">API</a>
        <a href="https://www.npmjs.com/package/@sentinelrn/core" target="_blank" rel="noreferrer">npm</a>
        <a href="https://github.com/jdamon91/SentinelRN" target="_blank" rel="noreferrer">GitHub</a>
        <a class="btn-mini" :href="withBase('/guide/getting-started')">Get started →</a>
      </nav>
    </header>

    <!-- Hero -->
    <section class="hero">
      <HeroBackdrop />
      <div class="hero-inner">
        <div class="emblem"><ShieldMark :size="128" /></div>
        <div class="eyebrow">
          <span class="ping" /> Application Trust Runtime · v0.1.1 on npm
        </div>
        <h1 class="headline">
          Runtime integrity &amp; AI security<br />
          <span class="grad">for React&nbsp;Native</span>
        </h1>
        <p class="sub">
          SentinelRN evaluates whether your app can trust its environment — and protects AI-bound
          input — returning <strong>structured, explainable threat reports</strong> instead of bare
          booleans.
        </p>

        <div class="cta">
          <a class="btn primary" :href="withBase('/guide/getting-started')">
            Get started
            <span class="arr">→</span>
          </a>
          <a class="btn ghost" href="https://github.com/jdamon91/SentinelRN" target="_blank" rel="noreferrer">
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"
              />
            </svg>
            Star on GitHub
          </a>
        </div>

        <button class="install" :class="{ ok: copied }" @click="copyInstall" type="button">
          <span class="dollar">$</span>
          <code>{{ INSTALL }}</code>
          <span class="copy">{{ copied ? "copied ✓" : "copy" }}</span>
        </button>

        <div class="trust">
          <span>TypeScript</span><i /><span>Expo &amp; bare RN</span><i /><span>Android</span><i /><span>iOS</span>
        </div>
      </div>

      <Reveal class="hero-card" :delay="120">
        <ThreatReportCard />
      </Reveal>
    </section>

    <!-- Stats band -->
    <section class="band">
      <Reveal v-for="(s, i) in stats" :key="s.l" class="stat" :delay="i * 80">
        <strong>{{ s.v }}</strong>
        <span>{{ s.l }}</span>
      </Reveal>
    </section>

    <!-- Features -->
    <section class="section">
      <Reveal class="section-head">
        <p class="kicker">Why SentinelRN</p>
        <h2>One trust layer for production mobile apps</h2>
        <p class="lead">
          Stop stitching together a jailbreak library, a PII scanner, and an injection filter.
          SentinelRN unifies them behind one cohesive, explainable API.
        </p>
      </Reveal>
      <div class="grid">
        <Reveal v-for="(f, i) in features" :key="f.title" class="fcard" :class="f.accent" :delay="i * 70">
          <div class="ficon">{{ f.icon }}</div>
          <h3>{{ f.title }}</h3>
          <p>{{ f.body }}</p>
          <span class="fglow" />
        </Reveal>
      </div>
    </section>

    <!-- Pipeline -->
    <section class="section">
      <Reveal class="section-head">
        <p class="kicker">How it works</p>
        <h2>Signals in, decisions out</h2>
        <p class="lead">
          Every detector feeds one pipeline. Platform code never decides behavior — it only reports.
        </p>
      </Reveal>
      <Reveal class="pipe">
        <div class="track"><span class="pulse" /></div>
        <div class="steps">
          <div v-for="(p, i) in pipeline" :key="p.k" class="step" :style="{ '--d': `${i * 0.4}s` }">
            <span class="node" />
            <strong>{{ p.label }}</strong>
            <em>{{ p.desc }}</em>
          </div>
        </div>
      </Reveal>
    </section>

    <!-- AI security demo -->
    <section class="section">
      <div class="split">
        <Reveal class="split-copy">
          <p class="kicker">AI Security, first-class</p>
          <h2>Guard prompts before they leave the device</h2>
          <p class="lead">
            Inspect AI-bound text for secrets, PII, and prompt-injection. Redact what's sensitive,
            block what's dangerous — under a policy you control.
          </p>
          <ul class="checks">
            <li>API keys, JWTs, AWS/GitHub/Stripe tokens</li>
            <li>Emails, phones, SSNs, Luhn-checked cards</li>
            <li>Instruction-override &amp; jailbreak heuristics</li>
          </ul>
          <a class="btn ghost sm" :href="withBase('/guide/ai-security')">Explore AI security →</a>
        </Reveal>
        <Reveal class="guard" :delay="120">
          <div class="guard-head">
            <span class="g-policy">policy: strict</span>
            <span class="g-block">BLOCKED</span>
          </div>
          <div class="g-input">"Summarize this. My key is sk-… and SSN 123-45-6789."</div>
          <div class="g-findings">
            <div v-for="f in aiFindings" :key="f.type" class="g-find">
              <span class="g-type">{{ f.type }}</span>
              <span class="g-sev" :class="f.sev">{{ f.sev }}</span>
              <code class="g-red">{{ f.redacted }}</code>
            </div>
          </div>
          <div class="g-foot">recommendedAction: <code>block</code></div>
        </Reveal>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="section cta-final">
      <Reveal class="cta-box">
        <ShieldMark :size="76" />
        <h2>Trust your mobile runtime in minutes</h2>
        <p class="lead">Install, register the native provider, and ship safer AI &amp; payments flows.</p>
        <button class="install big" :class="{ ok: copied }" @click="copyInstall" type="button">
          <span class="dollar">$</span><code>{{ INSTALL }}</code>
          <span class="copy">{{ copied ? "copied ✓" : "copy" }}</span>
        </button>
        <div class="cta-row">
          <a class="btn primary" :href="withBase('/guide/getting-started')">Read the docs →</a>
          <a class="btn ghost" href="https://www.npmjs.com/package/@sentinelrn/core" target="_blank" rel="noreferrer">View on npm</a>
        </div>
      </Reveal>
    </section>

    <!-- Footer -->
    <footer class="foot">
      <div class="foot-top">
        <a class="brand sm" :href="withBase('/')"><ShieldMark :size="24" /><span>Sentinel<span class="rn">RN</span></span></a>
        <div class="foot-links">
          <a :href="withBase('/guide/getting-started')">Getting Started</a>
          <a :href="withBase('/reference/api')">API</a>
          <a :href="withBase('/reference/threat-model')">Threat Model</a>
          <a href="https://github.com/jdamon91/SentinelRN" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.npmjs.com/package/@sentinelrn/core" target="_blank" rel="noreferrer">npm</a>
        </div>
      </div>
      <p class="disclaimer">
        SentinelRN is risk-based: detection is probabilistic and explainable, never a guarantee.
        Always enforce trust on the server too. · MIT License
      </p>
    </footer>
  </div>
</template>

<style scoped>
.landing {
  background: var(--sn-bg);
  color: var(--sn-text);
  min-height: 100vh;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
}
.landing :deep(a) {
  text-decoration: none;
}

/* Nav */
.nav {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px clamp(16px, 5vw, 56px);
  background: rgba(6, 9, 18, 0.6);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--sn-border);
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  font-size: 18px;
  letter-spacing: -0.02em;
  color: var(--sn-text) !important;
}
.brand .rn {
  background: var(--sn-grad);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.navlinks {
  display: flex;
  align-items: center;
  gap: clamp(12px, 2vw, 26px);
}
.navlinks a {
  color: var(--sn-muted) !important;
  font-size: 14px;
  font-weight: 600;
  transition: color 0.2s;
}
.navlinks a:hover {
  color: var(--sn-text) !important;
}
.btn-mini {
  padding: 7px 14px;
  border-radius: 9px;
  border: 1px solid var(--sn-border-strong);
  color: var(--sn-cyan) !important;
  background: rgba(34, 211, 238, 0.08);
}
.btn-mini:hover {
  background: rgba(34, 211, 238, 0.16);
}
@media (max-width: 720px) {
  .navlinks a:not(.btn-mini) {
    display: none;
  }
}

/* Hero */
.hero {
  position: relative;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: clamp(24px, 4vw, 64px);
  align-items: center;
  padding: clamp(48px, 8vw, 110px) clamp(16px, 5vw, 56px) clamp(40px, 6vw, 80px);
  max-width: 1240px;
  margin: 0 auto;
}
.hero-inner {
  position: relative;
  z-index: 2;
}
.emblem {
  display: none;
}
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-size: 13px;
  font-weight: 600;
  color: #bfe9f4;
  background: rgba(34, 211, 238, 0.08);
  border: 1px solid var(--sn-border-strong);
  padding: 6px 13px;
  border-radius: 999px;
  margin-bottom: 22px;
}
.ping {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--sn-green);
  box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.7);
  animation: ping 2s ease-out infinite;
}
.headline {
  font-size: clamp(34px, 5.4vw, 62px);
  line-height: 1.04;
  letter-spacing: -0.03em;
  font-weight: 850;
  margin: 0 0 20px;
  border: 0;
}
.grad {
  background: var(--sn-grad);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: shimmer 7s ease-in-out infinite;
}
.sub {
  font-size: clamp(15px, 1.6vw, 18px);
  line-height: 1.6;
  color: var(--sn-muted);
  max-width: 560px;
  margin: 0 0 28px;
}
.sub strong {
  color: var(--sn-text);
}
.cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}
.btn {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 12px 20px;
  border-radius: 11px;
  font-weight: 700;
  font-size: 15px;
  transition:
    transform 0.18s ease,
    box-shadow 0.25s ease,
    background 0.2s ease;
}
.btn.sm {
  padding: 9px 14px;
  font-size: 14px;
}
.btn.primary {
  color: #04121a !important;
  background: linear-gradient(100deg, #22d3ee, #38bdf8 60%, #34d399);
  box-shadow: 0 10px 30px -8px rgba(34, 211, 238, 0.6);
}
.btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 40px -8px rgba(34, 211, 238, 0.75);
}
.btn.primary .arr {
  transition: transform 0.2s;
}
.btn.primary:hover .arr {
  transform: translateX(4px);
}
.btn.ghost {
  color: var(--sn-text) !important;
  border: 1px solid var(--sn-border-strong);
  background: rgba(255, 255, 255, 0.03);
}
.btn.ghost:hover {
  background: rgba(255, 255, 255, 0.07);
  transform: translateY(-2px);
}
.install {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  color: var(--sn-text);
  background: rgba(8, 13, 26, 0.8);
  border: 1px solid var(--sn-border);
  border-radius: 11px;
  padding: 11px 13px;
  cursor: pointer;
  transition: border-color 0.2s;
  max-width: 100%;
  overflow: hidden;
}
.install:hover {
  border-color: var(--sn-border-strong);
}
.install .dollar {
  color: var(--sn-green);
}
.install code {
  color: #cde9f5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.install .copy {
  margin-left: auto;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--sn-cyan);
  padding-left: 10px;
  flex: none;
}
.install.ok .copy {
  color: var(--sn-green);
}
.trust {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
  color: var(--sn-muted);
  font-size: 13px;
  font-weight: 600;
}
.trust i {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--sn-border-strong);
}
.hero-card {
  position: relative;
  z-index: 2;
}
@media (max-width: 940px) {
  .hero {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .hero-inner .eyebrow,
  .hero-inner .cta,
  .hero-inner .trust {
    justify-content: center;
  }
  .sub {
    margin-left: auto;
    margin-right: auto;
  }
  .emblem {
    display: flex;
    justify-content: center;
    margin-bottom: 8px;
  }
}

/* Stats band */
.band {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  max-width: 1080px;
  margin: 0 auto;
  padding: 8px clamp(16px, 5vw, 56px) 12px;
}
.stat {
  text-align: center;
  padding: 18px 12px;
  border: 1px solid var(--sn-border);
  border-radius: 14px;
  background: var(--sn-panel);
}
.stat strong {
  display: block;
  font-size: clamp(18px, 2.4vw, 26px);
  background: var(--sn-grad);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.stat span {
  font-size: 12.5px;
  color: var(--sn-muted);
}
@media (max-width: 640px) {
  .band {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Sections */
.section {
  max-width: 1160px;
  margin: 0 auto;
  padding: clamp(48px, 7vw, 96px) clamp(16px, 5vw, 56px);
}
.section-head {
  text-align: center;
  max-width: 720px;
  margin: 0 auto clamp(32px, 5vw, 52px);
}
.kicker {
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 12px;
  font-weight: 800;
  color: var(--sn-cyan);
  margin: 0 0 10px;
}
.section-head h2,
.split-copy h2,
.cta-box h2 {
  font-size: clamp(26px, 3.6vw, 40px);
  letter-spacing: -0.02em;
  line-height: 1.12;
  margin: 0 0 14px;
  border: 0;
}
.lead {
  color: var(--sn-muted);
  font-size: clamp(15px, 1.5vw, 17px);
  line-height: 1.65;
  margin: 0;
}

/* Feature grid */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}
@media (max-width: 900px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
.fcard {
  position: relative;
  padding: 24px;
  border-radius: 16px;
  background: var(--sn-panel);
  border: 1px solid var(--sn-border);
  overflow: hidden;
  transition:
    transform 0.25s ease,
    border-color 0.25s ease;
}
.fcard:hover {
  transform: translateY(-4px);
  border-color: var(--sn-border-strong);
}
.fcard .fglow {
  position: absolute;
  top: -40%;
  right: -30%;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  filter: blur(40px);
}
.fcard.cyan .fglow {
  background: radial-gradient(closest-side, rgba(34, 211, 238, 0.4), transparent);
}
.fcard.indigo .fglow {
  background: radial-gradient(closest-side, rgba(129, 140, 248, 0.4), transparent);
}
.fcard.green .fglow {
  background: radial-gradient(closest-side, rgba(52, 211, 153, 0.4), transparent);
}
.fcard:hover .fglow {
  opacity: 1;
}
.ficon {
  font-size: 26px;
  width: 50px;
  height: 50px;
  display: grid;
  place-items: center;
  border-radius: 13px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--sn-border);
  margin-bottom: 14px;
}
.fcard h3 {
  font-size: 17px;
  margin: 0 0 8px;
  letter-spacing: -0.01em;
}
.fcard p {
  color: var(--sn-muted);
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

/* Pipeline */
.pipe {
  position: relative;
  margin-top: 8px;
}
.pipe .track {
  position: absolute;
  top: 13px;
  left: 6%;
  right: 6%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--sn-border-strong), transparent);
  overflow: hidden;
}
.pipe .pulse {
  position: absolute;
  top: 0;
  left: 0;
  width: 22%;
  height: 100%;
  background: linear-gradient(90deg, transparent, var(--sn-cyan), transparent);
  animation: flow 3.4s linear infinite;
}
.steps {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  position: relative;
}
.step {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.node {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--sn-bg-2);
  border: 2px solid var(--sn-cyan);
  box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.5);
  animation: nodepulse 3s ease-in-out infinite;
  animation-delay: var(--d);
}
.step strong {
  font-size: 13.5px;
}
.step em {
  font-style: normal;
  font-size: 11.5px;
  color: var(--sn-muted);
}
@media (max-width: 720px) {
  .steps {
    grid-template-columns: repeat(3, 1fr);
    gap: 18px 10px;
  }
  .pipe .track {
    display: none;
  }
}

/* AI split */
.split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(24px, 4vw, 56px);
  align-items: center;
}
@media (max-width: 880px) {
  .split {
    grid-template-columns: 1fr;
  }
}
.checks {
  list-style: none;
  padding: 0;
  margin: 18px 0 22px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.checks li {
  position: relative;
  padding-left: 28px;
  color: var(--sn-text);
  font-size: 14.5px;
}
.checks li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(52, 211, 153, 0.16);
  border: 1px solid rgba(52, 211, 153, 0.5);
}
.checks li::after {
  content: "";
  position: absolute;
  left: 6px;
  top: 6px;
  width: 6px;
  height: 9px;
  border: solid var(--sn-green);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
.guard {
  border-radius: 16px;
  border: 1px solid var(--sn-border-strong);
  background: linear-gradient(180deg, rgba(13, 20, 36, 0.9), rgba(8, 13, 26, 0.9));
  padding: 18px;
  box-shadow: 0 30px 70px -30px rgba(0, 0, 0, 0.7), 0 0 50px -22px rgba(129, 140, 248, 0.4);
}
.guard-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.g-policy {
  font-family: var(--vp-font-family-mono);
  font-size: 12.5px;
  color: var(--sn-indigo);
}
.g-block {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: var(--sn-danger);
  background: rgba(251, 113, 133, 0.14);
  border: 1px solid rgba(251, 113, 133, 0.3);
  padding: 3px 10px;
  border-radius: 999px;
}
.g-input {
  font-family: var(--vp-font-family-mono);
  font-size: 12.5px;
  color: #cdd9ec;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--sn-border);
  border-radius: 10px;
  padding: 12px;
  line-height: 1.5;
  margin-bottom: 14px;
}
.g-findings {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.g-find {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 11px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid var(--sn-border);
}
.g-type {
  font-weight: 700;
  font-size: 13px;
  text-transform: capitalize;
}
.g-sev {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: 999px;
}
.g-sev.critical {
  color: var(--sn-danger);
  background: rgba(251, 113, 133, 0.14);
}
.g-sev.high {
  color: #fdba74;
  background: rgba(251, 146, 60, 0.14);
}
.g-red {
  margin-left: auto;
  font-size: 12px;
  color: var(--sn-muted);
}
.g-foot {
  margin-top: 14px;
  font-size: 12.5px;
  color: var(--sn-muted);
}
.g-foot code {
  color: var(--sn-danger);
  background: rgba(251, 113, 133, 0.12);
  padding: 2px 7px;
  border-radius: 6px;
}

/* Final CTA */
.cta-final {
  text-align: center;
}
.cta-box {
  position: relative;
  max-width: 760px;
  margin: 0 auto;
  padding: clamp(36px, 5vw, 64px) clamp(20px, 4vw, 56px);
  border-radius: 24px;
  border: 1px solid var(--sn-border-strong);
  background:
    radial-gradient(120% 120% at 50% 0%, rgba(34, 211, 238, 0.1), transparent 60%),
    linear-gradient(180deg, rgba(13, 20, 36, 0.6), rgba(8, 13, 26, 0.6));
  display: flex;
  flex-direction: column;
  align-items: center;
}
.cta-box h2 {
  margin-top: 14px;
}
.cta-box .install {
  margin: 22px 0 18px;
}
.install.big code {
  white-space: normal;
}
.cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

/* Footer */
.foot {
  border-top: 1px solid var(--sn-border);
  padding: 36px clamp(16px, 5vw, 56px) 48px;
  max-width: 1160px;
  margin: 0 auto;
}
.foot-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}
.brand.sm {
  font-size: 16px;
}
.foot-links {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
}
.foot-links a {
  color: var(--sn-muted) !important;
  font-size: 13.5px;
  font-weight: 600;
}
.foot-links a:hover {
  color: var(--sn-text) !important;
}
.disclaimer {
  margin: 22px 0 0;
  color: var(--sn-muted);
  font-size: 12.5px;
  line-height: 1.6;
  opacity: 0.85;
}

/* Keyframes */
@keyframes ping {
  0% {
    box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.6);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(52, 211, 153, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(52, 211, 153, 0);
  }
}
@keyframes shimmer {
  0%,
  100% {
    background-position: 0% center;
  }
  50% {
    background-position: 100% center;
  }
}
@keyframes flow {
  to {
    transform: translateX(560%);
  }
}
@keyframes nodepulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.4);
  }
  50% {
    box-shadow: 0 0 0 7px rgba(34, 211, 238, 0);
  }
}
@media (prefers-reduced-motion: reduce) {
  .grad,
  .ping,
  .pulse,
  .node {
    animation: none;
  }
}
</style>
