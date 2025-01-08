import {reactAdapter} from '@empjs/share/adapter'
import empRuntime from '@empjs/share/runtime'
export const ip = process.env.ip as string
export const port = process.env.port as string
export const name = process.env.name as string
export const entry = `http://${ip}:${port}/emp.js`
empRuntime.init({
  shared: {...reactAdapter.shared},
  name,
  remotes: [
    {
      name,
      entry,
    },
  ],
})

export default empRuntime
