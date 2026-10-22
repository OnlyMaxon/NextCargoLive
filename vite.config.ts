import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        // Весь бандл был одним чанком на 1 МБ. Разбивка по редко меняющимся
        // вендорам даёт долгоживущий кэш; админка грузится отдельно через
        // React.lazy в App.tsx.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('/firebase/') || id.includes('/@firebase/')) return 'firebase'
          if (id.includes('/react-dom/') || id.includes('/scheduler/')) return 'react-dom'
          if (id.includes('/@phosphor-icons/') || id.includes('/lucide-react/')) return 'icons'
          if (id.includes('/@radix-ui/') || id.includes('/cmdk/') || id.includes('/sonner/')) return 'ui'
          return 'vendor'
        },
      },
    },
  },
});
