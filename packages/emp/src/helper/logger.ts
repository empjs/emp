import chalk from 'chalk'
import store from './store'
// const prefix = `[EMP]`
const prefix = ''
const logger = {
  info: (...args: any[]) => console.log(prefix, ...args),
  debug: (...args: any[]) => console.log(prefix, ...args),
  warn: (...args: any[]) => console.warn(prefix, ...args),
  error: (...args: any[]) => console.error(prefix, ...args),
}
export const logTitle = (title: string) =>
  console.log(`${chalk.cyan(`EMP v${store.pkgVersion}`)} ${chalk.green(title)} \n`)

export default logger
