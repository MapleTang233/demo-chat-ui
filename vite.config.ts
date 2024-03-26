import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';
import { splitVendorChunkPlugin } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    cssCodeSplit: true,
    lib: {
      entry: 'src/main.tsx',
      name: 'tigergraphCopilot',
      formats: ['es', 'cjs', 'iife', 'umd'],
      fileName: 'tg-copilot',
    },
  },
  plugins: [svgr(), react(), splitVendorChunkPlugin()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  }
})
