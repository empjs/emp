# 命令行工具

本章节详细介绍 @empjs/cli 提供的所有命令行工具及其选项。

## 命令概览

EMP CLI 提供以下核心命令：

| 命令 | 说明 | 常用场景 |
|------|------|----------|
| `emp dev` | 启动开发服务器 | 本地开发调试 |
| `emp build` | 构建生产代码 | 生产部署 |
| `emp serve` | 预览构建结果 | 本地预览生产版本 |
| `emp dts` | 拉取远程类型声明 | 模块联邦类型同步 |
| `emp init` | 初始化项目 | 创建新项目 |

## emp dev

启动开发服务器，支持热模块替换（HMR）和快速增量编译。

### 基本用法

```bash
emp dev
```

### 选项

#### `-e, --env <env>`

指定部署环境，可选值：`dev`、`test`、`prod`

```bash
# 开发环境
emp dev --env dev

# 测试环境
emp dev --env test

# 生产环境（不常用，通常用 build）
emp dev --env prod
```

**说明**：
- 环境变量会注入到 `process.env.EMP_ENV` 和 `import.meta.env.EMP_ENV`
- 可以在配置文件中通过 `store.env` 访问

#### `-rd, --doctor`

开启 RsDoctor 性能分析工具

```bash
emp dev --doctor
```

**说明**：
- 会在浏览器中打开性能分析面板
- 可以查看编译耗时、模块依赖等信息
- 也可以在配置文件中通过 `debug.rsdoctor` 配置

**配置示例**：

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

#### `-h, --hot`

启用热模块替换（HMR）

```bash
emp dev --hot
```

**说明**：
- 默认已启用，此选项用于显式声明
- 可以在配置文件中通过 `server.hot` 配置

#### `-o, --open`

自动打开浏览器

```bash
emp dev --open
```

**说明**：
- 默认不打开，使用此选项会在服务启动后自动打开浏览器
- 可以在配置文件中通过 `server.open` 配置

**配置示例**：

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

#### `-t, --ts`

生成类型声明文件

```bash
emp dev --ts
```

**说明**：
- 用于模块联邦场景，生成 `.d.ts` 文件
- 类型文件会输出到 `dist/@mf-types` 目录

#### `-pr, --profile`

统计模块编译耗时

```bash
emp dev --profile
```

**说明**：
- 会在控制台输出每个模块的编译时间
- 用于性能分析和优化

#### `-cl, --clearLog <clearLog>`

控制是否清空日志

```bash
# 清空日志（默认）
emp dev --clearLog true

# 保留日志
emp dev --clearLog false
```

**说明**：
- 默认为 `true`，每次编译会清空控制台
- 设置为 `false` 可以保留历史日志

#### `-ev, --env-vars <key=value>`

定义自定义环境变量

```bash
# 单个环境变量
emp dev --env-vars API_URL=https://api.example.com

# 多个环境变量
emp dev --env-vars API_URL=https://api.example.com --env-vars DEBUG=true
```

**说明**：
- 环境变量会注入到 `process.env` 和 `import.meta.env`
- 可以在代码中直接使用

**使用示例**：

```typescript
// 在代码中使用
const apiUrl = process.env.API_URL || 'http://localhost:3000'
console.log('API URL:', apiUrl)
```

### 完整示例

```bash
# 开发环境 + 性能分析 + 自动打开浏览器
emp dev --env dev --doctor --open

# 测试环境 + 自定义环境变量
emp dev --env test --env-vars API_URL=https://test-api.example.com

# 生成类型声明 + 保留日志
emp dev --ts --clearLog false
```

### 配置文件热重载

开发模式下，EMP CLI 会自动监听 `emp-config.ts` 的变化：

```typescript
// 修改配置文件后会自动重启服务器
export default defineConfig(store => {
  return {
    server: {
      port: 9000  // 修改端口后自动重启
    }
  }
})
```

**特性**：
- 检测文件内容实际变化（空保存不会触发重启）
- 自动清除配置缓存
- 保持浏览器连接状态

## emp build

构建生产代码，进行代码优化和压缩。

### 基本用法

```bash
emp build
```

### 选项

#### `-e, --env <env>`

指定部署环境

```bash
emp build --env prod
```

#### `-rd, --doctor`

开启性能分析

```bash
emp build --doctor
```

#### `-a, --analyze`

生成包体积分析报告

```bash
emp build --analyze
```

**说明**：
- 会在浏览器中打开 webpack-bundle-analyzer 报告
- 可以查看每个模块的大小和依赖关系
- 用于优化包体积

**报告内容**：
- 模块大小（原始大小、Gzip 后大小）
- 模块依赖树
- 重复模块检测
- 代码分割效果

#### `-t, --ts`

生成类型声明文件

```bash
emp build --ts
```

**说明**：
- 用于模块联邦场景
- 生成的类型文件可供其他项目使用

#### `-pr, --profile`

统计模块编译耗时

```bash
emp build --profile
```

#### `-cl, --clearLog <clearLog>`

控制是否清空日志

```bash
emp build --clearLog false
```

#### `-w, --watch`

Watch 模式构建

```bash
emp build --watch
```

**说明**：
- 文件变化时自动重新构建
- 适用于需要持续构建的场景

#### `-sv, --serve`

Watch 模式下启动预览服务器

```bash
emp build --watch --serve
```

**说明**：
- 必须配合 `--watch` 使用
- 会在构建完成后自动启动预览服务器
- 文件变化时自动重新构建并刷新

#### `-ev, --env-vars <key=value>`

定义自定义环境变量

```bash
emp build --env-vars API_URL=https://api.example.com
```

### 完整示例

```bash
# 生产构建 + 包分析
emp build --env prod --analyze

# Watch 模式 + 预览服务器
emp build --watch --serve

# 生成类型声明 + 性能分析
emp build --ts --profile

# 自定义环境变量
emp build --env-vars API_URL=https://api.example.com --env-vars VERSION=1.0.0
```

### 构建输出

构建完成后会显示：

```
✓ Build completed in 3.2s

File                     Size      Gzipped
dist/index.js           245.6 KB   68.2 KB
dist/index.css          12.3 KB    3.1 KB
dist/vendors.js         156.8 KB   45.6 KB
```

## emp serve

预览构建后的生产代码。

### 基本用法

```bash
emp serve
```

**前提条件**：
- 必须先执行 `emp build` 生成构建产物
- `dist` 目录必须存在

### 选项

#### `-e, --env <env>`

指定部署环境

```bash
emp serve --env prod
```

#### `-cl, --clearLog <clearLog>`

控制是否清空日志

```bash
emp serve --clearLog false
```

#### `-ev, --env-vars <key=value>`

定义自定义环境变量

```bash
emp serve --env-vars API_URL=https://api.example.com
```

### 服务器特性

1. **静态文件服务**
   - 提供 `dist` 目录下的所有文件

2. **SPA 路由支持**
   - 所有非静态文件请求返回 `index.html`
   - 支持前端路由（React Router、Vue Router 等）

3. **压缩支持**
   - 自动启用 Gzip 压缩
   - 减少传输大小

4. **CORS 支持**
   - 默认启用 CORS
   - 支持跨域请求

5. **HTTPS 支持**
   - 根据配置自动启用 HTTPS
   - 支持 HTTP/2

### 完整示例

```bash
# 基本预览
emp serve

# 指定环境
emp serve --env prod

# 自定义环境变量
emp serve --env-vars API_URL=https://api.example.com
```

## emp dts

拉取远程模块联邦项目的类型声明文件。

### 基本用法

```bash
emp dts
```

### 选项

#### `-p, --typingsPath <typingsPath>`

指定类型文件下载目录

```bash
emp dts --typingsPath src/@mf-types
```

#### `-e, --env <env>`

指定部署环境

```bash
emp dts --env prod
```

### 使用场景

在模块联邦场景中，消费方需要获取提供方的类型声明：

```typescript
// emp-config.ts
export default defineConfig(store => {
  return {
    plugins: [
      pluginRspackEmpShare({
        name: 'consumer',
        remotes: {
          'host': 'host@http://localhost:8001/emp.js'
        },
        dts: {
          consumeTypes: true,
          typingsPath: 'src/@mf-types'
        }
      })
    ]
  }
})
```

## emp init

初始化 EMP 项目（开发中）。

### 基本用法

```bash
emp init
```

### 选项

#### `-d, --data [data]`

指定项目数据（JSON 文件路径或 HTTP 地址）

```bash
emp init --data ./project-config.json
emp init --data https://example.com/config.json
```

## 通用选项

所有命令都支持以下通用选项：

### `-v, --version`

显示版本号

```bash
emp -v
emp --version
```

### `-h, --help`

显示帮助信息

```bash
emp --help
emp dev --help
emp build --help
```

## 环境变量

EMP CLI 支持以下环境变量：

### `NODE_ENV`

Node.js 环境变量

```bash
NODE_ENV=production emp build
```

### `EMP_ENV`

EMP 自定义环境变量

```bash
EMP_ENV=test emp dev
```

### `DEBUG`

启用调试模式

```bash
DEBUG=emp:* emp dev
```

## 配置文件优先级

命令行选项 > 环境变量 > 配置文件 > 默认值

```bash
# 命令行选项优先级最高
emp dev --env test  # 覆盖配置文件中的 env 设置
```

## 脚本配置最佳实践

在 `package.json` 中配置常用脚本：

```json
{
  "scripts": {
    "dev": "emp dev",
    "dev:test": "emp dev --env test",
    "dev:analyze": "emp dev --doctor",
    "build": "emp build",
    "build:test": "emp build --env test",
    "build:analyze": "emp build --analyze",
    "build:watch": "emp build --watch --serve",
    "start": "emp serve",
    "type-check": "tsc --noEmit"
  }
}
```

## 常见使用场景

### 1. 本地开发

```bash
# 基础开发
pnpm dev

# 开发 + 自动打开浏览器
pnpm dev --open

# 开发 + 性能分析
pnpm dev --doctor
```

### 2. 测试环境

```bash
# 测试环境开发
pnpm dev --env test --env-vars API_URL=https://test-api.example.com

# 测试环境构建
pnpm build --env test
```

### 3. 生产构建

```bash
# 基础构建
pnpm build

# 构建 + 包分析
pnpm build --analyze

# 构建 + 类型生成
pnpm build --ts
```

### 4. 持续构建

```bash
# Watch 模式 + 预览
pnpm build --watch --serve
```

### 5. 性能优化

```bash
# 开发时性能分析
pnpm dev --doctor --profile

# 构建时包分析
pnpm build --analyze
```

## 调试技巧

### 1. 查看详细日志

```bash
# 保留所有日志
emp dev --clearLog false

# 查看 Rspack 配置
emp dev  # 然后查看 debug.showRsconfig 配置
```

### 2. 性能分析

```bash
# 使用 RsDoctor
emp dev --doctor

# 查看模块编译时间
emp dev --profile
```

### 3. 包体积分析

```bash
# 生成分析报告
emp build --analyze
```

## 下一步

- 📖 查看 [配置详解](./04-configuration.md) 了解配置选项
- 🔧 阅读 [开发服务器](./06-dev-server.md) 了解服务器配置
- 🚀 探索 [构建系统](./07-build-system.md) 优化构建性能
