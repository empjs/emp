# 同项目多端口微前端架构

## 📋 场景描述

在微服务架构或大规模微前端应用中，我们经常需要模拟或部署同一个服务的多个实例，或者在开发环境中启动多个服务节点。EMP CLI 支持通过环境变量动态配置服务端口和应用名称，配合运行时的动态注册能力，实现灵活的微前端架构。

本案例展示了如何使用同一套代码库 (`runtime-18-host`) 启动多个不同端口的服务实例，并在消费端 (`runtime-18-app`) 动态消费这些服务。

## 🏗️ 架构设计

### 1. 服务提供者 (Provider)

服务提供者设计为支持动态端口和动态应用名称。通过命令行参数传入环境变量，决定启动端口和唯一的应用标识。

**核心配置 (runtime-18-host/emp.config.ts):**

```typescript
import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {externalReact, pluginRspackEmpShare} from '@empjs/share'

export default defineConfig(store => {
  // 1. 获取动态端口，默认为 3802
  const port = store.cliOptions.env ? store.cliOptions.env : 3802
  
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        // 2. 动态生成应用名称，确保唯一性
        name: `runtimeHost_${port}`,
        manifest: true,
        exposes: {
          './App': './src/App',
        },
        // ... 其他配置
      }),
    ],
    server: {
      // 3. 设置服务端口
      port,
      open: false,
    },
    // 4. 注入端口变量到代码中
    define: {port: `${port}`},
  }
})
```

**启动方式:**

可以启动多个实例：

```bash
# 启动 3911 端口实例
emp dev --env 3911

# 启动 3912 端口实例
emp dev --env 3912

# 启动 3913 端口实例
emp dev --env 3913
```

### 2. 服务消费者 (Consumer)

消费者应用不再依赖静态的 `remotes` 配置，而是利用 EMP SDK 在运行时动态注册远程服务。这使得应用可以根据配置接口或业务逻辑灵活加载微应用。

**运行时注册 (runtime-18-app/src/App.tsx):**

```typescript
import {loadRemote, registerRemotes} from '@empjs/share/sdk'
import {lazy, Suspense} from 'react'

const host = 'localhost' // 或动态获取 IP

// 1. 动态注册远程服务
registerRemotes([
  {
    name: 'runtimeHost_3911',           // 远程应用名称
    entry: `http://${host}:3911/emp.json`, // 远程入口
    alias: 'r91',                       // 本地别名
  },
  {
    name: 'runtimeHost_3912',
    entry: `http://${host}:3912/emp.json`,
    alias: 'r92',
  },
  {
    name: 'runtimeHost_3913',
    entry: `http://${host}:3913/emp.json`,
    alias: 'r93',
  },
])

// 2. 使用别名加载远程组件
const R91 = lazy(() => loadRemote('r91/App'))
const R92 = lazy(() => loadRemote('r92/App'))
const R93 = lazy(() => loadRemote('r93/App'))

const App = () => (
  <div>
    <Suspense fallback="Loading...">
      <R91 name="Service Node 1" />
      <R92 name="Service Node 2" />
      <R93 name="Service Node 3" />
    </Suspense>
  </div>
)
```

## 🚀 核心优势

1.  **开发灵活性**: 开发者可以轻松启动多个服务副本，模拟集群环境或多租户场景。
2.  **配置解耦**: 消费者不需要在构建时知道所有远程服务的地址，可以在运行时通过接口获取配置并动态注册。
3.  **别名机制**: 通过 `alias` 屏蔽了远程应用及其版本号的复杂性，代码中只需使用统一的逻辑名称。
4.  **SDK 支持**: `@empjs/share/sdk` 提供了标准的 API (`registerRemotes`, `loadRemote`)，使得编程式微前端变得简单可靠。

## 📦 运行时 SDK 详解

EMP 提供了强大的运行时 SDK 支持：

- **registerRemotes(remotes: RemoteEntry[])**: 注册新的远程应用。
    - `name`: 远程应用的唯一名称 (emp.config.ts 中的 name)。
    - `entry`: 远程应用的入口 URL (通常是 emp.json)。
    - `alias`: (可选) 为远程应用设置别名，方便后续调用。
- **loadRemote(scope: string)**: 加载远程模块。
    - 支持使用 `alias/Module` 格式加载。
    - 返回 Promise，可直接配合 `React.lazy` 使用。

## 📝 最佳实践

- **端口管理**: 建议在 CI/CD 管道或本地开发脚本中统一管理端口分配。
- **错误处理**: 在 `loadRemote` 外层包裹 `ErrorBoundary`，以处理网络失败或服务不可用的情况。
- **配置中心**: 生产环境中，建议通过配置中心接口下发远程服务列表，前端获取后调用 `registerRemotes` 初始化。
