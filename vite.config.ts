import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import type imagemin from "imagemin";
import viteImagemin from "@vheemstra/vite-plugin-imagemin";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminPngquant from "imagemin-pngquant";
import imageminWebp from "imagemin-webp";
import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Optimize images during build
    viteImagemin({
      plugins: {
        jpg: imageminMozjpeg({
          quality: 80, // Good balance between quality and size
          progressive: true,
        }),
        png: imageminPngquant({
          quality: [0.7, 0.85],
          speed: 4,
        }) as unknown as imagemin.Plugin,
      },
      makeWebp: {
        plugins: {
          jpg: imageminWebp({
            quality: 80,
          }),
          png: imageminWebp({
            quality: 80,
            lossless: false,
          }),
        },
        formatFilePath: (path) => path.replace(/\.(jpg|png)$/, ".webp"),
      },
    }),
    // Gzip compression for all assets
    viteCompression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 10240, // Only compress files larger than 10KB
    }),
    // Brotli compression (better compression than gzip)
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br",
      threshold: 10240,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Vite uses esbuild for minification by default (fastest).
    // target: "es2020" enables modern syntax (smaller output).
    target: "es2020",
    minify: "esbuild",
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          gsap: ["gsap"],
          i18n: ["i18next", "react-i18next"],
        },
      },
    },
  },
});
