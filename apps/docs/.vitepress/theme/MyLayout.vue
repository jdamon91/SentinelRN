<script setup lang="ts">
import { useData } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { computed } from "vue";
import Landing from "./Landing.vue";

const { Layout } = DefaultTheme;
const { frontmatter } = useData();

// Pages opt into the custom landing with `home: true` in their frontmatter.
const isLanding = computed(() => frontmatter.value.home === true);
</script>

<template>
  <Landing v-if="isLanding" />
  <Layout v-else />
</template>
