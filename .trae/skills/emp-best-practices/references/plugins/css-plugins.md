# EMP CLI CSS 处理插件详细指南

## 🎨 CSS 处理插件概览

EMP CLI 提供了 6 个专业的 CSS 处理插件，涵盖从现代 CSS 转换到传统预处理器的完整生态。

## ⚡ @empjs/plugin-lightningcss - LightningCSS 性能优化

### 核心特性
- **极速转换**: 比 PostCSS 快 100 倍的 CSS 转换
- **现代 CSS 支持**: 原生支持嵌套、容器查询等现代特性
- **智能压缩**: 高效的 CSS 压缩和优化
- **浏览器目标**: 基于 browserslist 的精准浏览器兼容
- **PostCSS 兼容**: 可选的 PostCSS 兼容模式

### 配置选项详解
```typescript
interface PluginLightningcssOptions {
  transform?: LightningCSSTransformOptions | boolean  // 转换配置
  minify?: LightningCSSTransformOptions | boolean    // 压缩配置
  implementation?: Implementation                   // 实现选择
  enablePostcss?: boolean                           // 启用 PostCSS 兼容
}
```

### 高级配置示例

**基础高性能配置**:
```typescript
import {defineConfig} from '@empjs/cli'
import lightningcss from '@empjs/plugin-lightningcss'

export default defineConfig(store => ({
  plugins: [
    lightningcss({
      transform: true,    // 启用转换
      minify: true        // 启用压缩
    })
  ]
}))
```

**浏览器目标优化**:
```typescript
export default defineConfig(store => ({
  plugins: [
    lightningcss({
      transform: {
        // 精准浏览器目标
        targets: {
          chrome: 90,
          firefox: 88,
          safari: 14,
          edge: 90
        },
        // 启用现代 CSS 特性
        drafts: {
          cssNesting: true,
          customMediaQueries: true
        }
      },
      minify: {
        // 压缩优化
        exclude: [
          // 保留某些功能用于调试
          lightningcss.Features.CssNesting
        ]
      }
    })
  ]
}))
```

**PostCSS 兼容模式**:
```typescript
export default defineConfig(store => ({
  plugins: [
    lightningcss({
      transform: true,
      enablePostcss: true,  // 启用 PostCSS 兼容
      minify: store.mode === 'production'
    }),
    
    // 可以同时使用 PostCSS 插件
    pluginTailwindcss()
  ]
}))
```

### 性能对比配置

```typescript
export default defineConfig(store => {
  const isProd = store.mode === 'production'
  
  return {
    plugins: [
      lightningcss({
        // 开发环境：快速转换
        transform: isProd ? {
          targets: 'cover 99%',
          drafts: {
            cssNesting: true,
            customMediaQueries: true
          }
        } : {
          targets: { chrome: 90, firefox: 88 }
        },
        
        // 生产环境：极致优化
        minify: isProd ? {
          removeUnusedSymbols: true,
          zstd: true  // 使用 Zstandard 压缩
        } : false
      })
    ]
  }
})
```

## 🎯 @empjs/plugin-tailwindcss - Tailwind CSS v4 支持

### 核心特性
- **Tailwind CSS v4**: 最新版本支持
- **@tailwindcss/postcss**: 官方 PostCSS 插件集成
- **导入解析**: 智能 Tailwind 导入路径解析
- **px-to-rem**: 可选的移动端适配转换
- **自动 autoprefixer**: 基于 browserslist 的自动前缀

### 配置选项
```typescript
interface TailwindcssOptions {
  pxToRemOptions?: PxToRemOptions  // px-to-rem 转换配置
}
```

### 实用配置示例

**零配置使用**:
```typescript
import {defineConfig} from '@empjs/cli'
import pluginTailwindcss from '@empjs/plugin-tailwindcss'

export default defineConfig(store => ({
  plugins: [
    pluginTailwindcss()  // 零配置启动
  ]
}))
```

**移动端适配配置**:
```typescript
export default defineConfig(store => ({
  plugins: [
    pluginTailwindcss({
      pxToRemOptions: {
        rootValue: 100,    // 1rem = 100px (移动端常用)
        unitPrecision: 3,  // 精度
        selectorBlackList: [],  // 选择器黑名单
        propList: ['*'],   // 转换所有属性
        replace: true,     // 直接替换
        mediaQuery: false, // 媒体查询中不转换
        minPixelValue: 2,  // 最小转换像素值
        exclude: /node_modules/i  // 排除 node_modules
      }
    })
  ]
}))
```

**高级配置与 LightningCSS 结合**:
```typescript
export default defineConfig(store => ({
  plugins: [
    // LightningCSS 性能优化
    lightningcss({
      transform: true,
      minify: store.mode === 'production'
    }),
    
    // TailwindCSS v4
    pluginTailwindcss({
      pxToRemOptions: {
        rootValue: 16,     // PC 端 1rem = 16px
        unitPrecision: 5,
        mediaQuery: true,   // 媒体查询中转换
        replace: true,
        viewportUnit: 'vw',
        viewportWidth: 375,  // 设计稿宽度
        viewportHeight: 667, // 设计稿高度
        unitToConvert: ['px'],
        fontViewportUnit: 'vw',
        selectorBlackList: [
          '.ignore',
          '.hairlines'
        ]
      }
    })
  ]
}))
```

## 📚 TailwindCSS 版本兼容插件

### @empjs/plugin-tailwindcss2 - v2 支持

```typescript
import tailwindcss2 from '@empjs/plugin-tailwindcss2'

export default defineConfig(store => ({
  plugins: [
    tailwindcss2()  // 适用于现有的 TailwindCSS v2 项目
  ]
}))
```

### @empjs/plugin-tailwindcss3 - v3 支持

```typescript
import tailwindcss3 from '@empjs/plugin-tailwindcss3'

export default defineConfig(store => ({
  plugins: [
    tailwindcss3()  // 适用于 TailwindCSS v3 项目
  ]
}))
```

### 版本选择策略

```typescript
export default defineConfig(store => {
  const pkg = store.pkg
  
  // 自动检测 TailwindCSS 版本
  let tailwindPlugin
  if (pkg.dependencies?.['tailwindcss']) {
    const version = pkg.dependencies['tailwindcss']
    if (version.startsWith('4') || version.includes('alpha')) {
      tailwindPlugin = pluginTailwindcss()
    } else if (version.startsWith('3')) {
      tailwindPlugin = tailwindcss3()
    } else if (version.startsWith('2')) {
      tailwindPlugin = tailwindcss2()
    }
  }
  
  return {
    plugins: [tailwindPlugin].filter(Boolean)
  }
})
```

## 🖋️ @empjs/plugin-stylus - Stylus 预处理器

### 功能特性
- **Stylus 语法**: 支持完整的 Stylus 语法
- **变量和混合**: CSS 变量和混合支持
- **嵌套语法**: 自然的 CSS 嵌套
- **函数和运算**: 强大的 CSS 函数支持

### 配置示例

**基础 Stylus 配置**:
```typescript
import {defineConfig} from '@empjs/cli'
import stylus from '@empjs/plugin-stylus'

export default defineConfig(store => ({
  plugins: [
    stylus({
      stylusOptions: {
        compress: store.mode === 'production',
        linenos: store.isDev,
        includeCSS: true,
        resolveURL: true
      }
    })
  ]
}))
```

**高级 Stylus 配置**:
```typescript
export default defineConfig(store => ({
  plugins: [
    stylus({
      stylusOptions: {
        // 导入路径
        include: [
          path.resolve(__dirname, 'src/styles'),
          path.resolve(__dirname, 'node_modules')
        ],
        
        // 全局函数
        define: {
          'primary-color': '#007bff',
          'font-size-base': '16px'
        },
        
        // 插件
        use: [
          require('stylus-plugin-rupture'),  // 响应式工具
          require('autoprefixer-stylus')      // 自动前缀
        ],
        
        // 压缩配置
        compress: store.mode === 'production',
        
        // 源映射
        sourcemap: store.isDev
      }
    })
  ]
}))
```

## 🔧 @empjs/plugin-postcss - PostCSS 核心处理

### 功能特性
- **PostCSS 核心**: 原生 PostCSS 支持
- **插件生态**: 完整的 PostCSS 插件生态
- **工具函数**: 内置常用的 PostCSS 工具函数
- **自定义配置**: 灵活的 PostCSS 配置

### 配置选项
```typescript
interface PluginPostcssType {
  postcssOptions?: any  // PostCSS 配置选项
}
```

### 工具函数使用

```typescript
import {postcss} from '@empjs/plugin-postcss'

export default defineConfig(store => ({
  plugins: [
    postcss({
      postcssOptions: {
        plugins: [
          // 自动前缀
          postcss.autoprefixer({
            overrideBrowserslist: ['> 1%', 'last 2 versions']
          }),
          
          // px 转 rem
          postcss.pxtorem({
            rootValue: 16,
            unitPrecision: 3,
            propList: ['*'],
            selectorBlackList: ['.ignore']
          }),
          
          // px 转 vw
          postcss.pxtovw({
            viewportWidth: 375,
            viewportHeight: 667,
            unitPrecision: 3
          }),
          
          // 压缩
          require('cssnano')({
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
                normalizeWhitespace: store.mode === 'production'
              }
            ]
          })
        ]
      }
    })
  ]
}))
```

### 自定义 PostCSS 配置

```typescript
export default defineConfig(store => {
  const isProd = store.mode === 'production'
  
  return {
    plugins: [
      postcss({
        postcssOptions: {
          // 语法解析器
          parser: require('postcss-scss'),
          
          // 语法生成器
          stringifier: require('postcss-scss'),
          
          // 插件配置
          plugins: [
            // SCSS 变量和混合
            require('postcss-simple-vars')({
              variables: require('./src/styles/variables.json')
            }),
            
            // 嵌套
            require('postcss-nested')(),
            
            // 条件语句
            require('postcss-conditionals')(),
            
            // 循环
            require('postcss-for')(),
            
            // 颜色函数
            require('postcss-color-function')(),
            
            // 自动前缀
            require('autoprefixer'),
            
            // 生产环境压缩
            ...(isProd ? [
              require('cssnano')({
                preset: 'default'
              })
            ] : [])
          ]
        }
      })
    ]
  }
})
```

## 🔄 插件组合策略

### 性能优先组合

```typescript
export default defineConfig(store => ({
  plugins: [
    // 1. LightningCSS 性能优化
    lightningcss({
      transform: {
        targets: { chrome: 90, firefox: 88, safari: 14 },
        drafts: {
          cssNesting: true,
          customMediaQueries: true
        }
      },
      minify: store.mode === 'production'
    }),
    
    // 2. TailwindCSS v4 (如果需要)
    ...(store.pkg.dependencies?.tailwindcss ? [
      pluginTailwindcss({
        pxToRemOptions: store.mode === 'production' ? {
          rootValue: 16,
          unitPrecision: 3
        } : undefined
      })
    ] : [])
  ]
}))
```

### 兼容性优先组合

```typescript
export default defineConfig(store => ({
  plugins: [
    // 1. 传统 PostCSS 兼容
    postcss({
      postcssOptions: {
        plugins: [
          require('tailwindcss'),
          require('autoprefixer'),
          require('postcss-preset-env')({
            stage: 2,  // 稳定特性
            features: {
              'nesting-rules': true,
              'custom-properties': true
            }
          })
        ]
      }
    }),
    
    // 2. LightningCSS 压缩 (生产环境)
    ...(store.mode === 'production' ? [
      lightningcss({
        transform: false,
        minify: true
      })
    ] : [])
  ]
}))
```

### 开发体验优化组合

```typescript
export default defineConfig(store => ({
  plugins: [
    // 1. 开发友好的处理器
    store.isDev ? postcss({
      postcssOptions: {
        plugins: [
          require('postcss-import'),
          require('postcss-simple-vars'),
          require('postcss-nested'),
          require('postcss-mixins'),
          require('autoprefixer'),
          // 开发工具
          require('postcss-reporter')({
            clearReportedMessages: true
          })
        ]
      }
    }) : pluginTailwindcss(),
    
    // 2. LightningCSS 转换
    lightningcss({
      transform: true,
      minify: false
    })
  ]
}))
```

## 📱 响应式设计支持

### 多断点配置

```typescript
export default defineConfig(store => ({
  plugins: [
    pluginTailwindcss({
      pxToRemOptions: {
        rootValue: 16,  // PC 基准
        unitPrecision: 3,
        mediaQuery: true,
        
        // 自定义媒体查询处理
        minPixelValue: 1,
        
        // 响应式断点
        viewportWidth: 1920,  // PC 设计稿
        viewportUnit: 'rem'
      }
    }),
    
    postcss({
      postcssOptions: {
        plugins: [
          // 响应式字体大小
          require('postcss-responsive-type')({
            baseFontSize: '16px',
            ratio: 1.125,
            breakpoint: '768px'
          }),
          
          // 响应式间距
          require('postcss-responsive-spacing')({
            baseSpacing: '1rem',
            breakpoint: '768px'
          })
        ]
      }
    })
  ]
}))
```

## 🎨 主题系统配置

### CSS 变量主题

```typescript
export default defineConfig(store => ({
  plugins: [
    postcss({
      postcssOptions: {
        plugins: [
          // CSS 变量处理
          require('postcss-custom-properties')({
            importFrom: [
              './src/styles/variables.css',
              './src/themes/light.css'
            ],
            exportTo: './dist/variables.css',
            preserve: false  // 不保留原始 var()
          }),
          
          // 主题切换
          require('postcss-preset-env')({
            stage: 3,
            features: {
              'custom-properties': true
            }
          })
        ]
      }
    }),
    
    lightningcss({
      transform: true,
      minify: store.mode === 'production'
    })
  ]
}))
```

## 📊 性能监控

### CSS 分析配置

```typescript
export default defineConfig(store => ({
  plugins: [
    postcss({
      postcssOptions: {
        plugins: [
          // CSS 分析
          require('postcss-discard-duplicates')(),
          require('postcss-merge-rules')(),
          require('postcss-minify-selectors')(),
          
          // 性能报告
          ...(store.cliOptions.analyze ? [
            require('postcss-at-rules-variables')({
              variables: {},
              atRules: ['media', 'supports']
            })
          ] : [])
        ]
      }
    }),
    
    lightningcss({
      transform: true,
      minify: store.mode === 'production'
    })
  ],
  
  debug: {
    rsdoctor: store.cliOptions.analyze  // 启用 rsdoctor 分析
  }
}))
```

## 📋 最佳实践总结

### 1. 性能优化优先级
1. **LightningCSS** - 最快的转换和压缩
2. **代码分割** - 按页面分割 CSS
3. **Tree Shaking** - 移除未使用的样式

### 2. 兼容性策略
1. **渐进增强** - 基础样式 + 现代 CSS 增强
2. **Browserslist** - 精准的浏览器目标
3. **Polyfill** - 按需添加 polyfill

### 3. 开发体验
1. **源映射** - 开发环境启用
2. **错误提示** - 详细的错误信息
3. **实时更新** - HMR 支持

### 4. 生产优化
1. **极致压缩** - 多级压缩策略
2. **CDN 优化** - 静态资源 CDN
3. **缓存策略** - 长期缓存配置

这些 CSS 处理插件为 EMP CLI 提供了从现代 CSS 转换到传统预处理器的完整解决方案，开发者可以根据项目需求选择合适的插件组合。
