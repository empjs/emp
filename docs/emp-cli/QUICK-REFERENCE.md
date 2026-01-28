# EMP CLI 快速参考

> 快速查找常用命令、配置和 API 的速查表

## 🚀 常用命令

```bash
# 开发
emp dev                                    # 启动开发服务器
emp dev --env test                         # 指定环境
emp dev --doctor                           # 性能分析
emp dev --open                             # 自动打开浏览器
emp dev --ts                               # 生成类型声明

# 构建
emp build                                  # 生产构建
emp build --analyze                        # 包体积分析
emp build --watch                          # Watch 模式
emp build --watch --serve                  # Watch + 预览

# 预览
emp serve                                  # 预览构建结果

# 版本
emp -v                                     # 查看版本
```

## ⚙️ 基础配置

```typescript
import { defineConfig } from '@empjs/cli'

export default defineConfig(store => {
  return {
    // 基础路径
    base: '/',
    
    // 源码目录
    appSrc: 'src',
    
    // 入口文件
    appEntry: 'index.tsx',
    
    // 服务器
    server: {
      port: 8000,
      open: true,
      hot: true
    },
    
    // 构建
    build: {
      outDir: 'dist',
      sourcemap: true,
      minify: true
    }
  }
})
```

## 🔌 常用插件

```typescript
// React
import pluginReact from '@empjs/plugin-react'

plugins: [
  pluginReact()
]

// Vue 3
import pluginVue3 from '@empjs/plugin-vue3'

plugins: [
  pluginVue3()
]

// 模块联邦
import { pluginRspackEmpShare } from '@empjs/share'

plugins: [
  pluginRspackEmpShare({
    name: 'app',
    exposes: {
      './App': './src/App'
    }
  })
]
```

## 📝 TypeScript 配置

```json
{
  "extends": "@empjs/cli/tsconfig/react",
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"]
}
```

## 🎨 路径别名

```typescript
// emp-config.ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, 'src'),
    '@components': path.resolve(__dirname, 'src/components')
  }
}

// tsconfig.json
"paths": {
  "@/*": ["src/*"],
  "@components/*": ["src/components/*"]
}
```

## 🌍 环境变量

```typescript
// 定义
define: {
  'process.env.API_URL': JSON.stringify('https://api.example.com')
}

// 使用
const apiUrl = process.env.API_URL
```

## 🔧 代理配置

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      pathRewrite: { '^/api': '' }
    }
  }
}
```

## 📦 代码分割

```typescript
chain(chainConfig) {
  chainConfig.optimization
    .splitChunks({
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        }
      }
    })
}
```

## 🎯 生命周期钩子

```typescript
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
  }
}
```

## 🐛 调试配置

```typescript
debug: {
  loggerLevel: 'debug',           // 日志级别
  clearLog: false,                // 保留日志
  showRsconfig: true,             // 显示配置
  rsdoctor: true                  // 性能分析
}
```

## 📊 性能优化

```typescript
// 缓存
cache: 'persistent',
cacheDir: 'node_modules/.emp-cache',

// Source Map
build: {
  sourcemap: {
    js: 'cheap-module-source-map',
    css: false
  }
},

// 压缩
build: {
  minify: true,
  minOptions: {
    compress: {
      drop_console: true
    }
  }
}
```

## 🔐 常用类型

```typescript
import type {
  EmpOptions,
  GlobalStore,
  RspackOptions,
  EMP3PluginType
} from '@empjs/cli'
```

## 📚 package.json 脚本

```json
{
  "scripts": {
    "dev": "emp dev",
    "dev:test": "emp dev --env test",
    "dev:analyze": "emp dev --doctor",
    "build": "emp build",
    "build:analyze": "emp build --analyze",
    "start": "emp serve",
    "type-check": "tsc --noEmit"
  }
}
```

## 🌐 模块联邦配置

```typescript
// Host
pluginRspackEmpShare({
  name: 'host',
  exposes: {
    './App': './src/App'
  },
  remotes: {
    'remote': 'remote@http://localhost:8002/emp.js'
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true }
  }
})

// Remote
pluginRspackEmpShare({
  name: 'remote',
  exposes: {
    './RemoteApp': './src/App'
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true }
  }
})
```

## 🎨 HTML 配置

```typescript
html: {
  template: 'src/index.html',
  title: 'My App',
  favicon: 'src/favicon.ico',
  tags: [
    {
      tagName: 'script',
      attributes: {
        src: 'https://cdn.example.com/lib.js'
      },
      pos: 'head'
    }
  ]
}
```

## 🎨 CSS 配置

```typescript
css: {
  sass: {
    mode: 'modern',
    additionalData: '@import "~@/styles/variables.scss";'
  },
  less: {
    lessOptions: {
      javascriptEnabled: true,
      math: 'always'
    }
  }
}
```

## 🔍 常见问题

### 端口被占用
```typescript
server: {
  port: 8000,
  strictPort: false  // 自动寻找可用端口
}
```

### 内存溢出
```bash
NODE_OPTIONS=--max-old-space-size=4096 emp build
```

### 构建慢
```typescript
cache: 'persistent',
tsCheckerRspackPlugin: {
  async: true
}
```

## 📖 文档链接

- [快速开始](./01-quick-start.md)
- [核心架构](./02-architecture.md)
- [命令行工具](./03-cli-commands.md)
- [配置详解](./04-configuration.md)
- [插件系统](./05-plugin-system.md)
- [API 参考](./09-api-reference.md)
- [最佳实践](./10-best-practices.md)

---

**提示**: 这是一个快速参考，详细信息请查看完整文档。
