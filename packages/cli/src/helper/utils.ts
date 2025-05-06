import {ip} from 'address'
import chalk from 'chalk'
import {gateway4sync} from 'default-gateway'
import fs from 'fs-extra'
export const getLanIp = () => {
  const defaultIp = '127.0.0.1'
  try {
    const {int} = gateway4sync()
    return ip(int || '') || defaultIp
  } catch (e) {
    return defaultIp
  }
}
//
export const getPkgVersion = (pkgPath: string) => {
  try {
    const {version} = fs.readJSONSync(pkgPath)
    return version
  } catch (err) {
    return undefined
  }
}
export function clearConsole() {
  process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H')
}

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

export const ensureArray = <T>(params: T | T[]): T[] => {
  if (Array.isArray(params)) {
    return params
  }
  return [params]
}
/**
 * json Filter
 * @param d
 * @param keys
 * @returns
 */
export const jsonFilter = (d: any = {}, notIncludeKeys: string[] = []) =>
  Object.keys(d)
    .filter(key => !notIncludeKeys.includes(key))
    .reduce((o: any, key: string) => {
      o[key] = d[key]
      return o
    }, {})

export const vCompare = (preVersion = '', lastVersion = ''): number => {
  const sources = preVersion.replace('^', '').split('.')
  const dests = lastVersion.replace('^', '').split('.')
  const maxL = Math.max(sources.length, dests.length)
  let result = 0
  for (let i = 0; i < maxL; i++) {
    const preValue: any = sources.length > i ? sources[i] : 0
    const preNum = isNaN(Number(preValue)) ? preValue.charCodeAt() : Number(preValue)
    const lastValue: any = dests.length > i ? dests[i] : 0
    const lastNum = isNaN(Number(lastValue)) ? lastValue.charCodeAt() : Number(lastValue)
    if (preNum < lastNum) {
      result = -1
      break
    } else if (preNum > lastNum) {
      result = 1
      break
    }
  }
  return result
}

export const timeFormat = (seconds: number) => {
  seconds = seconds / 1000
  const format = (time: string) => chalk.bold(time)
  if (seconds < 1) {
    return `${seconds * 1000} ms`
  }
  if (seconds < 10) {
    const digits = seconds >= 0.01 ? 2 : 3
    return `${format(seconds.toFixed(digits))} s`
  }

  if (seconds < 60) {
    return `${format(seconds.toFixed(1))} s`
  }

  const minutes = seconds / 60
  return `${format(minutes.toFixed(2))} m`
}

export const importJsVm = (content: string) => `data:text/javascript,${content}`
