import chalk from 'chalk'
import store from './store'
export type LoggerType = 'debug' | 'info' | 'warn' | 'error'
// const prefix = `[EMP]`

const logger = {
  info: (...args: any[]) => ['debug', 'info'].includes(store.config.debug.level) && console.log(...args),
  debug: (...args: any[]) => ['debug'].includes(store.config.debug.level) && console.log(...args),
  warn: (...args: any[]) => ['debug', 'info', 'warn'].includes(store.config.debug.level) && console.warn(...args),
  error: (...args: any[]) =>
    ['debug', 'info', 'warn', 'error'].includes(store.config.debug.level) && console.error(...args),
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
type tagType = 'green' | 'blue' | 'yellow' | 'red' | 'purple' | 'black'
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
    case 'purple':
      logTagStyle(msg, '#8e44ad', '#9b59b6')
      break
    case 'black':
      logTagStyle(msg, '#2c3e50', '#34495e')
      break
  }
}
export default logger
