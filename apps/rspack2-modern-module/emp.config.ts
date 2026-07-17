import {defineConfig} from '@empjs/cli'

export default defineConfig(() => {
  return {
    appSrc: 'src',
    appEntry: 'index.ts',
    build: {
      preset: 'modern',
    },
    debug: {
      clearLog: false,
    },
  }
})
