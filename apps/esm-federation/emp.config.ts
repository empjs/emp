import {defineConfig} from '@empjs/cli'
import {pluginRspackEmpShare} from '@empjs/share/rspack'

export default defineConfig(() => ({
  appSrc: 'src',
  appEntry: 'index.ts',
  plugins: [
    pluginRspackEmpShare({
      name: 'esmFederation',
      filename: 'esm-entry.js',
      library: {type: 'module'},
      exposes: {
        './Message': './src/remote-message',
      },
      manifest: true,
    }),
  ],
  build: {
    minify: false,
    target: 'es2018',
  },
  chain(config) {
    config.set('experiments', {outputModule: true})
    config.output.set('module', true).set('chunkFormat', 'module').set('chunkLoading', 'import')
  },
  server: {
    port: 8103,
    open: false,
  },
  debug: {
    clearLog: false,
  },
}))
