# 配置详解

本章节详细介绍 @empjs/cli 的所有配置选项。

## 配置文件

EMP CLI 使用 `emp-config.ts` 或 `emp-config.js` 作为配置文件。

### 基本结构

```typescript
import { defineConfig } from '@empjs/cli'

export default defineConfig(store => {
  // store 包含当前运行时信息
  // store.mode: 'development' | 'production'
  // store.server.ip: 当前 IP 地址
  // store.server.port: 服务器端口
  
  return {
    // 配置选项
  }
})
```

### 异步配置

```typescript
export default defineConfig(async store => {
  // 可以执行异步操作
  const config = await fetchConfig()
  
  return {
    ...config
  }
})
```

## 核心配置

### base

**类型**: `string`  
**默认值**: `undefined`

公共基础路径，用于配置资源的 publicPath。

```typescript
export default defineConfig(store => {
  return {
    // 根路径
    base: '/',
    
    // 子路径
    base: '/my-app/',
    
    // CDN 路径
    base: 'https://cdn.example.com/',
    
    // 自动设置为当前 IP + 端口
    autoDevBase: true  // 开发模式下自动设置 base
  }
})
```

**说明**：
- `base` 会影响所有资源的加载路径
- 开发模式建议使用 `autoDevBase: true`
- 生产模式根据部署环境设置

### target

**类型**: `string | string[]`  
**默认值**: `['web', 'es2015']`

构建目标环境。

```typescript
export default defineConfig(store => {
  return {
    target: 'web',
    // 或
    target: ['web', 'es2020']
  }
})
```

**可选值**：
- `'web'` - 浏览器环境
- `'node'` - Node.js 环境
- `'webworker'` - Web Worker
- `'es5'`, `'es2015'`, `'es2020'` 等 - ECMAScript 版本

### appSrc

**类型**: `string`  
**默认值**: `'src'`

源代码目录。

```typescript
export default defineConfig(store => {
  return {
    appSrc: 'src'
  }
})
```

### appEntry

**类型**: `string`  
**默认值**: `'index.js'`

入口文件名（相对于 `appSrc`）。

```typescript
export default defineConfig(store => {
  return {
    appEntry: 'index.tsx'
  }
})
```

**说明**：
- 当设置了 `entries` 时，此选项失效

### autoPages

**类型**: `boolean | AutoPagesType`  
**默认值**: `false`

自动扫描页面入口。

```typescript
export default defineConfig(store => {
  return {
    // 启用自动扫描
    autoPages: true,
    
    // 自定义扫描路径
    autoPages: {
      path: 'pages'  // 扫描 src/pages 目录
    }
  }
})
```

**说明**：
- 会自动扫描指定目录下的入口文件
- 每个入口文件会生成对应的 HTML 页面

## 构建配置 (build)

### build.outDir

**类型**: `string`  
**默认值**: `'dist'`

构建输出目录。

```typescript
export default defineConfig(store => {
  return {
    build: {
      outDir: 'dist'
    }
  }
})
```

### build.assetsDir

**类型**: `string`  
**默认值**: `'assets'`

静态资源目录（相对于 `outDir`）。

```typescript
export default defineConfig(store => {
  return {
    build: {
      assetsDir: 'static'
    }
  }
})
```

### build.staticDir

**类型**: `string`  
**默认值**: `''`

包含 js、css、asset 的合集目录。

```typescript
export default defineConfig(store => {
  return {
    build: {
      staticDir: 'static'  // 所有资源都放在 dist/static 下
    }
  }
})
```

### build.publicDir

**类型**: `string`  
**默认值**: `'public'`

公共静态文件目录，会被直接复制到输出目录。

```typescript
export default defineConfig(store => {
  return {
    build: {
      publicDir: 'public'
    }
  }
})
```

### build.sourcemap

**类型**: `boolean | SourceMapType`  
**默认值**: `true`

是否生成 source map。

```typescript
export default defineConfig(store => {
  return {
    build: {
      // 简单配置
      sourcemap: true,
      
      // 详细配置
      sourcemap: {
        js: 'source-map',  // JS source map 类型
        css: true,         // 是否生成 CSS source map
        devToolPluginOptions: {
          // SourceMapDevToolPlugin 选项
        }
      }
    }
  }
})
```

**JS Source Map 类型**：
- `'source-map'` - 完整的 source map
- `'cheap-source-map'` - 不包含列信息
- `'cheap-module-source-map'` - 不包含列信息，包含 loader source map
- `false` - 不生成

### build.minify

**类型**: `boolean`  
**默认值**: `true`

是否压缩代码。

```typescript
export default defineConfig(store => {
  return {
    build: {
      minify: true
    }
  }
})
```

### build.minOptions

**类型**: `SwcJsMinimizerRspackPluginOptions`  
**默认值**: `{}`

JS 压缩器配置。

```typescript
export default defineConfig(store => {
  return {
    build: {
      minOptions: {
        compress: {
          drop_console: true,  // 删除 console
          drop_debugger: true  // 删除 debugger
        },
        mangle: true
      }
    }
  }
})
```

### build.cssminOptions

**类型**: `CssminOptionsType`  
**默认值**: `{}`

CSS 压缩器配置。

```typescript
export default defineConfig(store => {
  return {
    build: {
      cssminOptions: {
        // CSS 压缩选项
      }
    }
  }
})
```

### build.target

**类型**: `JscTarget`  
**默认值**: `'es2015'`

生成代码的 ECMAScript 版本。

```typescript
export default defineConfig(store => {
  return {
    build: {
      target: 'es2020'
    }
  }
})
```

**可选值**：
- `'es3'`, `'es5'`, `'es2015'`, `'es2016'`, `'es2017'`, `'es2018'`, `'es2019'`, `'es2020'`, `'es2021'`, `'es2022'`

### build.polyfill

**类型**: `PolyfillType`  
**默认值**: `undefined`

Polyfill 配置。

```typescript
export default defineConfig(store => {
  return {
    build: {
      polyfill: {
        mode: 'entry',  // 'entry' | 'usage'
        entryCdn: 'https://unpkg.com/@empjs/polyfill@0.0.2/dist/es.js',
        browserslist: ['> 1%', 'last 2 versions'],
        include: ['es.object.values', 'es.array.flat'],
        coreJsFeatures: 'stable',  // 'full' | 'actual' | 'stable' | 'es'
        externalHelpers: false
      }
    }
  }
})
```

**说明**：
- `mode: 'entry'` - 在入口处注入所有 polyfill
- `mode: 'usage'` - 按需注入 polyfill
- `entryCdn` - 使用 CDN 替代入口注入
- `browserslist` - 目标浏览器列表

### build.moduleIds / build.chunkIds

**类型**: `string`  
**默认值**: 开发模式 `'named'`，生产模式 `'deterministic'`

模块和 chunk 的 ID 生成策略。

```typescript
export default defineConfig(store => {
  return {
    build: {
      moduleIds: 'deterministic',
      chunkIds: 'deterministic'
    }
  }
})
```

**可选值**：
- `'named'` - 使用有意义的名称（便于调试）
- `'deterministic'` - 使用哈希（便于缓存）
- `'natural'` - 使用数字 ID
- `'size'` - 按大小排序
- `false` - 不设置

## 服务器配置 (server)

### server.host

**类型**: `string`  
**默认值**: `'0.0.0.0'`

服务器监听地址。

```typescript
export default defineConfig(store => {
  return {
    server: {
      host: '0.0.0.0'  // 监听所有网络接口
    }
  }
})
```

### server.port

**类型**: `number`  
**默认值**: `8000`

服务器端口。

```typescript
export default defineConfig(store => {
  return {
    server: {
      port: 3000
    }
  }
})
```

**说明**：
- 如果端口被占用，会自动寻找可用端口

### server.open

**类型**: `boolean | string`  
**默认值**: `false`

是否自动打开浏览器。

```typescript
export default defineConfig(store => {
  return {
    server: {
      open: true,
      // 或指定打开的路径
      open: '/dashboard'
    }
  }
})
```

### server.hot

**类型**: `boolean`  
**默认值**: `true`

是否启用热模块替换（HMR）。

```typescript
export default defineConfig(store => {
  return {
    server: {
      hot: true
    }
  }
})
```

### server.https

**类型**: `boolean`  
**默认值**: `false`

是否启用 HTTPS。

```typescript
export default defineConfig(store => {
  return {
    server: {
      https: true
    }
  }
})
```

**说明**：
- 会自动生成自签名证书
- 可以通过 `devServer` 配置自定义证书

### server.http2

**类型**: `boolean`  
**默认值**: `false`

是否启用 HTTP/2。

```typescript
export default defineConfig(store => {
  return {
    server: {
      http2: true,
      https: true  // HTTP/2 需要 HTTPS
    }
  }
})
```

### 完整 DevServer 配置

```typescript
export default defineConfig(store => {
  return {
    server: {
      host: '0.0.0.0',
      port: 8000,
      open: true,
      hot: true,
      https: false,
      // Rspack DevServer 的所有选项都可以使用
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true
        }
      },
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
  }
})
```

## HTML 配置 (html)

### html.template

**类型**: `string`  
**默认值**: `'src/index.html'`

HTML 模板路径。

```typescript
export default defineConfig(store => {
  return {
    html: {
      template: 'src/index.html'
    }
  }
})
```

### html.favicon

**类型**: `string`  
**默认值**: `'src/favicon.ico'`

网站图标路径。

```typescript
export default defineConfig(store => {
  return {
    html: {
      favicon: 'src/favicon.ico'
    }
  }
})
```

### html.title

**类型**: `string`  
**默认值**: `undefined`

页面标题。

```typescript
export default defineConfig(store => {
  return {
    html: {
      title: 'My App'
    }
  }
})
```

### html.lang

**类型**: `string`  
**默认值**: `'zh-CN'`

页面语言。

```typescript
export default defineConfig(store => {
  return {
    html: {
      lang: 'zh-CN'
    }
  }
})
```

### html.tags

**类型**: `InjectTagsTypeItem[]`  
**默认值**: `[]`

注入到 HTML 的标签。

```typescript
export default defineConfig(store => {
  return {
    html: {
      tags: [
        {
          tagName: 'script',
          attributes: {
            src: 'https://cdn.example.com/lib.js'
          },
          pos: 'head'  // 'head' | 'body'
        },
        {
          tagName: 'link',
          attributes: {
            rel: 'stylesheet',
            href: 'https://cdn.example.com/style.css'
          },
          pos: 'head'
        }
      ]
    }
  }
})
```

### html.templateParameters

**类型**: `any`  
**默认值**: `{}`

传递给模板的参数。

```typescript
export default defineConfig(store => {
  return {
    html: {
      templateParameters: {
        title: 'My App',
        description: 'My awesome app'
      }
    }
  }
})
```

在模板中使用：

```html
<!DOCTYPE html>
<html>
<head>
  <title><%= title %></title>
  <meta name="description" content="<%= description %>">
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

## 多入口配置 (entries)

```typescript
export default defineConfig(store => {
  return {
    entries: {
      // 入口名称: HTML 配置
      index: {
        template: 'src/index.html',
        title: 'Home Page'
      },
      admin: {
        template: 'src/admin.html',
        title: 'Admin Panel'
      }
    }
  }
})
```

**说明**：
- 每个入口会生成对应的 HTML 文件
- 入口文件为 `src/{entryName}.{js|ts|tsx}`

## CSS 配置 (css)

### css.sass

**类型**: `CssSassOptionsType`  
**默认值**: `{ mode: 'modern' }`

Sass 配置。

```typescript
export default defineConfig(store => {
  return {
    css: {
      sass: {
        api: 'modern',  // 'modern' | 'modern-compiler'
        mode: 'modern', // 'default' | 'modern' | 'legacy'
        sassOptions: {
          // Sass 编译选项
        },
        additionalData: '@import "~@/styles/variables.scss";'
      }
    }
  }
})
```

### css.less

**类型**: `CssLessOptionsType`  
**默认值**: `{ lessOptions: { javascriptEnabled: true, math: 'always' } }`

Less 配置。

```typescript
export default defineConfig(store => {
  return {
    css: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
          math: 'always'  // 'always' | 'parens-division' | 'strict'
        }
      }
    }
  }
})
```

## 调试配置 (debug)

### debug.loggerLevel

**类型**: `'debug' | 'info' | 'warn' | 'error'`  
**默认值**: `'info'`

日志级别。

```typescript
export default defineConfig(store => {
  return {
    debug: {
      loggerLevel: 'debug'
    }
  }
})
```

### debug.clearLog

**类型**: `boolean`  
**默认值**: `true`

是否清空日志。

```typescript
export default defineConfig(store => {
  return {
    debug: {
      clearLog: false
    }
  }
})
```

### debug.showRsconfig

**类型**: `boolean | string | InspectOptions`  
**默认值**: `false`

是否显示 Rspack 配置。

```typescript
export default defineConfig(store => {
  return {
    debug: {
      showRsconfig: true,
      // 或指定输出文件
      showRsconfig: 'rspack-config.json',
      // 或详细配置
      showRsconfig: {
        depth: 10,
        colors: true
      }
    }
  }
})
```

### debug.rsdoctor

**类型**: `boolean | RsdoctorRspackPluginOptions`  
**默认值**: `false`

RsDoctor 性能分析配置。

```typescript
export default defineConfig(store => {
  return {
    debug: {
      rsdoctor: true,
      // 或详细配置
      rsdoctor: {
        disableClientServer: false,
        features: ['loader', 'plugins', 'bundle']
      }
    }
  }
})
```

## 缓存配置 (cache)

**类型**: `boolean | 'persistent' | ExperimentCacheOptions`  
**默认值**: `'persistent'`

```typescript
export default defineConfig(store => {
  return {
    // 启用持久化缓存
    cache: 'persistent',
    
    // 内存缓存
    cache: true,
    
    // 禁用缓存
    cache: false,
    
    // 详细配置
    cache: {
      type: 'filesystem',
      buildDependencies: {
        config: ['emp-config.ts']
      }
    },
    
    // 缓存目录
    cacheDir: 'node_modules/.emp-cache'
  }
})
```

## 环境变量 (define)

**类型**: `Record<string, any>`  
**默认值**: `{}`

全局常量替换。

```typescript
export default defineConfig(store => {
  return {
    define: {
      __VERSION__: JSON.stringify('1.0.0'),
      __API_URL__: JSON.stringify('https://api.example.com'),
      'process.env.NODE_ENV': JSON.stringify(store.mode)
    }
  }
})
```

**说明**：
- 值会被直接替换到代码中
- 字符串需要用 `JSON.stringify()` 包裹

### defineFix

**类型**: `'all' | 'esm' | 'cjs' | 'none'`  
**默认值**: `'cjs'`

环境变量注入方式。

```typescript
export default defineConfig(store => {
  return {
    defineFix: 'all'  // 同时创建 process.env 和 import.meta.env
  }
})
```

## 外部依赖 (externals)

**类型**: `Externals`  
**默认值**: `undefined`

外部化依赖，不打包到 bundle 中。

```typescript
export default defineConfig(store => {
  return {
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM'
    }
  }
})
```

## 路径解析 (resolve)

**类型**: `Resolve`  
**默认值**: `{}`

```typescript
export default defineConfig(store => {
  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '~': path.resolve(__dirname, 'src')
      },
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      modules: ['node_modules']
    }
  }
})
```

## 输出配置 (output)

**类型**: `Output`  
**默认值**: `{}`

```typescript
export default defineConfig(store => {
  return {
    output: {
      filename: '[name].[contenthash:8].js',
      chunkFilename: '[name].[contenthash:8].chunk.js',
      assetModuleFilename: 'assets/[name].[hash:8][ext]'
    }
  }
})
```

## 生命周期钩子 (lifeCycle)

```typescript
export default defineConfig(store => {
  return {
    lifeCycle: {
      async beforeDevServe() {
        console.log('开发服务器启动前')
      },
      async afterDevServe() {
        console.log('开发服务器启动后')
      },
      async beforeBuild() {
        console.log('构建开始前')
      },
      async afterBuild() {
        console.log('构建完成后')
      },
      async beforeServe() {
        console.log('预览服务器启动前')
      },
      async afterServe() {
        console.log('预览服务器启动后')
      }
    }
  }
})
```

## 插件配置 (plugins)

```typescript
import pluginReact from '@empjs/plugin-react'

export default defineConfig(store => {
  return {
    plugins: [
      pluginReact()
    ]
  }
})
```

## 链式配置 (chain)

```typescript
export default defineConfig(store => {
  return {
    chain(chainConfig) {
      // 修改 loader
      chainConfig.module
        .rule('js')
        .use('babel-loader')
        .tap(options => ({
          ...options,
          plugins: ['@babel/plugin-proposal-optional-chaining']
        }))
      
      // 添加插件
      chainConfig.plugin('my-plugin')
        .use(MyPlugin, [{ /* options */ }])
    }
  }
})
```

## 完整配置示例

```typescript
import { defineConfig } from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import path from 'path'

export default defineConfig(store => {
  const isDev = store.mode === 'development'
  
  return {
    // 基础配置
    base: isDev ? '/' : 'https://cdn.example.com/',
    target: 'web',
    appSrc: 'src',
    appEntry: 'index.tsx',
    
    // 构建配置
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: isDev,
      minify: !isDev,
      polyfill: {
        mode: 'entry',
        browserslist: ['> 1%', 'last 2 versions']
      }
    },
    
    // 服务器配置
    server: {
      port: 8000,
      open: true,
      hot: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true
        }
      }
    },
    
    // HTML 配置
    html: {
      template: 'src/index.html',
      title: 'My App',
      favicon: 'src/favicon.ico'
    },
    
    // CSS 配置
    css: {
      sass: {
        mode: 'modern',
        additionalData: '@import "~@/styles/variables.scss";'
      }
    },
    
    // 调试配置
    debug: {
      loggerLevel: isDev ? 'debug' : 'info',
      clearLog: true,
      rsdoctor: false
    },
    
    // 缓存配置
    cache: 'persistent',
    cacheDir: 'node_modules/.emp-cache',
    
    // 环境变量
    define: {
      __VERSION__: JSON.stringify('1.0.0'),
      __API_URL__: JSON.stringify(
        isDev ? 'http://localhost:3000' : 'https://api.example.com'
      )
    },
    
    // 路径解析
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    
    // 插件
    plugins: [
      pluginReact()
    ],
    
    // 生命周期
    lifeCycle: {
      async afterBuild() {
        console.log('构建完成！')
      }
    }
  }
})
```

## 下一步

- 🔌 查看 [插件系统](./05-plugin-system.md) 了解插件开发
- 🚀 阅读 [最佳实践](./10-best-practices.md) 优化配置
- 📖 查看 [API 参考](./09-api-reference.md) 了解更多 API
