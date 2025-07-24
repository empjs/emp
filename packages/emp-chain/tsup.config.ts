import {defineConfig} from 'tsup'

export default defineConfig(({watch}) => {
  const isDev = !!watch
  return {
    entry: {index: 'src/Config.ts'},
    format: ['esm', 'cjs'],
    splitting: false,
    sourcemap: isDev,
    minify: !isDev,
    clean: true,
    dts: true,
    shims: true,
    banner: ({format}) => {
      if (format === 'esm') {
        return {
          js: `import {createRequire as __createRequire} from 'module';var require=__createRequire(import\.meta.url);`,
        }
      }
    },
    footer: ({format}) => {
      if (format === 'cjs') {
        return {
          js: `if (module.exports.default) module.exports = module.exports.default;`,
        }
      }
    },
  }
})
