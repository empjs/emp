# EMP CLI 框架插件详细指南

## 🔧 核心框架插件

### @empjs/plugin-react - React 框架支持

#### 功能特性
- **自动版本检测**: 从 `package.json` 自动读取 React 版本
- **SWC 编译**: 使用 SWC 进行 JSX/TSX 快速编译
- **热模块替换**: React Refresh HMR 支持
- **SVG 组件化**: SVGR 支持，将 SVG 转为 React 组件
- **代码分割**: 可选的 React 库代码分割
- **CDN 集成**: 支持 React 从 CDN 加载

#### 配置选项详解
```typescript
interface PluginReactType {
  hmr?: boolean                    // 启用热模块替换 (默认: true)
  svgrQuery?: string               // SVG 查询参数 (默认: '?react')
  reactRuntime?: string            // 手动指定 JSX 运行时
  splickChunks?: boolean          // 启用 React 代码分割
  version?: number                 // 强制指定 React 版本
  import?: {                       // CDN 导入配置
    src: string                    // CDN 地址
    externals?: Record<string, string>  // 外部依赖映射
  }
}
```

#### 实用配置示例

**基础 React 项目**:
```typescript
import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'

export default defineConfig(store => ({
  plugins: [pluginReact()]
}))
```

**开发优化配置**:
```typescript
export default defineConfig(store => ({
  plugins: [
    pluginReact({
      hmr: true,                    // 开发环境启用 HMR
      svgrQuery: '?react&titleProps', // SVG 支持 title props
      splickChunks: false          // 开发环境不分割代码
    })
  ]
}))
```

**生产优化配置**:
```typescript
export default defineConfig(store => ({
  plugins: [
    pluginReact({
      hmr: false,                  // 生产环境关闭 HMR
      splickChunks: true,         // 生产环境启用代码分割
      version: 18                 // 指定 React 版本
    })
  ]
}))
```

**CDN 集成配置**:
```typescript
export default defineConfig(store => {
  const isProd = store.mode === 'production'
  
  return {
    plugins: [
      pluginReact({
        // 生产环境使用 CDN
        import: isProd ? {
          src: 'https://unpkg.com/react@18/umd/react.production.min.js',
          externals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            'react-dom/client': 'ReactDOMClient'
          }
        } : undefined
      })
    ]
  }
})
```

### @empjs/plugin-vue2 - Vue 2 框架支持

#### 功能特性
- **Vue 2.x 兼容**: 完全支持 Vue 2.x 生态
- **Vue Loader**: 集成 vue-loader 15.x
- **JSX 支持**: Vue 2 JSX/TSX 编译支持
- **SVG 内联**: Vue 组件中的 SVG 内联处理
- **运行时优化**: Vue 运行时配置优化

#### 配置示例

**基础 Vue 2 项目**:
```typescript
import {defineConfig} from '@empjs/cli'
import Vue2 from '@empjs/plugin-vue2'

export default defineConfig(store => ({
  plugins: [Vue2()]
}))
```

**Vue 2 + TypeScript**:
```typescript
export default defineConfig(store => ({
  plugins: [
    Vue2(),
    // 需要额外的 TypeScript 配置
  ],
  module: {
    rule: {
      test: /\.vue$/,
      use: [
        {
          loader: 'vue-loader',
          options: {
            compilerOptions: {
              preserveWhitespace: false
            }
          }
        }
      ]
    }
  }
}))
```

### @empjs/plugin-vue3 - Vue 3 框架支持

#### 功能特性
- **Vue 3.x 最新**: 支持 Vue 3.x 所有特性
- **Composition API**: 完整的 Composition API 支持
- **自定义 Vue Loader**: @empjs/vue-loader 优化
- **JSX 转换**: Vue 3 JSX 插件集成
- **功能标志**: 自动配置 Vue 3 功能标志

#### 配置示例

**基础 Vue 3 项目**:
```typescript
import {defineConfig} from '@empjs/cli'
import Vue3 from '@empjs/plugin-vue3'

export default defineConfig(store => ({
  plugins: [Vue3()]
}))
```

**Vue 3 + TypeScript + Composition API**:
```typescript
export default defineConfig(store => ({
  plugins: [Vue3()],
  // Vue 3 功能标志自动配置
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false
  }
}))
```

## 🔄 框架切换与混合

### 自动框架检测

```typescript
import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import Vue2 from '@empjs/plugin-vue2'
import Vue3 from '@empjs/plugin-vue3'

export default defineConfig(store => {
  // 自动检测项目框架
  const deps = store.pkg.dependencies || {}
  
  let frameworkPlugin
  if (deps.react) {
    frameworkPlugin = pluginReact()
  } else if (deps.vue) {
    // 检测 Vue 版本
    const vueVersion = deps.vue.match(/\d+/)?.[0]
    frameworkPlugin = parseInt(vueVersion) >= 3 ? Vue3() : Vue2()
  } else {
    throw new Error('No supported framework detected')
  }
  
  return {
    plugins: [frameworkPlugin]
  }
})
```

### 多框架项目配置

```typescript
export default defineConfig(store => {
  const { mode } = store
  const isReact = process.env.FRAMEWORK === 'react'
  const isVue = process.env.FRAMEWORK === 'vue'
  
  return {
    plugins: [
      // 条件加载框架插件
      ...(isReact ? [pluginReact()] : []),
      ...(isVue ? [Vue3()] : []),
      
      // 通用插件
      pluginLightningcss(),
      pluginRspackEmpShare()
    ].filter(Boolean)
  }
})
```

## ⚡ 性能优化配置

### React 性能优化

```typescript
export default defineConfig(store => {
  const isProd = store.mode === 'production'
  
  return {
    plugins: [
      pluginReact({
        // 生产环境优化
        hmr: !isProd,
        splickChunks: isProd,
        
        // React 18 并发特性
        ...(isProd && {
          reactRuntime: 'automatic'
        }),
        
        // 代码分割优化
        ...(isProd && {
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              react: {
                test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                name: 'react-vendor',
                chunks: 'all',
              }
            }
          }
        })
      })
    ]
  }
})
```

### Vue 性能优化

```typescript
export default defineConfig(store => {
  const isProd = store.mode === 'production'
  
  return {
    plugins: [
      Vue3({
        // Vue 3 生产优化
        ...(isProd && {
          define: {
            __VUE_OPTIONS_API__: false,  // 禁用 Options API
            __VUE_PROD_DEVTOOLS__: false  // 禁用开发工具
          }
        })
      })
    ]
  }
})
```

## 🎨 样式集成

### React + TailwindCSS

```typescript
export default defineConfig(store => ({
  plugins: [
    pluginReact(),
    pluginTailwindcss({
      pxToRemOptions: {
        rootValue: 16,
        unitPrecision: 3
      }
    })
  ]
}))
```

### Vue + TailwindCSS

```typescript
export default defineConfig(store => ({
  plugins: [
    Vue3(),
    pluginTailwindcss()
  ],
  // Vue 单文件组件样式处理
  module: {
    rule: {
      test: /\.vue$/,
      use: [
        {
          loader: 'vue-loader',
          options: {
            compilerOptions: {
              isCustomElement: tag => tag.startsWith('x-')
            }
          }
        }
      ]
    }
  }
}))
```

## 🔧 开发体验优化

### React 开发增强

```typescript
export default defineConfig(store => ({
  plugins: [
    pluginReact({
      // HMR 配置
      hmr: {
        overlay: true,              // 显示错误覆盖层
        port: 3001,                // HMR 端口
      },
      
      // SVG 增强
      svgrQuery: '?react&titleProps&svgo',  // SVG 优化
      
      // 开发工具
      ...(store.isDev && {
        reactRuntime: 'automatic'
      })
    })
  ],
  
  // 开发服务器
  server: {
    port: 3000,
    open: true,
    hot: true
  }
}))
```

### Vue 开发增强

```typescript
export default defineConfig(store => ({
  plugins: [
    Vue3(),
    // Vue 开发工具
    ...(store.isDev && [{
      name: 'vue-devtools',
      setup: (store) => {
        store.chain.plugin('vue-devtools').use(require('vue-devtools-webpack-plugin'))
      }
    }])
  ],
  
  // 开发服务器
  server: {
    port: 8080,
    open: true
  }
}))
```

## 🛡️ 类型安全

### React TypeScript 配置

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": [
    "src"
  ]
}

// emp.config.ts
export default defineConfig(store => ({
  plugins: [
    pluginReact({
      reactRuntime: 'automatic'
    })
  ],
  
  tsCheckerRspackPlugin: {
    typescript: {
      configFile: 'tsconfig.json',
    },
    async: true,
    logger: { logLevel: 'info' }
  }
}))
```

### Vue TypeScript 配置

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}

// emp.config.ts
export default defineConfig(store => ({
  plugins: [Vue3()],
  
  tsCheckerRspackPlugin: {
    typescript: {
      configFile: 'tsconfig.json',
    },
    async: true
  }
}))
```

## 📋 最佳实践总结

### 1. 框架选择原则
- React 生态系统成熟，适合大型应用
- Vue 3 性能优异，适合中小型应用
- 考虑团队技术栈和项目需求

### 2. 配置优化策略
- 开发环境注重体验和调试
- 生产环境注重性能和体积
- 使用环境变量动态配置

### 3. 性能优化重点
- 代码分割减少初始加载
- Tree shaking 移除无用代码
- CDN 加速外部依赖

### 4. 开发体验提升
- 启用 HMR 提高开发效率
- 配置 TypeScript 增强类型安全
- 使用源映射方便调试

这些框架插件为 EMP CLI 提供了完整的多框架支持，开发者可以根据项目需求选择合适的框架和配置策略。
