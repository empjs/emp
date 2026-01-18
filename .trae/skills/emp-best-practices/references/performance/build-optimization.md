# EMP CLI 构建性能优化指南

## 🚀 构建性能优化

### 1. 持久缓存配置
```typescript
// emp.config.ts
export default defineConfig(store => {
  return {
    build: {
      // 启用持久缓存以加快重建
      cache: {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      },
    },
  }
})
```

### 2. 并行处理配置
```typescript
export default defineConfig(store => {
  return {
    build: {
      // 启用并行处理
      parallel: true,
      // 设置并行进程数
      parallelism: require('os').cpus().length - 1,
    },
  }
})
```

### 3. 代码分割策略
```typescript
export default defineConfig(store => {
  return {
    build: {
      // 智能代码分割
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },
  }
})
```

## 📦 包体积优化

### 4. 摇树优化配置
```typescript
export default defineConfig(store => {
  return {
    build: {
      // 启用摇树优化
      treeShaking: true,
      // 优化导出
      optimization: {
        usedExports: true,
        sideEffects: false,
      },
    },
  }
})
```

### 5. 外部依赖配置
```typescript
export default defineConfig(store => {
  return {
    build: {
      externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'lodash': '_',
      },
    },
  }
})
```

### 6. 压缩配置
```typescript
export default defineConfig(store => {
  return {
    build: {
      minify: store.mode === 'production',
      // 高级压缩选项
      minifyOptions: {
        compress: {
          drop_console: store.mode === 'production',
          drop_debugger: store.mode === 'production',
        },
        mangle: store.mode === 'production',
      },
    },
  }
})
```

## 🎯 目标环境优化

### 7. 构建目标配置
```typescript
export default defineConfig(store => {
  const isDev = store.mode === 'development'
  
  return {
    build: {
      target: isDev ? 'esnext' : 'web',
      // 浏览器兼容性
      browserslist: isDev 
        ? ['last 1 chrome version']
        : ['> 0.5%', 'last 2 versions', 'not dead'],
    },
  }
})
```

### 8. 模块解析优化
```typescript
export default defineConfig(store => {
  return {
    resolve: {
      // 路径别名
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
      },
      // 扩展名解析
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
      // 模块目录
      modules: ['node_modules'],
    },
  }
})
```

## 🔧 Rspack 特定优化

### 9. Rspack 并行编译
```typescript
export default defineConfig(store => {
  return {
    // Rspack 特定配置
    rspack: {
      // 启用实验性功能
      experiments: {
        css: true,
        incrementalRebuild: true,
      },
      // 编译器优化
      compiler: {
        lazyCompilation: store.mode === 'development',
      },
    },
  }
})
```

### 10. 资源处理优化
```typescript
export default defineConfig(store => {
  return {
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024, // 8kb 以下内联
            },
          },
          generator: {
            filename: 'images/[name].[hash:8][ext]',
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[hash:8][ext]',
          },
        },
      ],
    },
  }
})
```

## 🧪 开发环境优化

### 11. 热模块替换优化
```typescript
export default defineConfig(store => {
  return {
    server: {
      hot: true,
      // 优化 HMR 性能
      hmr: {
        overlay: true,
        port: 3001,
      },
    },
    devtool: store.mode === 'development' ? 'eval-cheap-module-source-map' : false,
  }
})
```

### 12. 开发服务器配置
```typescript
export default defineConfig(store => {
  return {
    server: {
      port: 8000,
      open: true,
      // 代理配置
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
      // 静态资源
      static: {
        directory: path.join(__dirname, 'public'),
        publicPath: '/',
      },
    },
  }
})
```

## 📊 性能分析与监控

### 13. 构建分析
```typescript
export default defineConfig(store => {
  return {
    debug: {
      // 启用 rsdoctor 进行性能分析
      rsdoctor: store.cliOptions.analyze,
      // 脚本调试
      showScriptDebug: store.cliOptions.profile,
    },
  }
})
```

### 14. 性能预算配置
```typescript
export default defineConfig(store => {
  return {
    performance: {
      // 性能预算
      budget: {
        type: 'initial',
        maximumWarning: 244 * 1024, // 244kb
        maximumError: 512 * 1024,   // 512kb
      },
    },
  }
})
```

## 🔍 内存优化

### 15. 内存限制配置
```typescript
// package.json
{
  "scripts": {
    "build": "node --max-old-space-size=4096 ./node_modules/@empjs/cli/bin/emp.js build"
  }
}
```

### 16. 垃圾回收优化
```typescript
export default defineConfig(store => {
  return {
    // 减少内存使用
    optimization: {
      splitChunks: {
        chunks: 'all',
        maxSize: 244 * 1024, // 限制块大小
      },
    },
  }
})
```

## 🚀 生产环境优化

### 17. CDN 配置
```typescript
export default defineConfig(store => {
  const isProd = store.mode === 'production'
  
  return {
    publicPath: isProd 
      ? 'https://cdn.example.com/assets/'
      : '/',
    // 资源 CDN 配置
    assetModuleFilename: isProd
      ? 'https://cdn.example.com/assets/[name].[hash:8][ext]'
      : 'assets/[name].[hash:8][ext]',
  }
})
```

### 18. 预加载和预取
```typescript
export default defineConfig(store => {
  return {
    plugins: [
      // 预加载关键资源
      new HtmlWebpackPlugin({
        template: './public/index.html',
        preload: {
          test: /\.js$/,
          include: 'entry',
        },
      }),
    ],
  }
})
```

## 📈 监控和度量

### 19. 构建时间监控
```typescript
export default defineConfig(store => {
  return {
    // 构建统计
    stats: {
      timings: true,
      assets: true,
      entrypoints: true,
      chunks: true,
      performance: true,
      warnings: true,
      errors: true,
    },
  }
})
```

### 20. 自定义监控
```typescript
// emp.config.ts
const startTime = Date.now()

export default defineConfig(store => {
  return {
    plugins: [
      {
        name: 'build-monitor',
        buildEnd() {
          const buildTime = Date.now() - startTime
          console.log(`构建完成，耗时: ${buildTime}ms`)
        },
      },
    ],
  }
})
```

## 🛠️ 故障排除

### 常见性能问题解决

#### 1. 构建缓慢
- 检查是否有不必要的文件包含在构建中
- 优化依赖解析配置
- 启用持久缓存
- 增加并行处理能力

#### 2. 内存泄漏
- 检查插件配置是否有内存泄漏
- 限制 Node.js 进程内存
- 优化大型文件的处理

#### 3. 热更新失败
- 检查 HMR 配置
- 验证文件监听设置
- 确认依赖关系正确

## 📋 最佳实践总结

### 配置优化
- 使用环境特定的配置
- 启用适当的缓存策略
- 配置合理的代码分割

### 开发体验
- 启用源映射进行调试
- 配置热模块替换
- 使用构建分析工具

### 生产优化
- 外部化常用依赖
- 启用资源压缩
- 配置 CDN 加速

这些优化技术确保 EMP CLI 项目在各种环境下都能获得最佳的构建性能和运行效率。
