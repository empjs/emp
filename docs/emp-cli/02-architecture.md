# 核心架构

本章节深入介绍 @empjs/cli 的核心架构设计、关键组件和工作原理。

## 架构概览

EMP CLI 采用模块化、可扩展的架构设计，主要由以下几个核心部分组成：

```
┌─────────────────────────────────────────────────────────┐
│                     CLI Layer (命令层)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │   dev    │  │  build   │  │  serve   │  │   dts   │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  Store Layer (状态层)                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │  GlobalStore - 全局状态管理和配置聚合              │  │
│  │  • empConfig  • rsConfig  • server  • lifeCycle  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                 Plugin Layer (插件层)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  React   │  │  Vue 2   │  │  Vue 3   │  ...         │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Rspack Layer (构建层)                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Rspack Core + DevServer                         │  │
│  │  • Compiler  • Plugins  • Loaders               │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│               Server Layer (服务层)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Connect  │  │ Express  │  │   Hono   │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
```

## 核心组件

### 1. CLI Layer (命令层)

命令层负责解析用户输入的命令和参数，并调度相应的脚本执行。

#### 入口文件

**文件**: `bin/emp.js`

```javascript
#!/usr/bin/env node
import {runScript} from '@empjs/cli'

runScript()
```

#### 命令注册

**文件**: `src/script/index.ts`

使用 `commander` 库注册所有命令：

```typescript
import { program } from 'commander'

export default async function runScript() {
  program.version(pkg.version, '-v, --version')
  
  // 注册 dev 命令
  program
    .command('dev')
    .description('Dev 模式')
    .option('-e, --env <env>', '部署环境')
    .option('-rd, --doctor', '开启rsdoctor')
    .option('-h, --hot', '热更新')
    .action(async o => {
      const {default: devScript} = await import('src/script/dev')
      await devScript.setup('dev', o)
    })
  
  // 注册其他命令...
  program.parse(process.argv)
}
```

#### 命令脚本基类

**文件**: `src/script/base.ts`

所有命令脚本都继承自 `BaseScript`:

```typescript
export abstract class BaseScript {
  async setup(cliAction: CliActionType, cliOptions: any) {
    // 初始化全局 store
    await store.setup(cliAction, cliOptions)
    
    // 执行具体命令逻辑
    await this.run()
  }
  
  // 子类实现具体逻辑
  abstract run(): Promise<void>
}
```

### 2. Store Layer (状态层)

状态层是整个系统的核心，负责管理全局配置、状态和生命周期。

#### GlobalStore 核心职责

**文件**: `src/store/index.ts`

```typescript
class GlobalStore {
  // Rspack 相关
  public rspack = rspack
  public rspackVersion = rspack.rspackVersion
  
  // 配置对象
  public empConfig: EmpConfig        // EMP 配置
  public rsConfig: RspackOptions     // Rspack 配置
  public chainConfig: Chain          // 链式配置
  
  // 服务器配置
  public server: ServerStore
  
  // 路径管理
  public appSrc: string              // 源码目录
  public outDir: string              // 输出目录
  public cacheDir: string            // 缓存目录
  
  // 环境变量
  public mode: EMPModeType           // 运行模式
  public cliAction: CliActionType    // CLI 命令
  public cliOptions: CliOptionsType  // CLI 选项
  
  // 初始化流程
  async setup(cliAction, cliOptions) {
    this.initVars(cliAction, cliOptions)
    this.initPaths()
    await this.loadEmpConfig()
    await this.setupRspackConfig()
    await this.runPlugins()
    this.toConfig()
  }
}
```

#### 配置加载流程

```
用户配置文件 (emp-config.ts)
        ↓
    loadConfig (使用 jiti 动态加载)
        ↓
    empConfig 初始化
        ↓
    执行插件 (plugins)
        ↓
    生成 rsConfig
        ↓
    chain 配置合并
        ↓
    最终 Rspack 配置
```

### 3. Plugin Layer (插件层)

插件系统允许扩展 EMP CLI 的功能。

#### 插件接口

**文件**: `src/types/plugin.ts`

```typescript
export type EMP3PluginType = {
  name: string
  rsConfig: (store: GlobalStore) => Promise<void>
}

export type EMP3PluginFnType = (options: any) => EMP3PluginType
```

#### 插件执行流程

```typescript
// 在 GlobalStore 中执行插件
for (const plugin of this.empConfig.plugins) {
  await plugin.rsConfig(this)
}
```

#### 内置插件

**文件**: `src/store/rspack/builtInPlugin.ts`

1. **HtmlEmpInjectPlugin** - HTML 标签注入
2. **EmpPolyfillPlugin** - Polyfill 注入

### 4. Rspack Layer (构建层)

构建层基于 Rspack 实现高性能编译。

#### 配置生成

**文件**: `src/store/empConfig.ts`

```typescript
class EmpConfig {
  // 生成 Rspack 配置
  async toRspackConfig(store: GlobalStore): Promise<RspackOptions> {
    return {
      mode: store.mode,
      entry: this.getEntry(),
      output: this.getOutput(),
      module: this.getModule(),
      plugins: this.getPlugins(),
      optimization: this.getOptimization(),
      resolve: this.getResolve(),
      devtool: this.getDevtool(),
      cache: this.getCache(),
      // ... 更多配置
    }
  }
}
```

#### 链式配置

**文件**: `src/store/chain.ts`

使用链式 API 修改配置：

```typescript
export const chainName = {
  plugin: {
    html: 'HtmlWebpackPlugin',
    define: 'DefinePlugin',
    copy: 'CopyPlugin',
    // ...
  },
  rule: {
    js: 'js',
    css: 'css',
    sass: 'sass',
    // ...
  }
}
```

### 5. Server Layer (服务层)

服务层提供开发和生产环境的服务器实现。

#### DevServer 实现

**文件**: `src/server/connect/dev.ts`

```typescript
export class DevServer {
  private server: any = null
  public isServerStarted = false

  async setup(compiler, rspackConfig, store, onReady) {
    const app = new RspackDevServer(rspackConfig.devServer, compiler)
    await app.start()
    app.middleware?.waitUntilValid(onReady)
    this.server = app
  }

  async close() {
    if (this.server) {
      await this.server.stop()
      this.isServerStarted = false
    }
  }
}
```

#### ProdServer 实现

**文件**: `src/server/connect/prod.ts`

```typescript
export class ProdServer {
  async setup(store, onReady) {
    const app = connect()
    app.use(compression())
    app.use(cors())
    app.use(serveStatic(staticRoot))
    
    // SPA 路由支持
    app.use((req, res, next) => {
      if (isStaticFile(req.url)) {
        return next()
      }
      res.end(html)
    })
    
    server.listen(store.server.port, onReady)
  }
}
```

## 核心流程

### Dev 命令流程

```
1. 用户执行 `emp dev`
        ↓
2. CLI 解析命令和参数
        ↓
3. DevScript.setup()
        ↓
4. GlobalStore.setup()
   - 加载配置
   - 执行插件
   - 生成 Rspack 配置
        ↓
5. 创建 Rspack Compiler
        ↓
6. 启动 DevServer
   - 配置中间件
   - 启动 HMR
   - 监听文件变化
        ↓
7. 编译完成回调
   - 打印构建信息
   - 执行生命周期钩子
        ↓
8. 监听配置文件变化
   - 检测 emp-config.ts 修改
   - 自动重启服务器
```

### Build 命令流程

```
1. 用户执行 `emp build`
        ↓
2. CLI 解析命令和参数
        ↓
3. BuildScript.setup()
        ↓
4. GlobalStore.setup()
   - mode = 'production'
   - 加载配置
   - 执行插件
        ↓
5. 创建 Rspack Compiler
        ↓
6. 执行编译
   - 代码转换
   - 代码压缩
   - 资源优化
        ↓
7. 输出构建结果
   - 写入文件
   - 生成报告
   - 打印统计信息
        ↓
8. 执行生命周期钩子
   - afterBuild
```

### Serve 命令流程

```
1. 用户执行 `emp serve`
        ↓
2. CLI 解析命令和参数
        ↓
3. ServeScript.setup()
        ↓
4. 检查构建产物
   - 验证 dist 目录存在
        ↓
5. 启动 ProdServer
   - 配置静态文件服务
   - 配置 SPA 路由
   - 启动 HTTP/HTTPS 服务器
        ↓
6. 打开浏览器（可选）
        ↓
7. 执行生命周期钩子
   - afterServe
```

## 生命周期钩子

**文件**: `src/store/lifeCycle.ts`

```typescript
export type LifeCycleOptions = {
  // Dev 生命周期
  beforeDevServe?: () => void | Promise<void>
  afterDevServe?: () => void | Promise<void>
  
  // Build 生命周期
  beforeBuild?: () => void | Promise<void>
  afterBuild?: () => void | Promise<void>
  
  // Serve 生命周期
  beforeServe?: () => void | Promise<void>
  afterServe?: () => void | Promise<void>
}
```

使用示例：

```typescript
export default defineConfig(store => {
  return {
    lifeCycle: {
      async beforeBuild() {
        console.log('构建开始前...')
      },
      async afterBuild() {
        console.log('构建完成后...')
      }
    }
  }
})
```

## 配置热重载机制

**文件**: `src/script/dev.ts`

```typescript
private watchConfigFile() {
  const configPath = path.resolve(process.cwd(), 'emp.config.ts')
  
  chokidar.watch(configPath).on('change', async () => {
    // 清除缓存
    Object.keys(require.cache).forEach(id => {
      if (id.includes('emp.config')) {
        delete require.cache[id]
      }
    })
    
    // 关闭当前服务器
    await empDevServer.close()
    
    // 重新初始化
    await store.setup()
    
    // 重启服务器
    await this.startDevServer(true)
  })
}
```

## 编译器监听机制

**文件**: `src/helper/compilerWatcher.ts`

监听编译过程中的各个阶段：

```typescript
export function setupCompilerWatcher(compiler, devServer) {
  // 编译开始
  compiler.hooks.compile.tap('EMP', () => {
    console.log('编译开始...')
  })
  
  // 编译完成
  compiler.hooks.done.tap('EMP', stats => {
    console.log('编译完成')
    printBuildDone(stats)
  })
  
  // 编译失败
  compiler.hooks.failed.tap('EMP', error => {
    console.error('编译失败:', error)
  })
  
  return {
    cleanup: () => {
      // 清理监听器
    }
  }
}
```

## 缓存机制

EMP CLI 支持多种缓存策略：

### 1. Rspack 内置缓存

```typescript
cache: {
  type: 'filesystem',  // 或 'memory'
  buildDependencies: {
    config: [configPath]
  },
  cacheDirectory: path.resolve(cacheDir, 'rspack')
}
```

### 2. 配置缓存

```typescript
// emp-config.ts
export default defineConfig(store => {
  return {
    cache: 'persistent',  // 或 true / false
    cacheDir: 'node_modules/.emp-cache'
  }
})
```

## 性能优化

### 1. 并行处理

- 使用 Rspack 的并行编译能力
- 多入口并行构建

### 2. 增量编译

- 文件系统缓存
- 模块级别的增量更新

### 3. 代码分割

- 自动代码分割
- 动态导入支持
- Chunk 优化

## 错误处理

### 1. 构建错误

```typescript
if (stats.hasErrors()) {
  logger.error(stats.toString({
    all: false,
    errors: true
  }))
  process.exit(1)
}
```

### 2. 服务器错误

```typescript
try {
  await server.start()
} catch (error) {
  logger.error('服务器启动失败:', error)
  process.exit(1)
}
```

### 3. 配置错误

```typescript
if (!fs.existsSync(configPath)) {
  logger.warn('配置文件不存在，使用默认配置')
}
```

## 扩展性设计

### 1. 插件系统

- 标准化的插件接口
- 异步插件支持
- 插件间通信机制

### 2. 多服务器实现

- Connect (默认)
- Express (可选)
- Hono (可选)

### 3. 多框架支持

- React
- Vue 2
- Vue 3
- 其他框架（通过插件）

## 下一步

- 📖 查看 [命令行工具](./03-cli-commands.md) 了解所有命令
- 🔧 阅读 [配置详解](./04-configuration.md) 深入理解配置
- 🔌 学习 [插件系统](./05-plugin-system.md) 开发自定义插件
