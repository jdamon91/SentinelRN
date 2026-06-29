<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const props = withDefaults(defineProps<{ delay?: number; as?: string }>(), {
  delay: 0,
  as: "div",
});

const el = ref<HTMLElement | null>(null);
const visible = ref(false);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  // Respect reduced-motion and environments without IO: show immediately.
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (reduced || typeof IntersectionObserver === "undefined" || !el.value) {
    visible.value = true;
    return;
  }
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          visible.value = true;
          observer?.disconnect();
        }
      }
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
  );
  observer.observe(el.value);
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <component
    :is="props.as"
    ref="el"
    class="sn-reveal"
    :class="{ 'is-visible': visible }"
    :style="{ '--sn-reveal-delay': `${props.delay}ms` }"
  >
    <slot />
  </component>
</template>

<style scoped>
.sn-reveal {
  opacity: 0;
  transform: translateY(26px);
  transition:
    opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: var(--sn-reveal-delay, 0ms);
  will-change: opacity, transform;
}
.sn-reveal.is-visible {
  opacity: 1;
  transform: none;
}
@media (prefers-reduced-motion: reduce) {
  .sn-reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
