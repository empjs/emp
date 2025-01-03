import {reactAdapter} from '@empjs/share/adapter'
import empRuntime from '@empjs/share/runtime'
import {ip, mode, name} from './config'
export const remotes = [
  {
    name: 'c2100',
    entry: mode === 'development' ? `http://${ip}:2100/emp.js` : `${window.location.origin}/c2100/emp.js`,
  },
  {
    name: 'c2200',
    entry: mode === 'development' ? `http://${ip}:2200/emp.js` : `${window.location.origin}/c2200/emp.js`,
  },
]
empRuntime.init({
  shared: {...reactAdapter.shared},
  name,
  remotes,
})

export default empRuntime
