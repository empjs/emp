import {defineConfig} from 'tsup'

export default defineConfig(({watch}) => {
  const isDev = !!watch
  return {
    entry: ['src/index.ts', 'src/tailwindcss.ts'],
    format: ['esm', 'cjs'],
    splitting: false,
    sourcemap: isDev,
    minify: !isDev,
    clean: true,
    dts: true,
    shims: true,
    platform: 'node',
  }
})
