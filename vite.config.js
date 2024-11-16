import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src", // Ensures correct resolution of the @ alias to your src folder
    },
  },
  server: {
    port: 3000,
  },
});
