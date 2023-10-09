import type { LibraryFormats} from 'vite';
import { defineConfig } from 'vite'
import { resolve } from 'path'
import dtsPlugin from 'vite-plugin-dts'

export default defineConfig(() => ({
  plugins: [dtsPlugin()],
  build: {
    sourcemap: true,
    rollupOptions: {
      external: ['pinia', 'vue']
    },
    lib: {
      name: 'pinia-performance-markers',
      fileName: 'index',
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'] as LibraryFormats[]
    }
  }
}))
