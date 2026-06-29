import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import MyLayout from "./MyLayout.vue";
import "./style.css";

// Extend the default VitePress theme but swap in a bespoke layout that renders
// a fully custom landing page on the home route (docs pages stay default).
export default {
  extends: DefaultTheme,
  Layout: MyLayout,
} satisfies Theme;
