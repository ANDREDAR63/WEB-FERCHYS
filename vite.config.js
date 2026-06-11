import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/WEB-FERCHYS/', // Esto es lo que le dice a Vite dónde buscar los archivos
})
