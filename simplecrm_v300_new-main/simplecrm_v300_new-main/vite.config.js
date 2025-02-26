import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import basicSsl from "@vitejs/plugin-basic-ssl";
import path from "path";
import { fileURLToPath } from "url";
import compression from "vite-plugin-compression2";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => ({
  envPrefix: "REACT_APP_",
  build: {
    outDir: "build",
  },
  plugins: [
    react(),
    mode === "development" && basicSsl(),
    compression({ algorithm: "brotliCompress" }),
  ],
  esbuild: {
    pure: mode === "production" ? ["console.log", "console.warn"] : [],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
