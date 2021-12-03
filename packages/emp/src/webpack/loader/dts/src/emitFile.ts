import webpack from 'webpack'
import ts from 'typescript'
import fs from 'fs-extra'
import {LoaderOptions} from '../index'
import path from 'path'

/**
 * 结果缓存
 */
const caches = {
  entireDts: '',
}

/**
 * 写入文件
 * 想清空目标目录，再新建目标目录和文件
 * @param filePath
 * @param fileName
 * @param data
 */
function writeDtsFile(filePath: string, fileName: string, data: string) {
  const dtsEntryPath = path.resolve(filePath, fileName)
  fs.removeSync(filePath)
  fs.ensureDirSync(filePath)
  fs.writeFileSync(dtsEntryPath, data, 'utf8')
}

/**
 * 包裹出 declare 表达式块
 * @param name 项目名
 * @param module 模块路径
 * @param text 声明内容
 * @returns
 */
function warpDeclareModule(name: string, module: string, text: string) {
  return `declare module '${name}${module.replace('.', '')}' {\r\n${text}}\r\n`
}

/**
 * 根据 Typescript Service 编译结果和 expose 产出文件
 * @param context
 * @param languageService
 * @param loaderOptions
 */
function emitFile(
  context: webpack.LoaderContext<Partial<LoaderOptions>>,
  languageService: ts.LanguageService,
  loaderOptions: LoaderOptions,
) {
  const fileName = context.resourcePath
  try {
    const output = languageService.getEmitOutput(fileName)
    // console.log('output', output)
    if (!output.emitSkipped) {
      output.outputFiles.forEach(o => {
        if (o.name.endsWith('.d.ts')) {
          if (loaderOptions.exposes && JSON.stringify(loaderOptions.exposes) !== '{}' && !!loaderOptions.name) {
            // 遍历 exposes 的声明结果
            for (const [key, value] of Object.entries(loaderOptions.exposes)) {
              if (key && value) {
                context.resolve(context.rootContext, value, (err, inputFilePath) => {
                  if (err) {
                    console.error(err)
                    return
                  }
                  // expose 对应的文件路径和 TS 编译结果路径是否相等
                  if (inputFilePath === fileName) {
                    caches.entireDts = caches.entireDts + warpDeclareModule(loaderOptions.name ?? '.', key, o.text)
                  }
                })
              }
            }
          }
        }
      })
      writeDtsFile(loaderOptions.typesOutputDir, `${loaderOptions.name}.d.ts`, caches.entireDts)
    }
  } catch (e) {
    console.log(`Skip ${fileName}:`, e)
  }
}

export {emitFile}
