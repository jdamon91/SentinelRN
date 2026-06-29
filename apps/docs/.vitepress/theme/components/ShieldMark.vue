<script setup lang="ts">
// Animated SentinelRN shield: drawn outline, pulsing core, orbiting scan ring,
// and a check that completes the "verified" gesture. Pure SVG + CSS.
withDefaults(defineProps<{ size?: number }>(), { size: 240 });
</script>

<template>
  <div class="shield" :style="{ width: `${size}px`, height: `${size}px` }" aria-hidden="true">
    <div class="halo" />
    <div class="orbit">
      <span class="sat" />
    </div>
    <svg class="glyph" viewBox="0 0 120 132" fill="none">
      <defs>
        <linearGradient id="snStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#22d3ee" />
          <stop offset="0.5" stop-color="#38bdf8" />
          <stop offset="1" stop-color="#34d399" />
        </linearGradient>
        <radialGradient id="snCore" cx="50%" cy="42%" r="60%">
          <stop offset="0" stop-color="rgba(34,211,238,0.55)" />
          <stop offset="1" stop-color="rgba(34,211,238,0)" />
        </radialGradient>
      </defs>
      <path class="core" d="M60 6l46 16v34c0 30-19.5 53-46 64C33.5 109 14 86 14 56V22z" fill="url(#snCore)" />
      <path
        class="outline"
        d="M60 6l46 16v34c0 30-19.5 53-46 64C33.5 109 14 86 14 56V22z"
        stroke="url(#snStroke)"
        stroke-width="3"
        stroke-linejoin="round"
      />
      <path
        class="scan"
        d="M22 60h76"
        stroke="rgba(34,211,238,0.85)"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        class="check"
        d="M40 62l13 13 27-29"
        stroke="url(#snStroke)"
        stroke-width="5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<style scoped>
.shield {
  position: relative;
  display: grid;
  place-items: center;
}
.halo {
  position: absolute;
  inset: -18%;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(34, 211, 238, 0.22), transparent 72%);
  filter: blur(6px);
  animation: pulse 4.2s ease-in-out infinite;
}
.glyph {
  position: relative;
  width: 64%;
  height: 64%;
  filter: drop-shadow(0 10px 26px rgba(34, 211, 238, 0.28));
}
.core {
  opacity: 0.6;
  animation: breathe 4.2s ease-in-out infinite;
  transform-origin: center;
}
.outline {
  stroke-dasharray: 360;
  stroke-dashoffset: 360;
  animation: draw 1.8s cubic-bezier(0.65, 0, 0.35, 1) 0.15s forwards;
}
.check {
  stroke-dasharray: 70;
  stroke-dashoffset: 70;
  animation: draw 0.7s cubic-bezier(0.65, 0, 0.35, 1) 1.5s forwards;
}
.scan {
  opacity: 0;
  animation: scan 3.4s ease-in-out 2s infinite;
}
.orbit {
  position: absolute;
  inset: 4%;
  border-radius: 50%;
  border: 1px dashed rgba(120, 210, 255, 0.22);
  animation: spin 16s linear infinite;
}
.sat {
  position: absolute;
  top: -4px;
  left: 50%;
  width: 8px;
  height: 8px;
  margin-left: -4px;
  border-radius: 50%;
  background: var(--sn-cyan);
  box-shadow: 0 0 14px 3px rgba(34, 211, 238, 0.8);
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes pulse {
  0%,
  100% {
    opacity: 0.55;
    transform: scale(0.98);
  }
  50% {
    opacity: 1;
    transform: scale(1.04);
  }
}
@keyframes breathe {
  0%,
  100% {
    opacity: 0.45;
  }
  50% {
    opacity: 0.85;
  }
}
@keyframes scan {
  0% {
    opacity: 0;
    transform: translateY(-26px);
  }
  20%,
  60% {
    opacity: 0.9;
  }
  100% {
    opacity: 0;
    transform: translateY(28px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .halo,
  .core,
  .outline,
  .check,
  .scan,
  .orbit {
    animation: none;
  }
  .outline,
  .check {
    stroke-dashoffset: 0;
  }
}
</style>
