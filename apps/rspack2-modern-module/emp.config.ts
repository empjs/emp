import {defineConfig} from '@empjs/cli'

export default defineConfig(() => {
  return {
    appSrc: 'src',
    appEntry: 'index.ts',
    build: {
      useESM: true,
      target: 'es2018',
    },
    debug: {
      clearLog: false,
    },
  }
})
