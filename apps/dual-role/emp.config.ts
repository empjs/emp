import {defineConfig} from '@empjs/cli'
import {pluginRspackEmpShare} from '@empjs/share/rspack'

export default defineConfig(() => ({
  appSrc: 'src',
  appEntry: 'index.ts',
  plugins: [
    pluginRspackEmpShare({
      name: 'dualRole',
      exposes: {
        './Peer': './src/Peer',
      },
      dts: {
        generateTypes: true,
      },
      manifest: true,
    }),
  ],
  server: {
    port: 8201,
    open: false,
  },
  debug: {
    clearLog: false,
  },
}))
