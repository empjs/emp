# EMP CLI 插件使用场景指南

本指南提供了 EMP CLI 插件系统在不同场景下的最佳实践和配置策略。

## 🎯 使用场景指导

### 🏗️ 项目初始化

**React 项目**:
```typescript
import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import pluginTailwindcss from '@empjs/plugin-tailwindcss'

export default defineConfig(store => ({
  plugins: [
    pluginReact({
      hmr: store.isDev,
      splickChunks: !store.isDev
    }),
    pluginTailwindcss()
  ]
}))
```

**Vue 3 项目**:
```typescript
import {defineConfig} from '@empjs/cli'
import Vue3 from '@empjs/plugin-vue3'
import lightningcss from '@empjs/plugin-lightningcss'

export default defineConfig(store => ({
  plugins: [
    Vue3(),
    lightningcss({
      transform: true,
      minify: store.mode === 'production'
    })
  ]
}))
```

### ⚡ 性能优化场景

**极致性能配置**:
```typescript
export default defineConfig(store => {
  const isProd = store.mode === 'production'
  
  return {
    plugins: [
      // 框架优化
      pluginReact({
        hmr: !isProd,
        splickChunks: isProd,
        version: 18
      }),
      
      // CSS 性能优化
      lightningcss({
        transform: {
          targets: { chrome: 90, firefox: 88, safari: 14 },
          drafts: {
            cssNesting: true,
            customMediaQueries: true
          }
        },
        minify: isProd ? {
          zstd: true,
          removeUnusedSymbols: true
        } : false
      }),
      
      // 样式框架
      pluginTailwindcss({
        pxToRemOptions: isProd ? { rootValue: 16 } : undefined
      })
    ]
  }
})
```

### 📱 移动端适配场景

**响应式移动端配置**:
```typescript
export default defineConfig(store => ({
  plugins: [
    pluginReact(),
    pluginTailwindcss({
      pxToRemOptions: {
        rootValue: 100,    // 1rem = 100px
        unitPrecision: 3,
        mediaQuery: true,   // 媒体查询中转换
        viewportWidth: 375, // 设计稿宽度
        selectorBlackList: ['.ignore']
      }
    }),
    lightningcss({
      transform: true,
      minify: store.mode === 'production'
    })
  ]
}))
```

### 🔧 开发体验优化

**开发环境配置**:
```typescript
export default defineConfig(store => {
  if (!store.isDev) return {}
  
  return {
    plugins: [
      pluginReact({
        hmr: {
          overlay: true,
          port: 3001
        },
        svgrQuery: '?react&titleProps'
      }),
      
      postcss({
        postcssOptions: {
          plugins: [
            require('postcss-nested'),
            require('postcss-simple-vars'),
            require('autoprefixer')
          ]
        }
      })
    ],
    
    devtool: 'eval-cheap-module-source-map',
    server: {
      port: 3000,
      open: true,
      hot: true
    }
  }
})
```

## 🛡️ 最佳实践总结

### 配置原则

1. **环境区分**: 开发环境注重体验，生产环境注重性能
2. **渐进增强**: 从基础配置开始，逐步添加功能
3. **类型安全**: 使用 TypeScript 确保配置类型正确
4. **性能优先**: 选择性能最优的插件组合

### 开发流程

1. **项目初始化**: 选择合适的框架插件
2. **样式配置**: 根据 CSS 框架选择对应插件
3. **性能调优**: 配置 LightningCSS 和代码分割
4. **开发体验**: 添加开发工具和调试支持

### 维护策略

1. **版本管理**: 定期更新插件版本
2. **配置审计**: 定期检查配置合理性
3. **性能监控**: 监控构建性能和输出大小
4. **文档同步**: 保持配置文档与实际一致

## 🔍 故障排除

### 常见问题

**插件冲突**:
```typescript
// 确保插件顺序正确
plugins: [
  pluginReact(),      // 框架插件优先
  lightningcss(),    // CSS 处理插件
  pluginTailwindcss() // 具体 CSS 框架插件
]
```

**配置不生效**:
```typescript
// 检查插件是否正确加载
export default defineConfig(store => {
  store.logger.info('Loading plugins...')
  const plugins = [pluginReact()]
  store.logger.info(`Loaded ${plugins.length} plugins`)
  return { plugins }
})
```

**性能问题**:
```typescript
// 启用性能分析
export default defineConfig(store => ({
  debug: {
    rsdoctor: store.cliOptions.analyze
  },
  plugins: [
    // 你的插件配置
  ]
}))
```
