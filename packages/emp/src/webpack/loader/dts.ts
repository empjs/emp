import webpack from 'webpack'
import ts from 'typescript'

interface LoaderOptions {
  name?: string
  exposes?: Record<string, string>
  typesOutputDir: string
}

function getTSConfigPath(cwd: string) {
  const configPath = ts.findConfigFile(cwd, ts.sys.fileExists, 'tsconfig.json')
  return configPath
}

function getTSConfig(cwd: string): ts.CompilerOptions {
  const tsconfigPath = getTSConfigPath(cwd)
  if (!tsconfigPath) {
    throw new Error("Could not find a valid 'tsconfig.json'.")
  }

  const tsconfig = require(tsconfigPath)
  return tsconfig
}

function main(context: webpack.LoaderContext<Partial<LoaderOptions>>, loaderOptions: LoaderOptions, content: string) {
  const tsconfig = getTSConfig(context.rootContext)
  console.log('tsconfig', tsconfig)
  // const languageService = getTSService(
  //   {
  //     ...tsconfig,
  //     declaration: true,
  //     emitDeclarationOnly: true,
  //     outDir: path.resolve(context.rootContext, `${loaderOptions.typesOutputDir}/${loaderOptions.name}/dts`),
  //   },
  //   context.rootContext,
  // )

  // emitFile(context, languageService, loaderOptions)

  return content
}

/**
 * DTSLoader
 * 生成 EMP MF Typescript 声明文件
 * @param this
 * @param source
 * @returns
 */
async function DTSloader(this: webpack.LoaderContext<LoaderOptions>, source: string) {
  const done = this.async()
  const options = this.getOptions()
  done(null, source)

  return main(
    this,
    {
      name: options.name,
      exposes: options.exposes,
      typesOutputDir: options.typesOutputDir || '.wp_federation',
    },
    source,
  )
}

export default DTSloader
