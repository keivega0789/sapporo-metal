import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/sapporo-metal/" : "/",
  css: {
    devSourcemap: true,
  },
  build: {
    outDir: "docs",
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, "index.html"),
        company: path.resolve(__dirname, "company.html"),
      },
    },
  },
  server: {
    open: true,
    host: true,
  },
});
