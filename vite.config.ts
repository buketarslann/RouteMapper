import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/RouteMapper/',  // <-- GitHub repo adını buraya ekledim!
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
