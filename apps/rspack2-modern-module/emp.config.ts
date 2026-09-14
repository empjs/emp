import {defineConfig} from '@empjs/cli'

export default defineConfig(() => {
  return {
    appSrc: 'src',
    appEntry: 'index.ts',
    build: {
      targets: ['Chrome >= 80', 'Edge >= 80', 'Firefox >= 80', 'Safari >= 14'],
      format: 'esm',
    },
    debug: {
      clearLog: false,
    },
  }
})
