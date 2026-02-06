# empRuntime 与构建引用

## empRuntime 结构

```typescript
empRuntime: {
  framework: {
    global: string,      // 全局变量名，如 'EMP_ADAPTER_REACT'
    libs: string[],      // 框架 UMD CDN 列表
  },
  runtime: {
    lib: string,         // @empjs/share sdk.js CDN
  },
  setExternals: (o, global?) => void,  // 自定义 externals
}
```

## 版本与 CDN 速查

| 包 | 用途 | 示例 URL |
|----|------|----------|
| @empjs/cdn-react | React + Router UMD | `https://unpkg.com/@empjs/cdn-react@0.18.0/dist/reactRouter.${store.mode}.umd.js` |
| @empjs/cdn-react-wouter | React + Wouter | `https://cdn.jsdelivr.net/npm/@empjs/cdn-react-wouter@0.0.2/dist/reactRouter.${store.mode}.umd.js` |
| @empjs/share | SDK 运行时 | `https://unpkg.com/@empjs/share@3.11.4/output/sdk.js` |

`store.mode` 为 `development` 或 `production`。

## 构建时 remotes

```typescript
remotes: {
  mfHost: `mfHost@http://${store.server.ip}:6001/emp.json`,
}
```

开发可用 `store.server.ip`，生产替换为实际域名。

## 运行时 registerRemotes

```typescript
import { registerRemotes, loadRemote } from '@empjs/share/sdk'

registerRemotes([
  { name: 'mfHost', entry: 'http://localhost:6001/emp.json' },
])

const Component = lazy(() => loadRemote('mfHost/App'))
```

## forceRemotes

覆盖构建时 remotes，用于本地调试或环境切换：

```typescript
forceRemotes: {
  rtLayout: '$@http://127.0.0.1:4004/emp.json',
},
```

## polyfill 引用

| 场景 | entryCdn |
|------|----------|
| 通用 | `https://unpkg.com/@empjs/polyfill@0.0.2/dist/es.js` |
| 新内核 | `https://unpkg.com/@empjs/polyfill@2025.9.12/dist/c71.js` |

## experiments

```typescript
experiments: {
  asyncStartup: true,  // 异步启动，常用
}
```

## 项目结构速查

| 项目 | 角色 | 端口 | 说明 |
|------|------|------|------|
| tailwind-4 | 单应用 | - | Tailwind v4 + empRuntime |
| mf-host | Host | 6001 | 暴露 App、CountComp、Section |
| mf-app | Remote | 6002 | 消费 mfHost |
| rtHost | Host | 4000 | 消费 rtProvider、rtLayout |
| rtProvider | Remote | 4001 | 暴露 App，消费 rtLayout |
| rtLayout | Remote | 4004 | 暴露 App、logo |
