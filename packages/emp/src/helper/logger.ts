import chalk from 'chalk'
import store from './store'
export type LoggerType = 'debug' | 'info' | 'warn' | 'error'
// const prefix = `[EMP]`

const logger = {
  info: (...args: any[]) => ['debug', 'info'].includes(store.config.logLevel) && console.log(...args),
  debug: (...args: any[]) => ['debug'].includes(store.config.logLevel) && console.log(...args),
  warn: (...args: any[]) => ['debug', 'info', 'warn'].includes(store.config.logLevel) && console.warn(...args),
  error: (...args: any[]) =>
    ['debug', 'info', 'warn', 'error'].includes(store.config.logLevel) && console.error(...args),
}
/**
 * begin logger
 * @param title
 * @returns
 */
export const logTitle = (title: string) =>
  console.log(`${chalk.cyan(`EMP v${store.empPkg.version}`)} ${chalk.green(title)} \n`)
/**
 * tag log
 * @param msg
 * @param tag
 */
type tagType = 'green' | 'blue' | 'yellow' | 'red'
const logTagStyle = (msg: any, c1: string, c2: string, w = '#ecf0f1') =>
  console.log(`${chalk.bgHex(w).hex(c1)(` EMP v${store.empPkg.version} `)}${chalk.hex(w).bgHex(c2)(` ${msg} `)}\n`)
export const logTag = (msg: string, tag: tagType = 'blue') => {
  switch (tag) {
    case 'green':
      logTagStyle(msg, '#27ae60', '#2ecc71')
      break
    case 'blue':
      logTagStyle(msg, '#2980b9', '#3498db')

      break
    case 'red':
      logTagStyle(msg, '#c0392b', '#e74c3c')
      break
    case 'yellow':
      logTagStyle(msg, '#f39c12', '#f1c40f')
      break
  }
}
export default logger
