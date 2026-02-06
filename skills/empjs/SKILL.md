---
name: empjs
description: EMP 全栈技能：React 19 脚手架脚本、emp.config.ts 配置、Tailwind v4、微前端 empRuntime、@empjs/valtio 状态管理、React 性能优化。适用于创建 EMP 应用、配置模块联邦、状态管理、性能优化等场景。
---

# EMP 全栈技能

整合 EMP React 项目、微前端、Tailwind v4、状态管理、性能优化于一体。全部内容已本地化。

## 一、React 19 Startkit 脚手架

快速创建 EMP React 19 项目。在项目根目录执行：

```bash
node skills/empjs/scripts/create-emp-react19.js <项目名> [目标目录]
```

示例：

```bash
node skills/empjs/scripts/create-emp-react19.js my-app
node skills/empjs/scripts/create-emp-react19.js my-app ./projects
```

生成后执行 `cd <项目名> && pnpm install && pnpm dev`。

生成结构：`package.json`、`emp.config.ts`、`tsconfig.json`、`src/index.html`、`src/index.tsx`、`src/bootstrap.tsx`、`src/App.tsx`、`src/style.css`、`src/global.d.ts`。

## 二、快速开始

### 最少配置

```typescript
// emp.config.ts
import { defineConfig } from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'

export default defineConfig(store => ({
  plugins: [pluginReact()],
  server: { port: 8000, open: false },
}))
```

### 必需文件结构

```
project/
├── emp.config.ts
├── package.json
├── src/
│   └── index.tsx     
└── tsconfig.json     # extends: "@empjs/cli/tsconfig/react"
```

### 启动命令

```bash
pnpm dev      # 开发
pnpm build    # 构建
pnpm start    # 预览
```

## 三、package.json scripts 补全

```json
{
  "scripts": {
    "dev": "emp dev",
    "dev:open": "emp dev --open",
    "dev:test": "emp dev --env test",
    "dev:prod": "emp dev --env prod",
    "dev:doctor": "emp dev --doctor",
    "dev:profile": "emp dev --profile",
    "build": "emp build",
    "build:test": "emp build --env test",
    "build:prod": "emp build --env prod",
    "build:watch": "emp build --watch --serve",
    "build:ts": "emp build --ts",
    "build:stat": "emp build --analyze",
    "build:doctor": "emp build --doctor",
    "build:profile": "emp build --profile",
    "start": "emp serve",
    "serve": "emp serve",
    "stat": "emp build --analyze",
    "dts": "emp dts",
    "emp": "emp"
  }
}
```

## 四、emp.config.ts 核心配置

| 配置 | 说明 | 默认 |
|------|------|------|
| `plugins` | 插件数组，React 需 `pluginReact()` | - |
| `server.port` | 端口 | 8000 |
| `appSrc` | 源码目录 | `src` |
| `appEntry` | 入口文件 | `index.{ts,tsx,jsx,js}` |

详见 [references/empconfig.md](references/empconfig.md)。

## 五、插件

### 必需

- `@empjs/plugin-react`：React 项目必需

### 可选

- `@empjs/plugin-tailwindcss`：Tailwind v4 默认，`@import "tailwindcss"`
- `@empjs/plugin-lightningcss`：LightningCSS，px_to_rem、px_to_viewport
- `@empjs/share`：模块联邦共享

## 六、Tailwind v4

```bash
pnpm add @empjs/plugin-tailwindcss tailwindcss
```

```typescript
plugins: [pluginReact(), pluginTailwindcss()]
```

```css
/* src/style.css */
@import "tailwindcss";
```

详见 [references/tailwind-v4.md](references/tailwind-v4.md)。

## 七、微前端 empRuntime

### 标准 React 模板

```typescript
import { externalReact, pluginRspackEmpShare } from '@empjs/share'

pluginRspackEmpShare({
  empRuntime: {
    framework: {
      global: 'EMP_ADAPTER_REACT',
      libs: [`https://unpkg.com/@empjs/cdn-react@0.18.0/dist/reactRouter.${store.mode}.umd.js`],
    },
    runtime: {
      lib: `https://unpkg.com/@empjs/share@3.11.4/output/sdk.js`,
    },
    setExternals: externalReact,
  },
})
```

### Host 暴露 / Remote 消费

```typescript
// Host
exposes: { './App': './src/App' }

// Remote
remotes: { mfHost: `mfHost@http://${store.server.ip}:6001/emp.json` }
```

### 运行时注册

```typescript
import { loadRemote, registerRemotes } from '@empjs/share/sdk'

registerRemotes([{ name: 'mfHost', entry: 'http://localhost:6001/emp.json' }])
const Host = lazy(() => loadRemote('mfHost/App'))
```

详见 [references/runtime-build.md](references/runtime-build.md)。

## 八、状态管理 @empjs/valtio

```bash
pnpm add @empjs/valtio
```

| 场景 | 使用 |
|------|------|
| 全局单例 | `createStore(initialState)` |
| 组件内局部 | `useStore(initialState)` |

**调用闭环**：读用 `snap`，写用 `store.set` / `store.update`。勿直接读 `store.xxx` 做渲染。

完整指南见 [references/valtio-skill.md](references/valtio-skill.md)，用法见 [references/valtio-usage.md](references/valtio-usage.md)，API 见 [references/valtio-api.md](references/valtio-api.md)，示例见 [references/valtio-examples.md](references/valtio-examples.md)。

## 九、React 性能优化

**状态管理**：用 valtio 替代 useState/useReducer/useCallback。

**其他规则**（适配 React 18/19）：

- 消除瀑布：`Promise.all()`、Suspense
- 包体积：直接导入、`React.lazy`、hydration 后加载第三方
- 渲染：`content-visibility: auto`、三元条件、Activity（React 19）
- JS：Set/Map 查找、localStorage 缓存、`toSorted()`、早 return

详见 [references/react-performance.md](references/react-performance.md)。

## 十、参考索引

| 文档 | 内容 |
|------|------|
| [empconfig.md](references/empconfig.md) | emp.config.ts 完整配置 |
| [tailwind-v4.md](references/tailwind-v4.md) | Tailwind v4 配置 |
| [runtime-build.md](references/runtime-build.md) | empRuntime、remotes、polyfill |
| [valtio-skill.md](references/valtio-skill.md) | @empjs/valtio 完整使用指南（本地化自 valtio-best-practices） |
| [valtio-usage.md](references/valtio-usage.md) | valtio 按用法说明 |
| [valtio-api.md](references/valtio-api.md) | valtio API 与类型 |
| [valtio-examples.md](references/valtio-examples.md) | valtio 示例索引 |
| [react-performance.md](references/react-performance.md) | React 性能规则 |
| [examples.md](references/examples.md) | 配置示例 |
| [startkit.md](references/startkit.md) | React 19 脚手架说明 |

### 脚本

| 脚本 | 用途 |
|------|------|
| [scripts/create-emp-react19.js](scripts/create-emp-react19.js) | 创建 EMP React 19 项目脚手架 |
