import ts from 'typescript'
import path from 'path'
import store from 'src/helper/store'
const globalImportRE =
  /(?:(?:import|export)\s?(?:type)?\s?(?:(?:\{[^;\n]+\})|(?:[^;\n]+))\s?from\s?['"][^;\n]+['"])|(?:import\(['"][^;\n]+?['"]\))/g
const staticImportRE = /(?:import|export)\s?(?:type)?\s?\{?.+\}?\s?from\s?['"](.+)['"]/
const dynamicImportRE = /import\(['"]([^;\n]+?)['"]\)/
// const simpleStaticImportRE = /((?:import|export).+from\s?)['"](.+)['"]/
// const simpleDynamicImportRE = /(import\()['"](.+)['"]\)/
export const transformLibName = (name: string, code: string) => {
  //
  code = code.replace(`declare module '${store.config.appSrc}'`, `declare module '${name}'`)
  // 兼容 不支持 replace all 的情况
  const reg = new RegExp(`${store.config.appSrc}/`, 'g')
  return code.replace(reg, `${name}/`)
  // return code.replaceAll(`${store.config.appSrc}/`, `${name}/`)
}
export const transformPathImport = (o: ts.OutputFile) => {
  return o.text.replace(globalImportRE, str => {
    let matchResult = str.match(staticImportRE)

    if (!matchResult) {
      matchResult = str.match(dynamicImportRE)
    }
    if (matchResult && matchResult[1]) {
      let rs = matchResult[1]
      // alias
      if (!rs.startsWith('.')) {
        const alias = store.config.resolve.alias
        let isInAlias = false
        for (const [k, v] of Object.entries(alias)) {
          if (rs.startsWith(`${k}/`)) {
            rs = rs.replace(`${k}/`, '')
            rs = path.join(v, rs)
            // change to relative path
            rs = rs.replace(store.appSrc, '.').replace('\\', '/')
            isInAlias = true
            break
          }
        }
        // deps
        if (!isInAlias) {
          return str
        }
      }
      // relative path
      let filename = path.resolve(path.dirname(o.name), rs)
      filename = filename.split('\\').join('/').split(`/${store.config.build.typesOutDir}/`)[1]
      return str.replace(matchResult[1], filename)
    }
    return str
  })
}
