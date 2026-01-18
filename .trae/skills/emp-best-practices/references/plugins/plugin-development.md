# EMP CLI 插件开发与扩展指南

## 🛠️ 插件开发基础

### 核心插件接口

所有 EMP CLI 插件都遵循统一的标准接口：

```typescript
export type EMP3PluginType = {
  name: string                           // 插件唯一标识
  rsConfig: (store: GlobalStore) => Promise<void>  // 配置函数
}

export type EMP3PluginFnType = (o: any) => EMP3PluginType
```

### 标准插件模板

```typescript
export default (options = {}) => {
  return {
    name: '@empjs/plugin-example',
    async rsConfig(store: GlobalStore) {
      // 1. 配置验证和默认值设置
      const config = validateConfig(options)
      
      // 2. 条件性插件逻辑
      if (config.enabled) {
        await setupPlugin(store, config)
      }
      
      // 3. 错误处理
      try {
        await configureBuild(store, config)
      } catch (error) {
        store.logger.error(`Plugin ${this.name} failed:`, error)
        throw error
      }
    }
  }
}
```

## 🏗️ 插件架构深入

### GlobalStore 访问权限

```typescript
interface GlobalStore {
  // 核心配置
  chain: RspackChain                     // Rspack 配置链
  empConfig: EMPConfig                   // EMP CLI 配置
  mode: string                           // 构建模式 (development/production)
  isDev: boolean                        // 是否开发环境
  
  // 包信息
  pkg: PackageJson                      // package.json 内容
  dependencies: Record<string, string>   // 依赖版本信息
  
  // 文件系统工具
  resolve: (path: string) => string     // 路径解析
  getProjectRoot: () => string          // 项目根目录
  
  // 配置工具
  deepAssign: (target: any, source: any) => any  // 深度合并
  compareVersion: (a: string, b: string) => number  // 版本比较
  
  // 日志系统
  logger: {
    info: (message: string) => void
    warn: (message: string) => void
    error: (message: string, error?: Error) => void
    debug: (message: string) => void
  }
}
```

### 配置修改模式

#### 1. 链式修改模式

```typescript
export default (options = {}) => {
  return {
    name: '@empjs/plugin-example',
    async rsConfig(store) {
      // 修改模块规则
      store.chain.module
        .rule('example-rule')
        .test(/\.example$/)
        .use('example-loader')
        .loader(require.resolve('example-loader'))
        .options({
          ...options.loaderOptions
        })
      
      // 添加插件
      store.chain.plugin('example-plugin')
        .use(ExamplePlugin, [options.pluginOptions])
      
      // 修改解析配置
      store.chain.resolve
        .alias
        .set('@example', path.resolve(__dirname, 'src'))
    }
  }
}
```

#### 2. 条件配置模式

```typescript
export default (options = {}) => {
  return {
    name: '@empjs/plugin-example',
    async rsConfig(store) {
      const { isDev, mode, pkg } = store
      const config = mergeDefaults(options, getDefaultConfig(mode))
      
      // 环境特定配置
      if (isDev) {
        setupDevelopment(store, config)
      } else {
        setupProduction(store, config)
      }
      
      // 依赖检测
      if (pkg.dependencies?.react) {
        setupReactIntegration(store, config)
      }
      
      // 条件功能
      if (config.advanced) {
        setupAdvancedFeatures(store, config)
      }
    }
  }
}
```

#### 3. 异步配置模式

```typescript
export default (options = {}) => {
  return {
    name: '@empjs/plugin-async-example',
    async rsConfig(store) {
      // 异步读取配置文件
      const userConfig = await loadUserConfig(options.configPath)
      
      // 异步检查外部依赖
      const dependencyInfo = await checkDependencyVersions()
      
      // 异步加载插件
      const externalPlugin = await import(options.pluginPackage)
      
      // 应用配置
      store.chain.plugin('async-plugin')
        .use(externalPlugin.default, [userConfig])
    }
  }
}
```

## 📦 插件类别与模式

### 1. 框架集成插件

```typescript
export default (options = {}) => {
  return {
    name: '@empjs/plugin-custom-framework',
    async rsConfig(store) {
      const framework = options.framework || detectFramework(store.pkg)
      
      switch (framework) {
        case 'custom-js':
          setupCustomJS(store, options)
          break
        case 'custom-ts':
          setupCustomTS(store, options)
          break
        default:
          throw new Error(`Unsupported framework: ${framework}`)
      }
    }
  }
}

function setupCustomJS(store, options) {
  store.chain.module
    .rule('custom-js')
    .test(/\.custom\.js$/)
    .use('custom-loader')
    .loader(require.resolve('./custom-loader'))
    .options(options)
}

function setupCustomTS(store, options) {
  store.chain.module
    .rule('custom-ts')
    .test(/\.custom\.ts$/)
    .use('ts-loader')
    .loader('ts-loader')
    .options({
      ...options,
      compilerOptions: {
        target: 'ES2020',
        module: 'ESNext',
        ...options.compilerOptions
      }
    })
}
```

### 2. 资源处理插件

```typescript
export default (options = {}) => {
  return {
    name: '@empjs/plugin-resource-handler',
    async rsConfig(store) {
      // 图片处理
      if (options.images !== false) {
        store.chain.module
          .rule('images')
          .test(/\.(png|jpe?g|gif|webp)$/i)
          .type('asset')
          .parser({
            dataUrlCondition: {
              maxSize: options.imageInlineLimit || 8192
            }
          })
          .generator({
            filename: 'images/[name].[hash:8][ext]'
          })
      }
      
      // 字体处理
      if (options.fonts !== false) {
        store.chain.module
          .rule('fonts')
          .test(/\.(woff|woff2|eot|ttf|otf)$/i)
          .type('asset/resource')
          .generator({
            filename: 'fonts/[name].[hash:8][ext]'
          })
      }
      
      // 自定义资源类型
      if (options.customResources) {
        setupCustomResources(store, options.customResources)
      }
    }
  }
}

function setupCustomResources(store, resources) {
  Object.entries(resources).forEach(([name, config]) => {
    store.chain.module
      .rule(name)
      .test(config.test)
      .use(config.loader)
      .loader(config.loader)
      .options(config.options || {})
  })
}
```

### 3. 代码优化插件

```typescript
export default (options = {}) => {
  return {
    name: '@empjs/plugin-code-optimizer',
    async rsConfig(store) {
      const isProd = !store.isDev
      
      if (!isProd) return
      
      // 压缩配置
      store.chain.optimization
        .minimizer('example-minimizer')
        .use(ExampleMinimizerPlugin, [{
          comments: false,
          extractComments: false,
          ...options.minimizerOptions
        }])
      
      // 代码分割
      if (options.codeSplitting) {
        store.chain.optimization
          .splitChunks({
            chunks: 'all',
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
              },
              ...options.splitChunksConfig
            }
          })
      }
      
      // Tree Shaking
      if (options.treeShaking !== false) {
        store.chain.optimization
          .usedExports(true)
          .sideEffects(false)
      }
    }
  }
}
```

### 4. 开发体验插件

```typescript
export default (options = {}) => {
  return {
    name: '@empjs/plugin-dev-experience',
    async rsConfig(store) {
      if (!store.isDev) return
      
      // 热模块替换
      if (options.hmr !== false) {
        store.chain.plugin('hmr')
          .use(require('webpack.HotModuleReplacementPlugin'))
      }
      
      // 开发工具
      store.chain.devtool(options.devtool || 'eval-cheap-module-source-map')
      
      // 错误覆盖层
      if (options.errorOverlay !== false) {
        store.chain.plugin('error-overlay')
          .use(require('react-error-overlay'))
      }
      
      // 开发服务器配置
      if (options.serverConfig) {
        Object.entries(options.serverConfig).forEach(([key, value]) => {
          store.chain.devServer.set(key, value)
        })
      }
      
      // 性能监控
      if (options.performanceMonitoring) {
        store.chain.plugin('bundle-analyzer')
          .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [{
            analyzerMode: 'static',
            openAnalyzer: false
          }])
      }
    }
  }
}
```

## 🔧 高级插件模式

### 1. 插件间通信

```typescript
// 插件 A - 设置共享状态
export default (options = {}) => {
  return {
    name: '@empjs/plugin-provider',
    async rsConfig(store) {
      // 在 GlobalStore 中设置共享数据
      store.sharedData = store.sharedData || {}
      store.sharedData.customConfig = options.sharedConfig
      
      // 注册钩子
      store.hooks = store.hooks || {}
      store.hooks.beforeBuild = []
      store.hooks.afterBuild = []
    }
  }
}

// 插件 B - 使用共享状态
export default (options = {}) => {
  return {
    name: '@empjs/plugin-consumer',
    async rsConfig(store) {
      // 使用共享数据
      const sharedConfig = store.sharedData?.customConfig
      
      if (sharedConfig) {
        store.chain.module
          .rule('consumer-rule')
          .use('consumer-loader')
          .options({
            sharedConfig,
            ...options
          })
      }
      
      // 注册钩子回调
      if (store.hooks?.beforeBuild) {
        store.hooks.beforeBuild.push(() => {
          console.log('Consumer plugin before build')
        })
      }
    }
  }
}
```

### 2. 动态插件加载

```typescript
export default (options = {}) => {
  return {
    name: '@empjs/plugin-dynamic-loader',
    async rsConfig(store) {
      // 动态加载外部插件
      const externalPlugins = await Promise.all(
        options.plugins.map(async (pluginConfig) => {
          const pluginModule = await import(pluginConfig.package)
          const plugin = pluginModule.default(pluginConfig.options)
          await plugin.rsConfig(store)
          return plugin
        })
      )
      
      // 动态配置模块规则
      const dynamicRules = await loadDynamicRules(options.rulesPath)
      Object.entries(dynamicRules).forEach(([name, rule]) => {
        store.chain.module.rule(name).merge(rule)
      })
      
      // 返回插件信息供其他使用
      store.dynamicPlugins = externalPlugins
    }
  }
}
```

### 3. 插件生命周期管理

```typescript
export default (options = {}) => {
  return {
    name: '@empjs/plugin-lifecycle-manager',
    
    // 初始化阶段
    async initialize(store) {
      store.logger.info('Initializing lifecycle manager')
      this.startTime = Date.now()
    },
    
    // 配置阶段
    async rsConfig(store) {
      await this.initialize(store)
      
      // 注册生命周期钩子
      store.hooks = store.hooks || {}
      
      // 构建前钩子
      store.hooks.beforeBuild = [
        ...(store.hooks.beforeBuild || []),
        async () => {
          this.recordStartTime('build')
          store.logger.info('Build starting...')
        }
      ]
      
      // 构建后钩子
      store.hooks.afterBuild = [
        ...(store.hooks.afterBuild || []),
        async (stats) => {
          this.recordEndTime('build')
          this.generateReport(stats)
          store.logger.info('Build completed')
        }
      ]
    },
    
    // 工具方法
    recordStartTime(phase) {
      this[`${phase}StartTime`] = Date.now()
    },
    
    recordEndTime(phase) {
      this[`${phase}EndTime`] = Date.now()
      this[`${phase}Duration`] = this[`${phase}EndTime`] - this[`${phase}StartTime`]
    },
    
    generateReport(stats) {
      const report = {
        totalDuration: Date.now() - this.startTime,
        buildDuration: this.buildDuration,
        assets: stats.toJson().assets,
        performance: stats.toJson().performance
      }
      
      // 写入报告文件
      require('fs').writeFileSync(
        path.join(process.cwd(), 'build-report.json'),
        JSON.stringify(report, null, 2)
      )
    }
  }
}
```

## 🧪 插件测试

### 单元测试示例

```typescript
// tests/plugin.test.ts
import { GlobalStore } from '@empjs/cli'
import myPlugin from '../src/index'

// Mock GlobalStore
const mockStore = {
  chain: {
    module: {
      rule: jest.fn().mockReturnThis(),
      use: jest.fn().mockReturnThis(),
      loader: jest.fn().mockReturnThis(),
      options: jest.fn().mockReturnThis()
    },
    plugin: jest.fn().mockReturnThis()
  },
  empConfig: {},
  mode: 'development',
  isDev: true,
  pkg: { dependencies: { react: '18.0.0' } },
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
  }
} as any

describe('My Plugin', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  test('should configure correctly with default options', async () => {
    const plugin = myPlugin()
    expect(plugin.name).toBe('@empjs/plugin-example')
    
    await plugin.rsConfig(mockStore)
    
    expect(mockStore.chain.module.rule).toHaveBeenCalledWith('example-rule')
    expect(mockStore.chain.plugin).toHaveBeenCalledWith('example-plugin')
  })
  
  test('should handle error gracefully', async () => {
    const plugin = myPlugin({ invalidOption: true })
    
    // 模拟错误
    mockStore.chain.module.rule.mockImplementation(() => {
      throw new Error('Configuration error')
    })
    
    await expect(plugin.rsConfig(mockStore)).rejects.toThrow()
    expect(mockStore.logger.error).toHaveBeenCalled()
  })
  
  test('should merge options with defaults', async () => {
    const customOptions = { feature: 'custom' }
    const plugin = myPlugin(customOptions)
    
    await plugin.rsConfig(mockStore)
    
    // 验证配置合并
    expect(mockStore.chain.module.rule).toHaveBeenCalled()
  })
})
```

### 集成测试示例

```typescript
// tests/integration.test.ts
import { defineConfig } from '@empjs/cli'
import myPlugin from '../src/index'

describe('Plugin Integration', () => {
  test('should work with other plugins', async () => {
    const config = defineConfig(() => ({
      plugins: [
        myPlugin({ feature: 'integration' }),
        // 其他插件
      ]
    }))
    
    // 验证配置生成
    expect(config.plugins).toHaveLength(2)
  })
  
  test('should handle different environments', async () => {
    const devConfig = defineConfig(() => ({
      mode: 'development',
      plugins: [myPlugin()]
    }))
    
    const prodConfig = defineConfig(() => ({
      mode: 'production',
      plugins: [myPlugin()]
    }))
    
    // 验证环境特定行为
    expect(devConfig.mode).toBe('development')
    expect(prodConfig.mode).toBe('production')
  })
})
```

## 📦 插件发布

### package.json 配置

```json
{
  "name": "@empjs/plugin-example",
  "version": "1.0.0",
  "description": "Example plugin for EMP CLI",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "README.md"
  ],
  "keywords": [
    "emp",
    "plugin",
    "webpack",
    "rspack"
  ],
  "peerDependencies": {
    "@empjs/cli": "^3.0.0"
  },
  "devDependencies": {
    "@empjs/cli": "^3.0.0",
    "typescript": "^4.9.0"
  },
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "prepublishOnly": "npm run build && npm test"
  }
}
```

### TypeScript 配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "tests"
  ]
}
```

## 📋 插件开发最佳实践

### 1. 命名规范
- 使用 `@empjs/plugin-` 前缀
- 描述性名称，如 `@empjs/plugin-tailwindcss`
- 保持名称简洁且有意义

### 2. 配置设计
- 提供合理的默认值
- 支持渐进式配置
- 使用 TypeScript 类型定义
- 提供详细的配置文档

### 3. 错误处理
- 优雅处理配置错误
- 提供清晰的错误信息
- 支持错误恢复机制

### 4. 性能考虑
- 延迟加载重型依赖
- 避免阻塞构建流程
- 支持并行处理

### 5. 文档规范
- 完整的 README 文档
- API 文档和类型定义
- 使用示例和最佳实践
- 贡献指南

### 6. 版本管理
- 遵循语义化版本
- 提供迁移指南
- 保持向后兼容性

这些开发指南帮助开发者创建高质量、可维护的 EMP CLI 插件，扩展 CLI 的功能和生态系统。
