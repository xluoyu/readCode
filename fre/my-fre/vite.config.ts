import { defineConfig } from 'vite'
// import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [reactRefresh()]
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    target: 'es2020',
    format: 'esm'
  },
})
