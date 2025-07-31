import color from 'src/helper/color'
export type LoggerType = 'debug' | 'info' | 'warn' | 'error'
export {color}
//
export class Logger {
  public brandName = ''
  public fullName = ''
  public logLevel = 'debug'
  public isLogTime = process.env.ENV === 'dev'
  setup({brandName, logLevel, fullName}: any) {
    //` EMP v${store.empPkg.version} `
    this.brandName = ` [${brandName}] `
    //
    this.fullName = ` ${fullName} `
    this.fullName = color.green.bold(this.fullName)
    //
    if (logLevel) this.logLevel = logLevel
  }
  time = (...args: any[]) => this.isLogTime && console.time(...args)
  timeEnd = (...args: any[]) => this.isLogTime && console.timeEnd(...args)
  debug = (...args: any[]) => ['debug'].includes(this.logLevel) && console.log(...args)
  info = (...args: any[]) => ['debug', 'info'].includes(this.logLevel) && console.log(...args)
  warn = (...args: any[]) => ['debug', 'info', 'warn'].includes(this.logLevel) && console.warn(...args)
  error = (...args: any[]) => ['debug', 'info', 'warn', 'error'].includes(this.logLevel) && console.error(...args)
  blue = (msg: string) => {
    console.log(`${color.lightBlue(this.brandName)}${color.blue(` ${msg} `)}\n`)
  }
  cyan = (msg: string) => {
    console.log(`${color.lightCyan(this.brandName)}${color.cyan(` ${msg} `)}\n`)
  }

  magenta = (msg: string) => {
    console.log(`${color.lightMagenta(this.brandName)}${color.magenta(` ${msg} `)}\n`)
  }

  green = (msg: string) => {
    console.log(`${color.lightGreen(this.brandName)}${color.green(` ${msg} `)}\n`)
  }

  yellow = (msg: string) => {
    console.log(`${color.yellow(this.brandName)}${color.orange(` ${msg} `)}\n`)
  }
  red = (msg: string) => {
    console.log(`${color.lightRed(this.brandName)}${color.red(` ${msg} `)}\n`)
  }
  sysError = (msg: string) => {
    console.log(`${color.lightRed(` System Error Tips `)}${color.red(` ${msg} `)}\n`)
  }
  //
  link = (msg: string) => {
    return color.blue(msg)
  }
  title = (msg: string) => {
    console.log(`${this.fullName}${color.yellow.underline(`${msg}`)}\n`)
  }
}

export default new Logger()
