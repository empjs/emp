/**
 * https://github.com/penjj/lightningcss-plugin-px-to-viewport
 * MIT License
 */
import type {CustomAtRules, Visitor} from 'lightningcss'

interface Options {
  designWidth: number
  minPixelValue: number
  excludeSelectors: {type: string; name: RegExp | string}[]
}

const baseOptions: Options = {
  designWidth: 320,
  minPixelValue: 1,
  excludeSelectors: [],
}

export function createExcludeFilter(excludes: Options['excludeSelectors']) {
  const isExclude = (testItem: {type: string; name?: string}) => {
    if (!testItem.name) {
      return false
    }

    for (const rule of excludes) {
      if (testItem.type === rule.type) {
        if (typeof rule.name === 'string' && rule.name === testItem.name) {
          return true
        }
        if (typeof rule.name === 'object' && rule.name.test(testItem.name)) {
          return true
        }
      }
    }
    return false
  }

  return isExclude
}
export type PxToVwOptions = Partial<Options>
export function createPxToVwVisitor(userOptions: PxToVwOptions = {}) {
  const options = Object.assign(baseOptions, userOptions)
  const isExclude = createExcludeFilter(options.excludeSelectors)

  let skipCurrentSelector = false

  return {
    Selector(selectors) {
      skipCurrentSelector = false
      for (const selector of selectors) {
        if (isExclude(selector)) {
          skipCurrentSelector = true
        }
      }
    },
    Length(length) {
      if (length.unit === 'px' && !skipCurrentSelector) {
        if (length.value > options.minPixelValue) {
          return {
            unit: 'vw',
            value: (length.value / options.designWidth) * 100,
          }
        }
      }
    },
  } satisfies Visitor<CustomAtRules>
}
export type PxToRemOptions = {
  rootValue?: number
  minPixelValue?: number
  excludeSelectors?: {type: string; name: RegExp | string}[]
  excludeUnit?: string
}
export function createPxToRemVisitor(options: PxToRemOptions = {}) {
  const op = Object.assign({rootValue: 16, excludeSelectors: [], minPixelValue: 1, excludeUnit: '-px'}, options)

  const isExclude = createExcludeFilter(op.excludeSelectors)
  let skipCurrentSelector = false
  let skipVal = false
  return {
    Selector(selectors) {
      skipCurrentSelector = false
      for (const selector of selectors) {
        if (isExclude(selector)) {
          skipCurrentSelector = true
        }
      }
    },
    Token: {
      dimension(token) {
        // console.log('dimension', token)
        if (token.unit === op.excludeUnit) {
          skipVal = true
          return {
            type: 'length',
            value: {
              unit: 'px',
              value: token.value,
            },
          }
        }
      },
    },
    Length(length) {
      console.log('length', length, skipVal)
      if (length.unit === 'px' && !skipCurrentSelector) {
        if (length.value > op.minPixelValue) {
          if (!skipVal) {
            return {
              unit: 'rem',
              value: length.value / op.rootValue,
            }
          } else {
            skipVal = false
            return {
              unit: 'px',
              value: length.value,
            }
          }
        }
      }
    },
  } satisfies Visitor<CustomAtRules>
}
