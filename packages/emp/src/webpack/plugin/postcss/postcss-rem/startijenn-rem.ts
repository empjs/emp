/**
 * code from https://github.com/pierreburel/startijenn-rem/blob/main/index.js
 */
const defaults = {
  baseline: 16,
  precision: 5,
}

const rounded = (value: number, precision: number) => {
  precision = Math.pow(10, precision)
  return Math.floor(value * precision) / precision
}

const convert = (value: any, to: any = 'rem', options: any = {}): any => {
  const {baseline, precision}: any = {...defaults, ...options}

  // Number
  if (typeof value === 'number') {
    if (to === 'px') {
      return rounded(value * parseFloat(baseline), precision) + to
    }

    return rounded(value / parseFloat(baseline), precision) + to
  }

  // Array
  if (Array.isArray(value)) {
    return value.map(val => convert(val, to, options))
  }

  // Object
  if (typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, convert(val, to, options)]))
  }

  // String
  return value.replace(/(\d*\.?\d+)(rem|px)/g, (match: any, val: string, from: string) => {
    if (from === 'px' && (to === 'rem' || to === 'em')) {
      return convert(parseFloat(val), to, options)
    }

    if (from === 'rem' && to === 'px') {
      return convert(parseFloat(val), to, options)
    }

    return match
  })
}

const rem = (value: any, options: any) => convert(value, 'rem', options)

const em = (value: any, baseline: any, options: any) => convert(value, 'em', {baseline, ...options})

const px = (value: any, options: any) => convert(value, 'px', options)

export default rem
export {convert, em, px, rem}
