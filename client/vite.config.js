import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const target = 'http://localhost:8080';

export default defineConfig({
  server: {
    proxy: {
      '/auth': {
        target: target,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/auth/, '/auth'),
      },
      '/user': {
        target: target,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/user/, '/user'),
      },
      '/products': {
        target: target,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/products/, '/products'),
      },
      '/orders': {
        target: target,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/orders/, '/orders'),
      },
      '/foods': {
        target: target,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/foods/, '/foods'),
      },
      '/reviews': {
        target: target,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/reviews/, '/reviews'),
      },
    },
  },
  plugins: [react()],
});
