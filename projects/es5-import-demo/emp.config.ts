import {defineConfig} from '@empjs/cli'

export default defineConfig(store => {
  return {
    server: {
      open: false,
    },
    debug: {
      clearLog: false,
      // showRsconfig: 'log.json',
    },
  }
})
