/**
 * Este arquivo contém utilitários e definições de tipos ou lógica TypeScript para a aplicação.
 * Comentários foram adicionados automaticamente para explicar as importações e declarações principais.
 */

import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
