import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    // Optimize for production
    minify: "terser",
    sourcemap: false,
    
    // Reduce chunk size warnings
    chunkSizeWarningLimit: 1000,
    
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/analytics'],
          'ui-vendor': ['framer-motion', 'lucide-react', 'react-hot-toast'],
        },
      },
    },
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'firebase/analytics',
      'framer-motion',
      'lucide-react',
      'react-hot-toast',
    ],
  },

  // Environment variables prefix
  envPrefix: 'VITE_',

  // Server configuration (for local dev)
  server: {
    port: 5173,
    host: true,
    open: true,
  },

  // Preview configuration
  preview: {
    port: 4173,
    host: true,
  },
});
