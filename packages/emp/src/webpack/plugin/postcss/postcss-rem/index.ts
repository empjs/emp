import {convert} from './startijenn-rem'

const defaults = {
  name: 'rem',
  fallback: false,
  convert: 'rem',
  baseline: 16,
  precision: 5,
}

module.exports = (options = {}) => {
  const {name, fallback, convert: to, ...convertOptions} = {...defaults, ...options}
  const regexp = new RegExp('(?!\\W+)' + name + '\\(([^()]+)\\)', 'g')

  return {
    postcssPlugin: 'postcss-rem',
    Once(root: any) {
      if (fallback && to !== 'px') {
        root.walkDecls((decl: any) => {
          if (decl.value && decl.value.includes(name + '(')) {
            const values = decl.value.replace(regexp, '$1')
            decl.cloneBefore({
              value: convert(values, 'px', convertOptions),
            })
            decl.value = convert(values, 'rem', convertOptions)
          }
        })
      } else {
        root.replaceValues(regexp, {fast: name + '('}, (_: any, values: any) => convert(values, to, convertOptions))
      }
    },
  }
}

module.exports.postcss = true
