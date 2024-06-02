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
      '/products': {
        target: target,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/products/, '/products'),
      },
      '/order': {
        target: target,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/order/, '/order'),
      },
      '/payment': {
        target: target,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/payment/, '/payment'),
      },
      '/user': {
        target: target,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/user/, '/user'),
      },
      '/food': {
        target: target,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/food/, '/food'),
      },
      '/review': {
        target: target,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/review/, '/review'),
      },
    },
  },
  plugins: [react()],
});
