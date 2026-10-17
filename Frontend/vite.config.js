import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The backend only allows this exact origin (FRONTEND_URL) through CORS, so the port must not change.
  server: { port: 5173, strictPort: true },
});
