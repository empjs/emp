import {atRule} from 'postcss'
import {getUnitRegexp} from './px-to-vw/pixel-unit-regexp'
import {createPropListMatcher} from './px-to-vw/prop-list-matcher'

const defaults = {
  unitToConvert: 'px',
  viewportWidth: 320,
  viewportHeight: 568, // not now used; TODO: need for different units and math for different properties
  unitPrecision: 5,
  viewportUnit: 'vw',
  fontViewportUnit: 'vw', // vmin is more suitable.
  selectorBlackList: [],
  propList: ['*'],
  minPixelValue: 1,
  mediaQuery: false,
  replace: true,
  landscape: false,
  landscapeUnit: 'vw',
  landscapeWidth: 568,
}

export default (options: any) => {
  const opts = Object.assign({}, defaults, options)

  const pxRegex = getUnitRegexp(opts.unitToConvert)
  const satisfyPropList = createPropListMatcher(opts.propList)
  const landscapeRules: any[] = []

  return {
    postcssPlugin: 'postcss-px-to-viewport',
    Once(css: any) {
      css.walkRules(function (rule: {
        source: {input: {file: any}}
        selector: any
        parent: {params: any}
        clone: any
        walkDecls: any
      }) {
        // Add exclude option to ignore some files like 'node_modules'
        const file = rule.source && rule.source.input.file

        if (opts.exclude && file) {
          if (Object.prototype.toString.call(opts.exclude) === '[object RegExp]') {
            if (isExclude(opts.exclude, file)) return
          } else if (Object.prototype.toString.call(opts.exclude) === '[object Array]') {
            for (let i = 0; i < opts.exclude.length; i++) {
              if (isExclude(opts.exclude[i], file)) return
            }
          } else {
            throw new Error('options.exclude should be RegExp or Array.')
          }
        }

        if (blacklistedSelector(opts.selectorBlackList, rule.selector)) return

        if (opts.landscape && !rule.parent.params) {
          const landscapeRule = rule.clone().removeAll()

          rule.walkDecls(function (decl: any) {
            if (decl.value.indexOf(opts.unitToConvert) === -1) return
            if (!satisfyPropList(decl.prop)) return

            landscapeRule.append(
              decl.clone({
                value: decl.value.replace(pxRegex, createPxReplace(opts, opts.landscapeUnit, opts.landscapeWidth)),
              }),
            )
          })

          if (landscapeRule.nodes.length > 0) {
            landscapeRules.push(landscapeRule)
          }
        }

        if (!validateParams(rule.parent.params, opts.mediaQuery)) return

        rule.walkDecls(function (decl: any, i: any) {
          if (decl.value.indexOf(opts.unitToConvert) === -1) return
          if (!satisfyPropList(decl.prop)) return

          let unit
          let size
          const params = rule.parent.params

          if (opts.landscape && params && params.indexOf('landscape') !== -1) {
            unit = opts.landscapeUnit
            size = opts.landscapeWidth
          } else {
            unit = getUnit(decl.prop, opts)
            size = opts.viewportWidth
          }

          const value = decl.value.replace(pxRegex, createPxReplace(opts, unit, size))

          if (declarationExists(decl.parent, decl.prop, value)) return

          if (opts.replace) {
            decl.value = value
          } else {
            decl.parent.insertAfter(i, decl.clone({value: value}))
          }
        })
      })

      if (landscapeRules.length > 0) {
        const landscapeRoot = atRule({
          params: '(orientation: landscape)',
          name: 'media',
        })

        landscapeRules.forEach(function (rule) {
          landscapeRoot.append(rule)
        })
        css.append(landscapeRoot)
      }
    },
  }
}

function getUnit(prop: string | string[], opts: {viewportUnit: any; fontViewportUnit: any}) {
  return prop.indexOf('font') === -1 ? opts.viewportUnit : opts.fontViewportUnit
}

function createPxReplace(
  opts: {minPixelValue: number; unitPrecision: any},
  viewportUnit: number,
  viewportSize: number,
) {
  return function (m: any, $1: string) {
    if (!$1) return m
    const pixels = Number.parseFloat($1)
    if (pixels <= opts.minPixelValue) return m
    const parsedVal = toFixed((pixels / viewportSize) * 100, opts.unitPrecision)
    return parsedVal === 0 ? '0' : parsedVal + viewportUnit
  }
}

function toFixed(number: number, precision: number) {
  const multiplier = 10 ** (precision + 1),
    wholeNumber = Math.floor(number * multiplier)
  return (Math.round(wholeNumber / 10) * 10) / multiplier
}

function blacklistedSelector(blacklist: any[], selector: string) {
  if (typeof selector !== 'string') return
  return blacklist.some(function (regex: string) {
    if (typeof regex === 'string') return selector.indexOf(regex) !== -1
    return selector.match(regex)
  })
}

function isExclude(reg: any, file: {match: (arg0: any) => null}) {
  if (Object.prototype.toString.call(reg) !== '[object RegExp]') {
    throw new Error('options.exclude should be RegExp.')
  }
  return file.match(reg) !== null
}

function declarationExists(decls: any[], prop: any, value: any) {
  return decls.some(function (decl: {prop: any; value: any}) {
    return decl.prop === prop && decl.value === value
  })
}

function validateParams(params: any, mediaQuery: any) {
  return !params || (params && mediaQuery)
}
