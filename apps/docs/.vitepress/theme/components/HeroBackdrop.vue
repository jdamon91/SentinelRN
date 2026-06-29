<script setup lang="ts">
// Cinematic, dependency-free backdrop: drifting aurora glows, a perspective
// grid, a slow radar sweep, and a field of floating "signal" motes.
const motes = Array.from({ length: 22 }, (_, i) => {
  // Deterministic pseudo-random placement (no Math.random → SSR-stable).
  const x = (i * 47) % 100;
  const y = (i * 71) % 100;
  const d = 9 + ((i * 13) % 12);
  const delay = (i % 9) * 0.6;
  const s = 1.5 + ((i * 7) % 4) * 0.7;
  return { x, y, d, delay, s };
});
</script>

<template>
  <div class="backdrop" aria-hidden="true">
    <div class="aurora a1" />
    <div class="aurora a2" />
    <div class="aurora a3" />
    <div class="grid" />
    <div class="radar" />
    <div class="motes">
      <span
        v-for="(m, i) in motes"
        :key="i"
        class="mote"
        :style="{
          left: `${m.x}%`,
          top: `${m.y}%`,
          width: `${m.s}px`,
          height: `${m.s}px`,
          animationDuration: `${m.d}s`,
          animationDelay: `${m.delay}s`,
        }"
      />
    </div>
    <div class="vignette" />
  </div>
</template>

<style scoped>
.backdrop {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background:
    radial-gradient(1200px 600px at 50% -10%, rgba(34, 211, 238, 0.08), transparent 60%),
    linear-gradient(180deg, #060912 0%, #070d1b 60%, #060912 100%);
}
.aurora {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.5;
  mix-blend-mode: screen;
  will-change: transform;
}
.a1 {
  width: 46vw;
  height: 46vw;
  left: -8vw;
  top: -10vw;
  background: radial-gradient(closest-side, rgba(34, 211, 238, 0.5), transparent);
  animation: drift1 18s ease-in-out infinite;
}
.a2 {
  width: 40vw;
  height: 40vw;
  right: -6vw;
  top: -4vw;
  background: radial-gradient(closest-side, rgba(129, 140, 248, 0.45), transparent);
  animation: drift2 22s ease-in-out infinite;
}
.a3 {
  width: 50vw;
  height: 50vw;
  left: 30vw;
  bottom: -26vw;
  background: radial-gradient(closest-side, rgba(52, 211, 153, 0.32), transparent);
  animation: drift3 26s ease-in-out infinite;
}
.grid {
  position: absolute;
  inset: -2px;
  background-image:
    linear-gradient(rgba(120, 190, 255, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(120, 190, 255, 0.07) 1px, transparent 1px);
  background-size: 46px 46px;
  mask-image: radial-gradient(circle at 50% 28%, black 0%, transparent 72%);
  -webkit-mask-image: radial-gradient(circle at 50% 28%, black 0%, transparent 72%);
  animation: gridpan 24s linear infinite;
}
.radar {
  position: absolute;
  left: 50%;
  top: 24%;
  width: 130vh;
  height: 130vh;
  translate: -50% -50%;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    rgba(34, 211, 238, 0.16) 0deg,
    rgba(34, 211, 238, 0) 42deg,
    rgba(34, 211, 238, 0) 360deg
  );
  mask-image: radial-gradient(circle, black 0%, black 38%, transparent 60%);
  -webkit-mask-image: radial-gradient(circle, black 0%, black 38%, transparent 60%);
  opacity: 0.6;
  animation: sweep 9s linear infinite;
}
.mote {
  position: absolute;
  border-radius: 50%;
  background: rgba(120, 220, 255, 0.85);
  box-shadow: 0 0 8px 1px rgba(34, 211, 238, 0.7);
  animation-name: float;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  opacity: 0.5;
}
.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(120% 80% at 50% 30%, transparent 55%, rgba(3, 6, 14, 0.7) 100%);
}

@keyframes drift1 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(6vw, 4vw) scale(1.08);
  }
}
@keyframes drift2 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(-5vw, 5vw) scale(1.1);
  }
}
@keyframes drift3 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(-4vw, -4vw) scale(1.06);
  }
}
@keyframes gridpan {
  to {
    background-position: 46px 46px;
  }
}
@keyframes sweep {
  to {
    transform: rotate(360deg);
  }
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.25;
  }
  50% {
    transform: translateY(-22px);
    opacity: 0.9;
  }
}
@media (prefers-reduced-motion: reduce) {
  .aurora,
  .grid,
  .radar,
  .mote {
    animation: none;
  }
}
</style>
