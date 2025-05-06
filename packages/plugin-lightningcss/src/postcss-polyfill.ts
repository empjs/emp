import type {Visitor} from 'lightningcss'
import {type CustomAtRules, composeVisitors} from 'lightningcss'
// import type {PxToRemOptions, vwOptions} from './px-to-base.js'
// import {createPxToRemVisitor, createPxToVwVisitor} from './px-to-base.js'
import unitTramsform, {type remOptions, type vwOptions} from './unit-tramsform.js'

/**
 * // 插件编写 https://github.com/parcel-bundler/lightningcss/blob/master/node/test/visitor.test.mjs
 */
class PostcssConfig {
  /**
   * https://github.com/cuth/postcss-pxtorem
   */
  px_to_rem(op: remOptions = {}) {
    return composeVisitors([unitTramsform.pxToRem(op)])
  }
  pxtorem = this.px_to_rem
  pxtovw = this.px_to_viewport
  /**
   * https://github.com/evrone/postcss-px-to-viewport
   */
  px_to_viewport(op: vwOptions = {}) {
    return composeVisitors([unitTramsform.pxToVw(op)])
  }
  /**
   * https://www.npmjs.com/package/postcss-apply
   */
  apply(defined: Map<any, any>): Visitor<CustomAtRules> {
    defined = defined ? defined : new Map()
    return {
      Rule: {
        style(rule) {
          for (const selector of rule.value.selectors) {
            if (selector.length === 1 && selector[0].type === 'type' && selector[0].name.startsWith('--')) {
              defined.set(selector[0].name, rule.value.declarations)
              return {type: 'ignored', value: null}
            }
          }

          rule.value.rules = rule.value.rules.filter(child => {
            if (child.type === 'unknown' && child.value.name === 'apply') {
              for (const token of child.value.prelude) {
                if (token.type === 'dashed-ident' && defined.has(token.value)) {
                  const r = defined.get(token.value)
                  const decls = rule.value.declarations
                  decls.declarations.push(...r.declarations)
                  decls.importantDeclarations.push(...r.importantDeclarations)
                }
              }
              return false
            }
            return true
          })

          return rule
        },
      },
    }
  }
  /**
   * https://www.npmjs.com/package/postcss-prefix-selector
   */
  selector_prefix(): Visitor<CustomAtRules> {
    return {
      Selector(selector) {
        return [{type: 'class', name: 'prefix'}, {type: 'combinator', value: 'descendant'}, ...selector]
      },
    }
  }
  /**
   * https://www.npmjs.com/package/postcss-simple-vars
   */
  static_vars(declared: Map<any, any>): Visitor<CustomAtRules> {
    declared = declared ? declared : new Map()
    return {
      Rule: {
        unknown(rule: {name: any; prelude: any}) {
          declared.set(rule.name, rule.prelude)
          return []
        },
      },
      Token: {
        'at-keyword'(token) {
          if (declared.has(token.value)) {
            return declared.get(token.value)
          }
        },
      },
    }
  }
  /**
   * https://www.npmjs.com/package/postcss-url
   */
  url(hostUrl: string): Visitor<CustomAtRules> {
    return {
      Url(url) {
        url.url = hostUrl + url.url
        return url
      },
    }
  }
  /**
   * https://www.npmjs.com/package/postcss-env-function
   */
  specific_environment_variables(tokens: {[k: string]: any}): Visitor<CustomAtRules> {
    const ev: {[k: string]: any} = {}
    for (const key in tokens) {
      ev[key] = () => tokens[key]
    }
    return {
      EnvironmentVariable: ev,
    }
  }
  /**
   * https://www.npmjs.com/package/postcss-env-function
   */
  env_function(tokens: any): Visitor<CustomAtRules> {
    return {
      EnvironmentVariable(env) {
        if (env.name.type === 'custom') {
          return tokens[env.name.ident]
        }
      },
    }
  }
  /**
   * https://www.npmjs.com/package/@csstools/postcss-design-tokens
   */
  design_tokens(tokens: any): Visitor<CustomAtRules> {
    return {
      Function: {
        'design-token'(fn) {
          if (
            fn.arguments.length === 1 &&
            fn.arguments[0].type === 'token' &&
            fn.arguments[0].value.type === 'string'
          ) {
            return tokens[fn.arguments[0].value.value]
          }
        },
      },
    }
  }
  /**
   * https://github.com/csstools/custom-units
   */
  custom_units(): Visitor<CustomAtRules> {
    return {
      Token: {
        dimension(token) {
          if (token.unit.startsWith('--')) {
            return {
              type: 'function',
              value: {
                name: 'calc',
                arguments: [
                  {
                    type: 'token',
                    value: {
                      type: 'number',
                      value: token.value,
                    },
                  },
                  {
                    type: 'token',
                    value: {
                      type: 'delim',
                      value: '*',
                    },
                  },
                  {
                    type: 'var',
                    value: {
                      name: {
                        ident: token.unit,
                      },
                    },
                  },
                ],
              },
            }
          }
        },
      },
    }
  }
  /**
   * https://www.npmjs.com/package/postcss-property-lookup
   */
  property_lookup(): Visitor<CustomAtRules> {
    return {
      Rule: {
        style(rule: any) {
          const valuesByProperty = new Map()
          for (const decl of rule.value.declarations.declarations) {
            let name: any = decl.property
            if (decl.property === 'unparsed') {
              name = decl.value.propertyId.property
            }
            valuesByProperty.set(name, decl)
          }

          rule.value.declarations.declarations = rule.value.declarations.declarations.map((decl: any) => {
            // Only single value supported. Would need a way to convert parsed values to unparsed tokens otherwise.
            if (decl.property === 'unparsed' && decl.value.value.length === 1) {
              const token = decl.value.value[0]
              if (
                token.type === 'token' &&
                token.value.type === 'at-keyword' &&
                valuesByProperty.has(token.value.value)
              ) {
                const v = valuesByProperty.get(token.value.value)
                return {
                  /** @type any */
                  property: decl.value.propertyId.property,
                  value: v.value,
                }
              }
            }
            return decl
          })

          return rule
        },
      },
    }
  }
  /**
   * https://www.npmjs.com/package/postcss-focus-visible
   */
  focus_visible(): Visitor<CustomAtRules> {
    return {
      Rule: {
        style(rule) {
          let clone = null
          for (const selector of rule.value.selectors) {
            for (const [i, component] of selector.entries()) {
              if (component.type === 'pseudo-class' && component.kind === 'focus-visible') {
                if (clone == null) {
                  clone = [...rule.value.selectors.map(s => [...s])]
                }

                selector[i] = {type: 'class', name: 'focus-visible'}
              }
            }
          }

          if (clone) {
            return [rule, {type: 'style', value: {...rule.value, selectors: clone}}]
          }
        },
      },
    }
  }
  /**
   * https://github.com/postcss/postcss-dark-theme-class
   */
  dark_theme_class(): Visitor<CustomAtRules> {
    return {
      Rule: {
        media(rule: any) {
          const q = rule.value.query.mediaQueries[0]
          if (
            q.condition?.type === 'feature' &&
            q.condition.value.type === 'plain' &&
            q.condition.value.name === 'prefers-color-scheme' &&
            q.condition.value.value.value === 'dark'
          ) {
            const clonedRules = [rule]
            for (const r of rule.value.rules) {
              if (r.type === 'style') {
                const clonedSelectors = []
                for (const selector of r.value.selectors) {
                  clonedSelectors.push([
                    {type: 'type', name: 'html'},
                    {type: 'attribute', name: 'theme', operation: {operator: 'equal', value: 'dark'}},
                    {type: 'combinator', value: 'descendant'},
                    ...selector,
                  ])
                  selector.unshift(
                    {type: 'type', name: 'html'},
                    {
                      type: 'pseudo-class',
                      kind: 'not',
                      selectors: [[{type: 'attribute', name: 'theme', operation: {operator: 'equal', value: 'light'}}]],
                    },
                    {type: 'combinator', value: 'descendant'},
                  )
                }

                clonedRules.push({type: 'style', value: {...r.value, selectors: clonedSelectors}})
              }
            }

            return clonedRules
          }
        },
      },
    }
  }
  /**
   * https://github.com/postcss/postcss-100vh-fix
   */
  fix_100vh(): Visitor<CustomAtRules> {
    return {
      Rule: {
        style(style) {
          let cloned
          for (const property of style.value.declarations.declarations) {
            if (
              property.property === 'height' &&
              property.value.type === 'length-percentage' &&
              property.value.value.type === 'dimension' &&
              property.value.value.value.unit === 'vh' &&
              property.value.value.value.value === 100
            ) {
              if (!cloned) {
                cloned = structuredClone(style)
                cloned.value.declarations.declarations = []
              }
              cloned.value.declarations.declarations.push({
                ...property,
                value: {
                  type: 'stretch',
                  vendorPrefix: ['webkit'],
                },
              })
            }
          }

          if (cloned) {
            return [
              style,
              {
                type: 'supports',
                value: {
                  condition: {
                    type: 'declaration',
                    propertyId: {
                      property: '-webkit-touch-callout',
                    },
                    value: 'none',
                  },
                  loc: style.value.loc,
                  rules: [cloned],
                },
              },
            ]
          }
        },
      },
    }
  }
  /**
   * https://github.com/MohammadYounes/rtlcss
   */
  logical_transforms(): Visitor<CustomAtRules> {
    return {
      Rule: {
        style(style) {
          let cloned: any
          for (const property of style.value.declarations.declarations) {
            if (property.property === 'transform') {
              const clonedTransforms = property.value.map(transform => {
                if (transform.type !== 'translateX') {
                  return transform
                }

                if (!cloned) {
                  cloned = structuredClone(style)
                  cloned.value.declarations.declarations = []
                }

                let value
                switch (transform.value.type) {
                  case 'dimension':
                    value = {
                      type: 'dimension',
                      value: {unit: transform.value.value.unit, value: -transform.value.value.value},
                    }
                    break
                  case 'percentage':
                    value = {type: 'percentage', value: -transform.value.value}
                    break
                  case 'calc':
                    value = {type: 'calc', value: {type: 'product', value: [-1, transform.value.value]}}
                    break
                }

                return {
                  type: 'translateX',
                  value,
                }
              })

              if (cloned) {
                cloned.value.selectors.at(-1).push({type: 'pseudo-class', kind: 'dir', direction: 'rtl'})
                cloned.value.declarations.declarations.push({
                  ...property,
                  value: clonedTransforms,
                })
              }
            }
          }

          if (cloned) {
            return [style, cloned]
          }
        },
      },
    }
  }
  /**
   * https://github.com/twbs/mq4-hover-shim
   */
  hover_media_query(): Visitor<CustomAtRules> {
    return {
      Rule: {
        media(media) {
          const mediaQueries = media.value.query.mediaQueries
          if (
            mediaQueries.length === 1 &&
            mediaQueries[0].condition &&
            mediaQueries[0].condition.type === 'feature' &&
            mediaQueries[0].condition.value.type === 'boolean' &&
            mediaQueries[0].condition.value.name === 'hover'
          ) {
            for (const rule of media.value.rules) {
              if (rule.type === 'style') {
                for (const selector of rule.value.selectors) {
                  selector.unshift({type: 'class', name: 'hoverable'}, {type: 'combinator', value: 'descendant'})
                }
              }
            }
            return media.value.rules
          }
        },
      },
    }
  }
  /**
   * https://github.com/yunusga/postcss-momentum-scrolling
   */
  momentum_scrolling(visitOverflow: any): Visitor<CustomAtRules> {
    return {
      Declaration: {
        overflow: visitOverflow,
        'overflow-x': visitOverflow,
        'overflow-y': visitOverflow,
      },
    }
  }
  /**
   * https://github.com/postcss/postcss-size
   */
  size(): any {
    return {
      Declaration: {
        custom: {
          size(property: any) {
            if (property.value[0].type === 'length') {
              /** @type {import('../ast').Size} */
              const value = {type: 'length-percentage', value: {type: 'dimension', value: property.value[0].value}}
              return [
                {property: 'width', value},
                {property: 'height', value},
              ]
            }
          },
        },
      },
    }
  }
}
export default new PostcssConfig()
