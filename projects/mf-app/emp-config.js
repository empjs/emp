import {defineConfig} from '@empjs/cli'
import configCjs from '../mf-host/emp-cjs-config.js'

export default defineConfig(store => {
  const rs = configCjs(store)
  //
  rs.server.port = 8002
  //
  rs.empShare.name = 'mfApp'
  rs.empShare.remotes = {
    mfHost: 'mfHost@http://172.29.105.64:8001/emp.js',
  }
  return rs
})
