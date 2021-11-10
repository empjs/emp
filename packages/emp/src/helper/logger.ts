import chalk from 'chalk'
import store from './store'
// const prefix = `[EMP]`
const logger = {
  info: (...args: any[]) => console.log(...args),
  debug: (...args: any[]) => console.log(...args),
  warn: (...args: any[]) => console.warn(...args),
  error: (...args: any[]) => console.error(...args),
}
/**
 * begin logger
 * @param title
 * @returns
 */
export const logTitle = (title: string) =>
  console.log(`${chalk.cyan(`EMP v${store.pkgVersion}`)} ${chalk.green(title)} \n`)
/**
 * tag log
 * @param msg
 * @param tag
 */
type tagType = 'green' | 'blue' | 'yellow' | 'red'
const logTagStyle = (msg: any, c1: string, c2: string, w = '#ecf0f1') =>
  console.log(`${chalk.bgHex(w).hex(c1)(` EMP v${store.pkgVersion} `)}${chalk.hex(w).bgHex(c2)(` ${msg} `)}\n`)
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
