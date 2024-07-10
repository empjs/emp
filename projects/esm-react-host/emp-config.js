import {defineConfig} from '@empjs/cli'
import config from './emp-esm-config.js'
export default defineConfig(store => {
  return config(store)
})
