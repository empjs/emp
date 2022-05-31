import {defineConfig} from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [/@babel/, 'react-refresh/babel', 'babel-plugin-import', 'babel-loader', /@efox/, /@swc/],
})
