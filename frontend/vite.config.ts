import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { mswDevServerPlugin } from './vite-plugin-msw'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const reactRoot = path.resolve(rootDir, 'node_modules/react')
const reactDomRoot = path.resolve(rootDir, 'node_modules/react-dom')

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
    // npm workspaces + legacy-peer-deps can hoist @tanstack/* to the repo root
    // while react stays under frontend/node_modules — pin React resolution.
    dedupe: ['react', 'react-dom'],
    alias: {
      react: reactRoot,
      'react-dom': reactDomRoot,
      'react/jsx-runtime': path.resolve(reactRoot, 'jsx-runtime.js'),
      'react/jsx-dev-runtime': path.resolve(reactRoot, 'jsx-dev-runtime.js'),
    },
  },
  plugins: [
    mswDevServerPlugin(),
    devtools(),
    tailwindcss(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    viteReact(),
  ],
  server: {
    port: 3000,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
})

export default config
