import {defineConfig} from 'tsup'

export default defineConfig(({watch}) => {
  const isDev = !!watch
  return {
    entry: {
      index: 'src/index.ts',
      pxtovw: 'src/pxtovw.ts',
    },
    format: ['esm', 'cjs'],
    splitting: false,
    sourcemap: isDev,
    minify: !isDev,
    clean: true,
    dts: true,
    shims: true,
    external: ['./pxtovw.cjs'],
  }
})
