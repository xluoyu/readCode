import pkg from './package.json'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript'
import sourceMaps from 'rollup-plugin-sourcemaps'

export default {
  index: './src/index.ts',
  plugins: [
    commonjs(),
    typescript({
      exclude: "node_modules/**",
      typescript: require("typescript")
    }),
    sourceMaps()
  ],
  output: [
    {
      format: "cjs",
      file: pkg.main,
      sourcemaps: true
    },
    {
      name: 'vue',
      format: "es",
      file: pkg.module,
      sourcemaps: true
    }
  ]
}