import {defineConfig} from 'tsup'

export default defineConfig(({watch}) => {
  const isDev = !!watch
  return {
    // entry: ['src/runtime/index.ts', 'src/sdk.ts', 'src/rspack.ts'],
    entry: {
      runtime: 'src/runtime.ts',
      sdk: 'src/sdk.ts',
      rspack: 'src/rspack.ts',
    },
    format: ['esm', 'cjs'],
    splitting: false,
    sourcemap: isDev,
    minify: !isDev,
    clean: true,
    dts: true,
    shims: true,
    // noExternal: ['@module-federation/manifest'],
  }
})
