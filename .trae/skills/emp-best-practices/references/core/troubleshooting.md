# EMP CLI 故障排除与调试指南

## 🔍 常见问题诊断

### 1. 模块联邦问题

#### 远程模块未加载
**症状**: 远程组件显示加载失败或空白

**诊断步骤**:
```bash
# 检查远程应用是否运行
curl http://localhost:6001/emp.json

# 检查网络连接
curl -I http://localhost:6001/emp.json

# 验证 emp.json 内容
cat dist/emp.json
```

**解决方案**:
```typescript
// 确保远程应用配置正确
pluginRspackEmpShare({
  name: 'mfHost',
  manifest: true, // 必须启用
  exposes: {
    './App': './src/App',
  },
})

// Host 应用检查远程 URL
remotes: {
  mfHost: `mfHost@http://${store.server.ip}:6001/emp.json`,
}
```

#### 版本冲突
**症状**: React 多实例错误或类型不匹配

**诊断**:
```typescript
// 检查共享依赖配置
shared: {
  react: {
    singleton: true, // 确保单例
    requiredVersion: '18', // 指定版本
    strictVersion: true, // 严格版本检查
  },
}
```

### 2. 构建性能问题

#### 构建缓慢
**诊断命令**:
```bash
# 构建时间分析
emp build --analyze

# 检查缓存状态
emp build --profile

# 内存使用分析
node --inspect ./node_modules/@empjs/cli/bin/emp.js build
```

**优化配置**:
```typescript
export default defineConfig(store => {
  return {
    build: {
      cache: {
        type: 'filesystem',
        cacheDirectory: path.join(__dirname, '.empcache'),
      },
      parallel: true,
      parallelism: require('os').cpus().length - 1,
    },
  }
})
```

#### 内存溢出
**症状**: JavaScript heap out of memory

**解决方案**:
```bash
# 增加 Node.js 内存限制
export NODE_OPTIONS="--max-old-space-size=8192"
emp build
```

```json
// package.json
{
  "scripts": {
    "build": "node --max-old-space-size=8192 ./node_modules/@empjs/cli/bin/emp.js build"
  }
}
```

### 3. 开发服务器问题

#### HMR 不工作
**诊断步骤**:
```typescript
// 检查 HMR 配置
server: {
  hot: true,
  hmr: {
    overlay: true,
    port: 3001,
  },
}

// 验证文件监听
watchOptions: {
  poll: 1000,
  ignored: /node_modules/,
}
```

#### 端口冲突
**解决方案**:
```typescript
export default defineConfig(store => {
  return {
    server: {
      port: 0, // 自动分配端口
      open: true,
    },
  }
})
```

## 🐛 调试技巧

### 4. 源映射调试
```typescript
export default defineConfig(store => {
  return {
    devtool: store.mode === 'development' 
      ? 'eval-cheap-module-source-map' 
      : 'source-map',
  }
})
```

### 5. 构建分析
```typescript
export default defineConfig(store => {
  return {
    debug: {
      rsdoctor: store.cliOptions.analyze,
      showScriptDebug: store.cliOptions.profile,
      loggerLevel: 'verbose',
    },
  }
})
```

### 6. 插件调试
```typescript
// 自定义调试插件
const debugPlugin = () => ({
  name: 'debug-plugin',
  setup: (store) => {
    console.log('Store:', store)
    console.log('Mode:', store.mode)
    console.log('Config:', store.empConfig)
  },
})

export default defineConfig(store => {
  return {
    plugins: [debugPlugin()],
  }
})
```

## 🔧 具体错误场景

### 7. TypeScript 类型错误

#### 远程模块类型缺失
**错误**: Cannot find module 'mfHost/App'

**解决方案**:
```typescript
// 生成类型声明
pluginRspackEmpShare({
  name: 'mfHost',
  dts: { 
    generateTypes: true,
    outputDir: 'types',
  },
  manifest: true,
})
```

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "mfHost/*": ["./types/mfHost/*"],
    },
  }
}
```

### 8. CSS 样式问题

#### TailwindCSS 不生效
**诊断**:
```bash
# 检查 PostCSS 配置
npx postcss --config postcss.config.js src/style.css

# 验证 Tailwind 构建
npx tailwindcss --help
```

**配置检查**:
```typescript
// 确保插件正确配置
pluginTailwindcss({
  // 检查 PostCSS 插件链
  customPostcssPlugins: [
    ['postcss-import', {}],
    ['@tailwindcss/postcss', {}],
    ['autoprefixer', {}],
  ],
})
```

### 9. 依赖冲突

#### 重复依赖检测
```bash
# 分析依赖重复
npm ls react
npm ls @empjs/share

# 检查对等依赖
npm ls --depth=0
```

**解决方案**:
```typescript
// 统一依赖版本
peerDependencies: {
  'react': '^18.0.0',
  'react-dom': '^18.0.0',
}

// 使用 npm resolutions
"resolutions": {
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
}
```

## 🚨 高级故障排除

### 10. 运行时错误处理

#### 远程组件加载失败
```typescript
class RemoteErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Remote component error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    })

    // 发送错误报告
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: {
          component: { name: 'RemoteComponent' },
          federation: { remote: 'mfHost' },
        },
      })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h3>远程组件加载失败</h3>
          <p>错误信息: {this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            重新加载
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
```

### 11. 网络问题诊断

#### CDN 资源加载失败
```typescript
// CDN 回退策略
const loadSDK = () => {
  const primaryCDN = 'https://unpkg.com/@empjs/share@3.11.4/output/sdk.js'
  const fallbackCDN = 'https://cdn.jsdelivr.net/npm/@empjs/share@3.11.4/output/sdk.js'
  
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = primaryCDN
    script.onload = resolve
    script.onerror = () => {
      script.src = fallbackCDN
      script.onload = resolve
      script.onerror = reject
    }
    document.head.appendChild(script)
  })
}
```

### 12. 性能监控

#### 构建性能监控
```typescript
const performancePlugin = () => ({
  name: 'performance-monitor',
  buildStart() {
    this.startTime = Date.now()
    console.log('🚀 构建开始')
  },
  buildEnd() {
    const buildTime = Date.now() - this.startTime
    console.log(`✅ 构建完成，耗时: ${buildTime}ms`)
    
    // 性能警告
    if (buildTime > 30000) {
      console.warn('⚠️ 构建时间超过 30 秒，建议优化')
    }
  },
})
```

## 🛠️ 开发工具

### 13. 调试脚本
```bash
#!/bin/bash
# debug-emp.sh

echo "🔍 EMP CLI 调试工具"

# 检查版本
echo "📦 检查依赖版本..."
emp --version
node --version
npm --version

# 清理缓存
echo "🧹 清理缓存..."
rm -rf .empcache
rm -rf dist
rm -rf node_modules/.cache

# 详细构建
echo "🔨 详细构建..."
emp build --verbose --profile

# 分析结果
echo "📊 构建分析..."
emp build --analyze
```

### 14. 健康检查
```typescript
// health-check.js
const fs = require('fs')
const path = require('path')

const checkEMPHealth = () => {
  const checks = [
    { name: '配置文件', check: () => fs.existsSync('emp.config.ts') },
    { name: 'package.json', check: () => fs.existsSync('package.json') },
    { name: '源代码目录', check: () => fs.existsSync('src') },
    { name: '依赖安装', check: () => fs.existsSync('node_modules') },
  ]

  const results = checks.map(({ name, check }) => ({
    name,
    status: check() ? '✅' : '❌',
  }))

  console.log('🏥 EMP 项目健康检查')
  results.forEach(({ name, status }) => {
    console.log(`${status} ${name}`)
  })

  const allPassed = results.every(r => r.status === '✅')
  console.log(allPassed ? '\n✅ 项目健康' : '\n❌ 存在问题')
}

checkEMPHealth()
```

## 📋 故障排除清单

### 开发环境检查
- [ ] Node.js 版本 >= 16
- [ ] npm/yarn 版本兼容
- [ ] 依赖已正确安装
- [ ] 端口未被占用
- [ ] 防火墙设置正确

### 配置文件检查
- [ ] emp.config.ts 语法正确
- [ ] 插件配置正确
- [ ] 路径别名有效
- [ ] 环境变量设置

### 构建检查
- [ ] 缓存目录权限
- [ ] 磁盘空间充足
- [ ] 内存限制设置
- [ ] 并行进程配置

### 部署检查
- [ ] 生产环境配置
- [ ] CDN 资源可访问
- [ ] 环境变量正确
- [ ] SSL 证书有效

这个故障排除指南帮助开发者快速诊断和解决 EMP CLI 项目中的常见问题，提供系统化的调试方法和工具。
