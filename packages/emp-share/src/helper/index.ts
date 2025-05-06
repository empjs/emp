export const importJsVm = (content: string) => `data:text/javascript,${content}`

export function deepAssign<T>(target: any, ...sources: any): T {
  for (const source of sources) {
    for (const k in source) {
      const vs = source[k],
        vt = target[k]
      if (Object(vs) == vs && Object(vt) === vt) {
        target[k] = deepAssign(vt, vs)
        continue
      }
      target[k] = source[k]
    }
  }
  return target
}

export const checkVersion = (version: string) => (version ? Number(version.split('.')[0]) : 0)
export const isPromise = (p: any) => p && Object.prototype.toString.call(p) === '[object Promise]'

//
export const isDev = process.env.EMPSHARE_ENV === 'dev'
export const log = isDev ? console.log.bind(console, '[EMP Share]') : () => {}
