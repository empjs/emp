# EMP CLI React 插件指南

本指南详细介绍了 EMP CLI 对 React 生态的支持，包括核心插件配置、性能优化、样式集成和开发体验增强。

## 🔧 核心插件: @empjs/plugin-react

### 功能特性
- **自动版本检测**: 从 `package.json` 自动读取 React 版本
- **SWC 编译**: 使用 SWC 进行 JSX/TSX 快速编译
- **热模块替换**: React Refresh HMR 支持
- **SVG 组件化**: SVGR 支持，将 SVG 转为 React 组件
- **代码分割**: 可选的 React 库代码分割
- **CDN 集成**: 支持 React 从 CDN 加载

### 配置选项详解
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

### 基础配置示例

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

## ⚡ 性能优化

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

## 🎨 样式集成 (TailwindCSS)

```typescript
import pluginTailwindcss from '@empjs/plugin-tailwindcss'

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

## 🔧 开发体验优化

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

## 🛡️ TypeScript 配置

**tsconfig.json**:
```json
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
```

**emp.config.ts**:
```typescript
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
