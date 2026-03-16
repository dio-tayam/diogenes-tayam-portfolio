import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/diogenes-tayam-portfolio/',
  plugins: [react()],
  esbuild: {
    loader: 'jsx',
  },
  css: {
    transformer: 'postcss',
  },
})