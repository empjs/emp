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
export const logTag = (msg: string, tag: tagType = 'blue') => {
  switch (tag) {
    case 'green':
      console.log(chalk.hex('#ecf0f1').bgHex('#27ae60')(` EMP v${store.pkgVersion} `), chalk.hex('#2ecc71')(msg))
      break
    case 'blue':
      console.log(chalk.hex('#ecf0f1').bgHex('#2980b9')(` EMP v${store.pkgVersion} `), chalk.hex('#3498db')(msg))
      break
    case 'red':
      console.log(chalk.hex('#ecf0f1').bgHex('#c0392b')(` EMP v${store.pkgVersion} `), chalk.hex('#e74c3c')(msg))
      break
    case 'yellow':
      console.log(chalk.hex('#ecf0f1').bgHex('#f39c12')(` EMP v${store.pkgVersion} `), chalk.hex('#f1c40f')(msg))
      break
  }
}
export default logger
