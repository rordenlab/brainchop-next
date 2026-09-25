import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // relative, so the build works under a GitHub Pages /repo/ path or a custom domain
  build: { target: 'esnext' },
  worker: { format: 'es' },
  // esbuild's dev prebundler breaks their `new Worker(new URL(...))` workers.
  optimizeDeps: { exclude: ['@niivue/niimath', '@niivue/nv-ext-dcm2niix', '@niivue/dcm2niix', '@brainchop/mindgrab'] },
})
