const length = 30
export const serialize = (obj: {new (...args: any[]): any} | Record<string, any>) => {
  const dest = typeof obj === 'function' ? obj.prototype : obj
  return `${obj.name ? `${obj.name}_` : ''}${Object.keys(dest).sort().join('_').substr(0, length)}`
}
