import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/sapporo-metal/" : "/",
  css: {
    devSourcemap: true,
  },
  build: {
    outDir: "docs",
  },
});
