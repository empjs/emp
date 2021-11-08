import chalk from 'chalk'
import store from './store'
// const prefix = `[EMP]`
const logger = {
  info: (...args: any[]) => console.log(...args),
  debug: (...args: any[]) => console.log(...args),
  warn: (...args: any[]) => console.warn(...args),
  error: (...args: any[]) => console.error(...args),
}
export const logTitle = (title: string) =>
  console.log(`${chalk.cyan(`EMP v${store.pkgVersion}`)} ${chalk.green(title)} \n`)

export default logger
