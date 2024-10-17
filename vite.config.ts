import { defineConfig } from 'vite'
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      react(),
      TanStackRouterVite(),
  ],
  server: {
      proxy: {
          "/api/v1": {
              target: "http://127.0.0.1:8080",
              changeOrigin: true,
              secure: false,
          },
      },
  },
})
