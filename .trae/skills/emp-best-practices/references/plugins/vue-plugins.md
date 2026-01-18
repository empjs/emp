# EMP CLI Vue 插件指南

本指南详细介绍了 EMP CLI 对 Vue 2 和 Vue 3 生态的支持，包括核心插件配置、性能优化、样式集成和开发体验增强。

## 🔧 核心插件

### @empjs/plugin-vue3 - Vue 3 支持

#### 功能特性
- **Vue 3.x 最新**: 支持 Vue 3.x 所有特性
- **Composition API**: 完整的 Composition API 支持
- **自定义 Vue Loader**: @empjs/vue-loader 优化
- **JSX 转换**: Vue 3 JSX 插件集成
- **功能标志**: 自动配置 Vue 3 功能标志

#### 基础配置示例

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

### @empjs/plugin-vue2 - Vue 2 支持

#### 功能特性
- **Vue 2.x 兼容**: 完全支持 Vue 2.x 生态
- **Vue Loader**: 集成 vue-loader 15.x
- **JSX 支持**: Vue 2 JSX/TSX 编译支持
- **SVG 内联**: Vue 组件中的 SVG 内联处理

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

## ⚡ 性能优化

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

## 🎨 样式集成 (TailwindCSS)

```typescript
import pluginTailwindcss from '@empjs/plugin-tailwindcss'

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

## 🛡️ TypeScript 配置

**tsconfig.json**:
```json
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
```

**emp.config.ts**:
```typescript
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
