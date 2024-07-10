import {defineConfig} from '@empjs/cli'
import configCjs from './emp-cjs-config.js'

export default defineConfig(store => {
  const rs = configCjs(store)
  rs.chain = config => {
    config.module
      .rule('sass')
      .use('sassLoader')
      .tap(options => {
        // console.log(`#options#:`, options)
        return {
          ...options,
          additionalData: `@import '~@/css/mixin';`,
        }
      })
  }
  //
  rs.empShare.exposes = {
    './App': './src/App',
    './CountComp': './src/CountComp',
  }
  rs.server.open = false

  return rs
})
