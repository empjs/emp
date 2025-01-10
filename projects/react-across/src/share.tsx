import {reactAdapter} from '@empjs/share/adapter'
import empRuntime from '@empjs/share/runtime'
import {ip, mode, name} from './config'
export const remotes = [
  {
    name: 'c1700',
    entry: mode === 'development' ? `http://${ip}:1700/emp.js` : `${window.location.origin}/c1700/emp.js`,
  },
  {
    name: 'c1800',
    entry: mode === 'development' ? `http://${ip}:1800/emp.js` : `${window.location.origin}/c1800/emp.js`,
  },
]
empRuntime.init({
  shared: {...reactAdapter.getShared('EMP_ADAPTER_REACT')},
  name,
  remotes,
})

export default empRuntime
