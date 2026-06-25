import {defineConfig} from '@empjs/cli'

export default defineConfig(() => ({
  chain(config) {
    config.performance.hints('warning').maxAssetSize(512 * 1024)
  },
  server: {
    open: false,
  },
}))
