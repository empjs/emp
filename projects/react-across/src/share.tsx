import {reactAdapter} from '@empjs/share/adapter'
import empRuntime from '@empjs/share/runtime'
export const ip = process.env.ip as string
export const port = process.env.port as string
export const name = `reactCross_${port}`
export const remoteName = `reactCross_component`
export const remoteEntry = `http://${ip}:${port}/emp.js`
empRuntime.init({
  shared: {...reactAdapter.shared},
  name,
  remotes: [
    {
      name: 'c2100',
      entry: `http://${ip}:2100/emp.js`,
    },
    {
      name: 'c2200',
      entry: `http://${ip}:2200/emp.js`,
    },
  ],
})

export default empRuntime
