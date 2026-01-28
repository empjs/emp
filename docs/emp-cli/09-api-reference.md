# API 参考

本章节提供 @empjs/cli 的完整 API 参考文档。

## 核心 API

### defineConfig

定义 EMP 配置的辅助函数。

**类型签名**：

```typescript
function defineConfig(
  config: EMPConfigExport
): EMPConfigExport

type EMPConfigExport = EmpOptions | EMPConfigFn
type EMPConfigFn = (store: GlobalStore) => EmpOptions | Promise<EmpOptions>
```

**使用示例**：

```typescript
import { defineConfig } from '@empjs/cli'

// 对象配置
export default defineConfig({
  server: {
    port: 8000
  }
})

// 函数配置
export default defineConfig(store => {
  return {
    server: {
      port: store.mode === 'development' ? 8000 : 9000
    }
  }
})

// 异步配置
export default defineConfig(async store => {
  const config = await fetchConfig()
  return config
})
```

### runScript

运行 CLI 脚本的主函数。

**类型签名**：

```typescript
function runScript(): Promise<void>
```

**使用示例**：

```typescript
import { runScript } from '@empjs/cli'

runScript()
```

## Store API

### GlobalStore

全局状态管理类。

**类型定义**：

```typescript
class GlobalStore {
  // Rspack 相关
  rspack: typeof rspack
  rspackVersion: string
  isOldRspack: boolean
  
  // 配置
  empConfig: EmpConfig
  rsConfig: RspackOptions
  chainConfig: Chain
  
  // 服务器
  server: ServerStore
  
  // 路径
  appSrc: string
  outDir: string
  cacheDir: string
  resolve: (path: string) => string
  
  // 环境
  mode: 'development' | 'production'
  cliAction: 'dev' | 'build' | 'serve'
  cliOptions: CliOptionsType
  
  // 方法
  setup(cliAction?: CliActionType, cliOptions?: any): Promise<void>
  merge(config: RspackOptions): void
  toConfig(): void
  logConfig(): void
  browserslistOptions(): BrowserslistOptions
  uniqueName(): string
  encodeVarName(name: string): string
  injectTags(tags: InjectTagsType, name?: string, chunk?: string): void
}
```

**访问 Store**：

```typescript
import { store } from '@empjs/cli'

// 在配置文件中
export default defineConfig(store => {
  console.log(store.mode)  // 'development' | 'production'
  console.log(store.server.port)  // 8000
  
  return {}
})

// 在插件中
export const myPlugin = () => ({
  name: 'my-plugin',
  async rsConfig(store) {
    console.log(store.rsConfig)
  }
})
```

## Helper API

### Logger

日志工具类。

**类型定义**：

```typescript
class Logger {
  debug(...args: any[]): void
  info(...args: any[]): void
  warn(...args: any[]): void
  error(...args: any[]): void
  red(...args: any[]): void
  green(...args: any[]): void
  yellow(...args: any[]): void
  blue(...args: any[]): void
  sysError(...args: any[]): void
}
```

**使用示例**：

```typescript
import { Logger } from '@empjs/cli'

const logger = new Logger()

logger.info('Info message')
logger.warn('Warning message')
logger.error('Error message')
logger.debug('Debug message')

logger.red('Red text')
logger.green('Green text')
logger.yellow('Yellow text')
logger.blue('Blue text')
```

### color

颜色工具函数。

**使用示例**：

```typescript
import { color } from '@empjs/cli'

console.log(color.red('Error'))
console.log(color.green('Success'))
console.log(color.yellow('Warning'))
console.log(color.blue('Info'))
console.log(color.gray('Debug'))
```

### empHelper

工具函数集合。

**导出内容**：

```typescript
export * as empHelper from 'src/helper'

// 包含：
// - logger: Logger 实例
// - color: 颜色函数
// - buildPrint: 构建输出函数
// - loadConfig: 配置加载函数
// - getPort: 端口获取函数
// - utils: 通用工具函数
```

**使用示例**：

```typescript
import { empHelper } from '@empjs/cli'

empHelper.logger.info('Message')
empHelper.color.red('Error')
```

## 类型定义

### EmpOptions

EMP 配置选项类型。

```typescript
type EmpOptions = {
  base?: string
  target?: RsConfig['target']
  autoDevBase?: boolean
  autoPages?: boolean | AutoPagesType
  appSrc?: string
  appEntry?: string
  build?: BuildType
  plugins?: EMP3PluginType[]
  html?: HtmlType
  entries?: EntriesType
  server?: ServerType
  debug?: DebugType
  chain?: (chain: Chain) => void
  css?: CssType
  moduleTransform?: ModuleTransform
  cacheDir?: string
  cache?: boolean | 'persistent' | ExperimentCacheOptions
  define?: Record<string, any>
  defineFix?: 'all' | 'esm' | 'cjs' | 'none'
  externals?: Externals
  resolve?: Resolve
  output?: Output
  lifeCycle?: LifeCycleOptions
  ignoreWarnings?: RsConfig['ignoreWarnings']
  tsCheckerRspackPlugin?: TsCheckerRspackPluginOptions | boolean
  showLogTitle?: (o?: any) => void
}
```

### BuildType

构建配置类型。

```typescript
type BuildType = {
  outDir?: string
  assetsDir?: string
  staticDir?: string
  publicDir?: string
  moduleIds?: 'named' | 'deterministic'
  chunkIds?: false | 'natural' | 'named' | 'deterministic' | 'size' | 'total-size'
  sourcemap?: boolean | SourceMapType
  devtool?: RsConfig['devtool']
  minify?: boolean
  minOptions?: SwcJsMinimizerRspackPluginOptions
  cssminOptions?: CssminOptionsType
  target?: JscTarget
  useESM?: boolean
  polyfill?: PolyfillType
  swcConfig?: SwcConfigType
}
```

### ServerType

服务器配置类型。

```typescript
type ServerType = devServerConfig & {
  host?: string
  port?: number
  open?: devServerConfig['open']
  hot?: devServerConfig['hot']
  http2?: boolean
  https?: boolean
}
```

### DebugType

调试配置类型。

```typescript
type DebugType = {
  loggerLevel?: 'debug' | 'info' | 'warn' | 'error'
  clearLog?: boolean
  progress?: boolean
  showRsconfig?: boolean | string | InspectOptions
  showPerformance?: boolean
  showScriptDebug?: boolean
  rsdoctor?: boolean | RsdoctorRspackPluginOptions
  newTreeshaking?: boolean
  devShowAllLog?: boolean
  warnRuleAsWarning?: boolean
  infrastructureLogging?: RsConfig['infrastructureLogging']
  cssChunkingPlugin?: boolean
}
```

### LifeCycleOptions

生命周期钩子类型。

```typescript
type LifeCycleOptions = {
  beforeDevServe?: () => void | Promise<void>
  afterDevServe?: () => void | Promise<void>
  beforeBuild?: () => void | Promise<void>
  afterBuild?: () => void | Promise<void>
  beforeServe?: () => void | Promise<void>
  afterServe?: () => void | Promise<void>
}
```

### EMP3PluginType

插件类型。

```typescript
type EMP3PluginType = {
  name: string
  rsConfig: (store: GlobalStore) => Promise<void>
}

type EMP3PluginFnType = (options: any) => EMP3PluginType
```

## Rspack API

### rspack

Rspack 核心导出。

```typescript
import { rspack } from '@empjs/cli'

// 等同于
import { rspack } from '@rspack/core'
```

### RspackOptions

Rspack 配置类型。

```typescript
import type { RspackOptions } from '@empjs/cli'

// 等同于
import type { Configuration } from '@rspack/core'
```

### Compiler

Rspack 编译器类型。

```typescript
import type { Compiler } from '@empjs/cli'

// 等同于
import type { Compiler } from '@rspack/core'
```

### Compilation

Rspack 编译对象类型。

```typescript
import type { Compilation } from '@empjs/cli'

// 等同于
import type { Compilation } from '@rspack/core'
```

### LoaderContext

Loader 上下文类型。

```typescript
import type { LoaderContext } from '@empjs/cli'

// 等同于
import type { LoaderContext } from '@rspack/core'
```

## 链式配置 API

### Chain

链式配置类。

**使用示例**：

```typescript
export default defineConfig(store => {
  return {
    chain(chainConfig) {
      // 添加 rule
      chainConfig.module
        .rule('custom')
        .test(/\.custom$/)
        .use('custom-loader')
        .loader('custom-loader')
        .options({})
      
      // 添加 plugin
      chainConfig
        .plugin('custom-plugin')
        .use(CustomPlugin, [{}])
      
      // 修改已有配置
      chainConfig.module
        .rule('js')
        .use('babel-loader')
        .tap(options => ({
          ...options,
          plugins: ['my-plugin']
        }))
    }
  }
})
```

### chainName

预定义的链式配置名称。

```typescript
export const chainName = {
  plugin: {
    html: 'HtmlWebpackPlugin',
    define: 'DefinePlugin',
    copy: 'CopyPlugin',
    progress: 'ProgressPlugin',
    analyzer: 'BundleAnalyzerPlugin'
  },
  rule: {
    js: 'js',
    ts: 'ts',
    css: 'css',
    sass: 'sass',
    less: 'less',
    image: 'image',
    font: 'font'
  }
}
```

**使用示例**：

```typescript
import { chainName } from '@empjs/cli'

export default defineConfig(store => {
  return {
    chain(chainConfig) {
      // 修改 HTML 插件
      chainConfig
        .plugin(chainName.plugin.html)
        .tap(options => ({
          ...options,
          minify: true
        }))
      
      // 修改 JS rule
      chainConfig.module
        .rule(chainName.rule.js)
        .use('babel-loader')
        .tap(options => ({
          ...options
        }))
    }
  }
})
```

## 命令行 API

### program

Commander 程序实例。

```typescript
import { program } from '@empjs/cli'

// 等同于
import { program } from 'commander'
```

**使用示例**：

```typescript
import { program } from '@empjs/cli'

program
  .command('custom')
  .description('Custom command')
  .action(() => {
    console.log('Custom command executed')
  })
```

## 类型声明导出

### 基础类型

```typescript
// 从 @empjs/cli/types/base 导入
import type { EmpEnv } from '@empjs/cli/types/base'
```

### React 类型

```typescript
// 从 @empjs/cli/types/react 导入
import type { EmpReact } from '@empjs/cli/types/react'
```

### Vue 类型

```typescript
// 从 @empjs/cli/types/vue 导入
import type { EmpVue } from '@empjs/cli/types/vue'
```

## TypeScript 配置导出

### 基础配置

```json
{
  "extends": "@empjs/cli/tsconfig/base"
}
```

### React 配置

```json
{
  "extends": "@empjs/cli/tsconfig/react"
}
```

### Vue 配置

```json
{
  "extends": "@empjs/cli/tsconfig/vue"
}
```

## 完整示例

### 使用所有 API

```typescript
import { 
  defineConfig,
  store,
  rspack,
  program,
  color,
  Logger,
  empHelper
} from '@empjs/cli'
import type {
  EmpOptions,
  GlobalStore,
  RspackOptions,
  Compiler,
  EMP3PluginType
} from '@empjs/cli'

// 自定义插件
const myPlugin: EMP3PluginType = {
  name: 'my-plugin',
  async rsConfig(store: GlobalStore) {
    const logger = new Logger()
    logger.info(color.green('Plugin loaded'))
    
    store.chainConfig
      .plugin('my-plugin')
      .use(rspack.DefinePlugin, [{
        __VERSION__: JSON.stringify('1.0.0')
      }])
  }
}

// 配置
export default defineConfig(async (store: GlobalStore) => {
  empHelper.logger.info('Loading config...')
  
  const config: EmpOptions = {
    server: {
      port: 8000
    },
    plugins: [myPlugin],
    lifeCycle: {
      async afterBuild() {
        console.log(color.green('Build completed!'))
      }
    }
  }
  
  return config
})
```

## 下一步

- 📖 查看 [配置详解](./04-configuration.md) 了解配置选项
- 🔌 阅读 [插件系统](./05-plugin-system.md) 开发插件
- 🚀 探索 [最佳实践](./10-best-practices.md) 优化使用
