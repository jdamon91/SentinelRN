<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

type Sev = "low" | "medium" | "high" | "critical";
interface Signal {
  type: string;
  severity: Sev;
  confidence: string;
  platform: string;
  message: string;
}

const signals: Signal[] = [
  {
    type: "jailbreak",
    severity: "high",
    confidence: "medium",
    platform: "ios",
    message: "Suspicious jailbreak filesystem path detected",
  },
  {
    type: "hooking",
    severity: "critical",
    confidence: "medium",
    platform: "ios",
    message: "Frida instrumentation artifacts in process maps",
  },
  {
    type: "debugger",
    severity: "medium",
    confidence: "high",
    platform: "ios",
    message: "A debugger appears to be attached",
  },
];

const scanning = ref(true);
const score = ref(0);
const shown = ref(0);
const timers: ReturnType<typeof setTimeout>[] = [];
const TARGET = 82;

onMounted(() => {
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    scanning.value = false;
    score.value = TARGET;
    shown.value = signals.length;
    return;
  }
  // Brief "scanning" phase, then count the score up and reveal signals.
  timers.push(
    setTimeout(() => {
      scanning.value = false;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 900);
        score.value = Math.round(TARGET * (1 - (1 - t) ** 3));
        if (t < 1) timers.push(setTimeout(() => requestAnimationFrame(tick), 0) as never);
      };
      requestAnimationFrame(tick);
      signals.forEach((_, i) => {
        timers.push(setTimeout(() => (shown.value = i + 1), 500 + i * 280));
      });
    }, 1100),
  );
});

onBeforeUnmount(() => timers.forEach(clearTimeout));
</script>

<template>
  <div class="card">
    <div class="bar">
      <span class="dot r" /><span class="dot y" /><span class="dot g" />
      <span class="file">SentinelRN.integrity.check()</span>
      <span class="status" :class="scanning ? 'scan' : 'done'">{{
        scanning ? "scanning…" : "report"
      }}</span>
    </div>

    <div class="body">
      <div class="scoreRow">
        <div class="gauge" :class="{ live: !scanning }">
          <svg viewBox="0 0 120 120">
            <circle class="track" cx="60" cy="60" r="52" />
            <circle
              class="prog"
              cx="60"
              cy="60"
              r="52"
              :style="{ strokeDashoffset: 327 - (327 * score) / 100 }"
            />
          </svg>
          <div class="gaugeText">
            <strong>{{ score }}</strong><span>/100</span>
          </div>
        </div>
        <div class="verdict">
          <span class="pill high">riskLevel: high</span>
          <span class="pill danger">compromised: true</span>
          <p class="rec">
            recommendedAction:
            <code>block_sensitive_action</code>
          </p>
        </div>
      </div>

      <div class="signals">
        <transition-group name="row">
          <div
            v-for="(s, i) in signals"
            v-show="i < shown"
            :key="s.type"
            class="sig"
          >
            <span class="sev" :class="s.severity" />
            <div class="sigMain">
              <div class="sigTop">
                <span class="sigType">{{ s.type }}</span>
                <span class="badge" :class="s.severity">{{ s.severity }}</span>
                <span class="badge muted">conf {{ s.confidence }}</span>
                <span class="badge muted">{{ s.platform }}</span>
              </div>
              <p class="sigMsg">{{ s.message }}</p>
            </div>
          </div>
        </transition-group>
        <div v-show="shown < 1 && scanning" class="hint">analyzing runtime signals…</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  width: 100%;
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(13, 20, 36, 0.92), rgba(8, 13, 26, 0.92));
  border: 1px solid var(--sn-border-strong);
  box-shadow:
    0 30px 80px -30px rgba(0, 0, 0, 0.8),
    0 0 0 1px rgba(34, 211, 238, 0.05),
    0 0 60px -20px rgba(34, 211, 238, 0.35);
  backdrop-filter: blur(8px);
  overflow: hidden;
}
.bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--sn-border);
  background: rgba(255, 255, 255, 0.02);
}
.dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  display: inline-block;
}
.dot.r {
  background: #ff5f57;
}
.dot.y {
  background: #febc2e;
}
.dot.g {
  background: #28c840;
}
.file {
  margin-left: 8px;
  font-family: var(--vp-font-family-mono);
  font-size: 12.5px;
  color: var(--sn-muted);
}
.status {
  margin-left: auto;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: 3px 9px;
  border-radius: 999px;
}
.status.scan {
  color: var(--sn-cyan);
  background: rgba(34, 211, 238, 0.12);
  animation: blink 1.1s steps(2) infinite;
}
.status.done {
  color: var(--sn-green);
  background: rgba(52, 211, 153, 0.14);
}
.body {
  padding: 18px;
}
.scoreRow {
  display: flex;
  gap: 18px;
  align-items: center;
}
.gauge {
  position: relative;
  width: 108px;
  height: 108px;
  flex: none;
}
.gauge svg {
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
}
.gauge .track {
  fill: none;
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 9;
}
.gauge .prog {
  fill: none;
  stroke: url(#snStroke);
  stroke: var(--sn-warn);
  stroke-width: 9;
  stroke-linecap: round;
  stroke-dasharray: 327;
  transition: stroke-dashoffset 0.2s linear;
}
.gauge.live .prog {
  stroke: #fb923c;
  filter: drop-shadow(0 0 8px rgba(251, 146, 60, 0.6));
}
.gaugeText {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  text-align: center;
  line-height: 1;
}
.gaugeText strong {
  font-size: 28px;
  color: var(--sn-text);
}
.gaugeText span {
  font-size: 11px;
  color: var(--sn-muted);
}
.verdict {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.pill {
  align-self: flex-start;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 8px;
  border: 1px solid transparent;
}
.pill.high {
  color: #fdba74;
  background: rgba(251, 146, 60, 0.12);
  border-color: rgba(251, 146, 60, 0.3);
}
.pill.danger {
  color: var(--sn-danger);
  background: rgba(251, 113, 133, 0.12);
  border-color: rgba(251, 113, 133, 0.3);
}
.rec {
  margin: 2px 0 0;
  font-size: 12.5px;
  color: var(--sn-muted);
}
.rec code {
  color: var(--sn-cyan);
  background: rgba(34, 211, 238, 0.1);
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 12px;
}
.signals {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 70px;
}
.sig {
  display: flex;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid var(--sn-border);
}
.sev {
  width: 4px;
  border-radius: 4px;
  flex: none;
}
.sev.high {
  background: #fb923c;
}
.sev.critical {
  background: var(--sn-danger);
}
.sev.medium {
  background: var(--sn-warn);
}
.sev.low {
  background: var(--sn-green);
}
.sigTop {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.sigType {
  font-weight: 700;
  font-size: 13px;
  color: var(--sn-text);
  text-transform: capitalize;
}
.badge {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  padding: 2px 7px;
  border-radius: 999px;
}
.badge.critical {
  color: var(--sn-danger);
  background: rgba(251, 113, 133, 0.14);
}
.badge.high {
  color: #fdba74;
  background: rgba(251, 146, 60, 0.14);
}
.badge.medium {
  color: var(--sn-warn);
  background: rgba(251, 191, 36, 0.14);
}
.badge.muted {
  color: var(--sn-muted);
  background: rgba(148, 163, 184, 0.12);
}
.sigMsg {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--sn-muted);
}
.hint {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--sn-muted);
  opacity: 0.8;
  animation: blink 1.1s steps(2) infinite;
}

.row-enter-active {
  transition:
    opacity 0.45s ease,
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
.row-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

@keyframes blink {
  50% {
    opacity: 0.45;
  }
}
@media (prefers-reduced-motion: reduce) {
  .status.scan,
  .hint {
    animation: none;
  }
}
</style>
