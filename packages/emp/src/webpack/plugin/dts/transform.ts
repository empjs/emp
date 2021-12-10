import ts from 'typescript'
import path from 'path'
import store from 'src/helper/store'
const globalImportRE =
  /(?:(?:import|export)\s?(?:type)?\s?(?:(?:\{[^;\n]+\})|(?:[^;\n]+))\s?from\s?['"][^;\n]+['"])|(?:import\(['"][^;\n]+?['"]\))/g
const staticImportRE = /(?:import|export)\s?(?:type)?\s?\{?.+\}?\s?from\s?['"](.+)['"]/
const dynamicImportRE = /import\(['"]([^;\n]+?)['"]\)/
const simpleStaticImportRE = /((?:import|export).+from\s?)['"](.+)['"]/
const simpleDynamicImportRE = /(import\()['"](.+)['"]\)/

export function transformPathImport(o: ts.OutputFile, libname?: string) {
  return o.text.replace(globalImportRE, str => {
    let matchResult = str.match(staticImportRE)
    let isDynamic = false

    if (!matchResult) {
      matchResult = str.match(dynamicImportRE)
      isDynamic = true
    }
    if (matchResult && matchResult[1]) {
      let rs = matchResult[1]
      // alias 路径处理
      if (!rs.startsWith('.')) {
        const alias = store.config.resolve.alias
        for (const [k, v] of Object.entries(alias)) {
          if (rs.startsWith(k)) {
            rs = rs.replace(`${k}/`, '')
            console.log('[rs]', rs, v)
            rs = path.join(v, rs)
            rs = rs.replace(store.appSrc, '.').replace('\\', '/')
            break
          }
        }
      }
      // 统一相对路径处理
      let filename = path.resolve(path.dirname(o.name), rs)
      filename = filename.split('\\').join('/').split(`/${store.config.build.typesOutDir}/`)[1]
      console.log(filename, rs)
      if (libname) {
        filename = filename.replace('src/', `${libname}/`)
      }
      return str.replace(matchResult[1], filename)
    }
    return str
  })
}
