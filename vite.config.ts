import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Bu base ayarı GitHub Pages için olmazsa olmazdır
  base: '/RouteMapper/',

  plugins: [react()],

  // optimizeDeps kısmı sadece development içindir, optional
  optimizeDeps: {
    exclude: ['lucide-react'], // Eğer lucide-react kullanıyorsan doğru
  },
});
