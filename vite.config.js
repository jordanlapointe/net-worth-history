import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue2";

export default defineConfig(async () => ({
  assetsInclude: ["**/*.scss"],
  build: {
    target: process.env.TAURI_PLATFORM == "windows" ? "chrome105" : "safari13",
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    sourcemap: !!process.env.TAURI_DEBUG,
  },
  clearScreen: false,
  envPrefix: ["VITE_", "TAURI_"],
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 1420,
    strictPort: true,
  },
}));
