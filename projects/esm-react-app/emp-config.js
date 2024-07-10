import {defineConfig} from '@empjs/cli'
import config from '../esm-react-host/emp-esm-config.js'
//
const deploy = process.env.DEPLOY
const isCf = deploy === 'cloudflare'
//
export default defineConfig(store => {
  const rs = config(store)
  const ip = store.getLanIp()
  const remoteEmp = isCf ? 'https://mf-esm.sc.empjs.dev/host/emp.js' : `http://${ip}:3301/emp.js`
  //
  rs.server.port = 3302
  rs.html.template = 'src/index.html'
  rs.empShare.name = `esmReactApp`
  rs.empShare.remotes.esmReactHost = `esmReactHost@${remoteEmp}`
  return rs
})
