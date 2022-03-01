declare const logger: {
  error: {
    (...data: any[]): void
    (...data: any[]): void
    (message?: any, ...optionalParams: any[]): void
  }
  warnning: {
    (...data: any[]): void
    (...data: any[]): void
    (message?: any, ...optionalParams: any[]): void
  }
  info: {
    (...data: any[]): void
    (...data: any[]): void
    (message?: any, ...optionalParams: any[]): void
  }
}
export default logger
