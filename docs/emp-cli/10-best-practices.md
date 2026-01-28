# 最佳实践

本章节提供使用 @empjs/cli 的最佳实践和优化建议。

## 项目结构

### 推荐的目录结构

```
my-emp-app/
├── src/
│   ├── assets/              # 静态资源
│   │   ├── images/
│   │   ├── fonts/
│   │   └── styles/
│   ├── components/          # 组件
│   │   ├── Button/
│   │   ├── Input/
│   │   └── index.ts
│   ├── pages/               # 页面
│   │   ├── Home/
│   │   ├── About/
│   │   └── index.ts
│   ├── utils/               # 工具函数
│   ├── hooks/               # 自定义 Hooks
│   ├── services/            # API 服务
│   ├── types/               # 类型定义
│   ├── App.tsx              # 根组件
│   ├── index.tsx            # 入口文件
│   ├── index.html           # HTML 模板
│   └── favicon.ico
├── public/                  # 公共静态文件
├── @mf-types/               # 模块联邦类型
├── dist/                    # 构建输出
├── node_modules/
├── emp-config.ts            # EMP 配置
├── tsconfig.json            # TypeScript 配置
├── package.json
└── pnpm-lock.yaml
```

## 配置优化

### 1. 环境区分

```typescript
import { defineConfig } from '@empjs/cli'

export default defineConfig(store => {
  const isDev = store.mode === 'development'
  const isProd = store.mode === 'production'
  
  return {
    build: {
      sourcemap: isDev,
      minify: isProd,
      polyfill: isProd ? {
        mode: 'entry',
        browserslist: ['> 1%', 'last 2 versions']
      } : undefined
    },
    server: {
      open: isDev,
      hot: isDev
    },
    debug: {
      loggerLevel: isDev ? 'debug' : 'info',
      clearLog: !isDev
    }
  }
})
```

### 2. 路径别名

```typescript
import path from 'path'

export default defineConfig(store => {
  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@assets': path.resolve(__dirname, 'src/assets')
      }
    }
  }
})
```

在 `tsconfig.json` 中同步配置：

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"],
      "@assets/*": ["src/assets/*"]
    }
  }
}
```

### 3. 环境变量管理

创建 `.env` 文件：

```bash
# .env.development
API_URL=http://localhost:3000
DEBUG=true

# .env.production
API_URL=https://api.example.com
DEBUG=false
```

在配置中使用：

```typescript
import { defineConfig } from '@empjs/cli'
import dotenv from 'dotenv'

export default defineConfig(store => {
  // 加载环境变量
  dotenv.config({ path: `.env.${store.mode}` })
  
  return {
    define: {
      'process.env.API_URL': JSON.stringify(process.env.API_URL),
      'process.env.DEBUG': JSON.stringify(process.env.DEBUG)
    }
  }
})
```

### 4. 代码分割

```typescript
export default defineConfig(store => {
  return {
    chain(chainConfig) {
      chainConfig.optimization
        .splitChunks({
          chunks: 'all',
          cacheGroups: {
            // 提取第三方库
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10
            },
            // 提取公共代码
            common: {
              minChunks: 2,
              name: 'common',
              priority: 5
            }
          }
        })
    }
  }
})
```

## 性能优化

### 1. 构建性能

#### 启用持久化缓存

```typescript
export default defineConfig(store => {
  return {
    cache: 'persistent',
    cacheDir: 'node_modules/.emp-cache'
  }
})
```

#### 减少 Source Map 开销

```typescript
export default defineConfig(store => {
  const isDev = store.mode === 'development'
  
  return {
    build: {
      sourcemap: isDev ? {
        js: 'cheap-module-source-map',  // 开发环境使用快速 source map
        css: false                       // 禁用 CSS source map
      } : false                          // 生产环境禁用
    }
  }
})
```

#### 优化 TypeScript 检查

```typescript
export default defineConfig(store => {
  return {
    tsCheckerRspackPlugin: {
      async: true,  // 异步检查，不阻塞构建
      typescript: {
        memoryLimit: 4096,
        configFile: 'tsconfig.json'
      }
    }
  }
})
```

### 2. 运行时性能

#### 代码压缩

```typescript
export default defineConfig(store => {
  return {
    build: {
      minify: true,
      minOptions: {
        compress: {
          drop_console: true,      // 删除 console
          drop_debugger: true,     // 删除 debugger
          pure_funcs: ['console.log']  // 删除特定函数调用
        }
      }
    }
  }
})
```

#### CSS 优化

```typescript
export default defineConfig(store => {
  return {
    build: {
      cssminOptions: {
        preset: [
          'default',
          {
            discardComments: { removeAll: true }
          }
        ]
      }
    }
  }
})
```

#### 资源优化

```typescript
export default defineConfig(store => {
  return {
    chain(chainConfig) {
      // 图片优化
      chainConfig.module
        .rule('image')
        .type('asset')
        .parser({
          dataUrlCondition: {
            maxSize: 10 * 1024  // 小于 10KB 的图片转 base64
          }
        })
    }
  }
})
```

## 模块联邦最佳实践

### 1. Host 配置

```typescript
import { defineConfig } from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import { pluginRspackEmpShare, externalReact } from '@empjs/share'

export default defineConfig(store => {
  const port = 8001
  
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        name: 'host',
        
        // 暴露组件
        exposes: {
          './App': './src/App',
          './Button': './src/components/Button'
        },
        
        // 远程模块
        remotes: {
          'remote': `remote@http://localhost:8002/emp.js`
        },
        
        // 共享依赖
        shared: {
          react: {
            singleton: true,
            requiredVersion: '^18.0.0',
            eager: false
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '^18.0.0',
            eager: false
          }
        },
        
        // 生成类型
        dts: {
          generateTypes: true
        },
        
        // 运行时配置
        empRuntime: {
          setExternals: externalReact
        }
      })
    ],
    server: { port }
  }
})
```

### 2. Remote 配置

```typescript
export default defineConfig(store => {
  const port = 8002
  
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        name: 'remote',
        
        // 只暴露，不消费
        exposes: {
          './RemoteApp': './src/App',
          './RemoteButton': './src/components/Button'
        },
        
        // 共享依赖
        shared: {
          react: {
            singleton: true,
            requiredVersion: '^18.0.0'
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '^18.0.0'
          }
        },
        
        dts: {
          generateTypes: true
        }
      })
    ],
    server: { port }
  }
})
```

### 3. 类型同步

在 Host 项目中：

```typescript
// 在 package.json 中添加脚本
{
  "scripts": {
    "dev": "emp dev",
    "dev:types": "emp dev --ts",
    "sync-types": "emp dts"
  }
}
```

## 开发体验优化

### 1. 热更新优化

```typescript
export default defineConfig(store => {
  return {
    server: {
      hot: true,
      liveReload: true
    },
    chain(chainConfig) {
      // 配置 HMR
      chainConfig
        .plugin('hmr')
        .use(require('@rspack/core').HotModuleReplacementPlugin)
    }
  }
})
```

### 2. 错误提示优化

```typescript
export default defineConfig(store => {
  return {
    debug: {
      devShowAllLog: false,  // 只显示错误和警告
      warnRuleAsWarning: true
    },
    ignoreWarnings: [
      /Conflicting order/,
      /Failed to parse source map/
    ]
  }
})
```

### 3. 开发服务器优化

```typescript
export default defineConfig(store => {
  return {
    server: {
      port: 8000,
      host: '0.0.0.0',
      open: true,
      
      // 代理配置
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          pathRewrite: { '^/api': '' }
        }
      },
      
      // CORS 配置
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }
  }
})
```

## 生产部署优化

### 1. 构建优化

```typescript
export default defineConfig(store => {
  const isProd = store.mode === 'production'
  
  return {
    build: {
      // 输出配置
      outDir: 'dist',
      assetsDir: 'assets',
      
      // 压缩
      minify: isProd,
      
      // Source Map（生产环境可选）
      sourcemap: false,
      
      // Polyfill
      polyfill: isProd ? {
        mode: 'entry',
        browserslist: ['> 1%', 'last 2 versions', 'not dead']
      } : undefined
    },
    
    // 代码分割
    chain(chainConfig) {
      if (isProd) {
        chainConfig.optimization
          .splitChunks({
            chunks: 'all',
            maxInitialRequests: 25,
            minSize: 20000,
            cacheGroups: {
              defaultVendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10,
                reuseExistingChunk: true
              },
              default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true
              }
            }
          })
          .runtimeChunk('single')
      }
    }
  }
})
```

### 2. CDN 配置

```typescript
export default defineConfig(store => {
  const isProd = store.mode === 'production'
  const cdnUrl = 'https://cdn.example.com'
  
  return {
    base: isProd ? `${cdnUrl}/` : '/',
    
    output: {
      publicPath: isProd ? `${cdnUrl}/` : '/'
    },
    
    html: {
      tags: isProd ? [
        {
          tagName: 'link',
          attributes: {
            rel: 'dns-prefetch',
            href: cdnUrl
          },
          pos: 'head'
        }
      ] : []
    }
  }
})
```

### 3. 资源哈希

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

## 调试技巧

### 1. 查看 Rspack 配置

```typescript
export default defineConfig(store => {
  return {
    debug: {
      showRsconfig: true,  // 在控制台输出
      // 或输出到文件
      showRsconfig: 'rspack-config.json'
    }
  }
})
```

### 2. 性能分析

```bash
# 使用 RsDoctor
emp dev --doctor

# 包体积分析
emp build --analyze

# 模块编译时间
emp build --profile
```

### 3. 日志调试

```typescript
export default defineConfig(store => {
  return {
    debug: {
      loggerLevel: 'debug',
      clearLog: false,
      infrastructureLogging: {
        level: 'verbose'
      }
    }
  }
})
```

## 团队协作

### 1. 统一配置

创建共享配置包：

```typescript
// @my-company/emp-config
export const createConfig = (options) => {
  return defineConfig(store => {
    return {
      // 公司统一配置
      ...commonConfig,
      // 项目自定义配置
      ...options
    }
  })
}
```

在项目中使用：

```typescript
import { createConfig } from '@my-company/emp-config'

export default createConfig({
  server: {
    port: 8000
  }
})
```

### 2. 代码规范

在 `package.json` 中添加：

```json
{
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx",
    "format": "prettier --write src",
    "type-check": "tsc --noEmit"
  }
}
```

### 3. Git Hooks

使用 `husky` 和 `lint-staged`：

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## 常见问题解决

### 1. 端口冲突

```typescript
export default defineConfig(store => {
  return {
    server: {
      port: 8000,
      // 端口被占用时自动递增
      strictPort: false
    }
  }
})
```

### 2. 内存溢出

```bash
# 增加 Node.js 内存限制
NODE_OPTIONS=--max-old-space-size=4096 emp build
```

### 3. 构建慢

```typescript
export default defineConfig(store => {
  return {
    // 启用缓存
    cache: 'persistent',
    
    // 减少 TypeScript 检查
    tsCheckerRspackPlugin: {
      async: true
    },
    
    // 优化 Source Map
    build: {
      sourcemap: {
        js: 'cheap-module-source-map'
      }
    }
  }
})
```

## 安全建议

### 1. 环境变量

```typescript
// 不要在代码中硬编码敏感信息
export default defineConfig(store => {
  return {
    define: {
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
    }
  }
})
```

### 2. 依赖安全

```bash
# 定期检查依赖安全性
pnpm audit

# 更新依赖
pnpm update
```

### 3. CSP 配置

```typescript
export default defineConfig(store => {
  return {
    server: {
      headers: {
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'"
      }
    }
  }
})
```

## 总结

遵循这些最佳实践可以帮助你：

- ✅ 提高开发效率
- ✅ 优化构建性能
- ✅ 改善运行时性能
- ✅ 增强代码质量
- ✅ 简化团队协作
- ✅ 提升用户体验

## 相关资源

- 📖 [配置详解](./04-configuration.md)
- 🔌 [插件系统](./05-plugin-system.md)
- 📖 [API 参考](./09-api-reference.md)
