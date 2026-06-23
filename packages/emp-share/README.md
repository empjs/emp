# @empjs/share

`@empjs/share` 是 EMP 的 Module Federation 封装包，提供 Rspack 插件、EMP runtime、SDK facade、React/Vue adapter 和浏览器端 runtime bundle。

v4 版本已切到官方 Module Federation 2.x：

- `@module-federation/rspack`
- `@module-federation/runtime`
- `@module-federation/sdk`

同时保留 `pluginRspackEmpShare(...)` 用户侧 API，不要求业务项目重写现有 `emp.config.ts`。

## 环境要求

```bash
node ^20.19.0 || >=22.12.0
```

## 安装

```bash
pnpm add @empjs/share
```

React 项目通常还需要：

```bash
pnpm add @empjs/cli @empjs/plugin-react
```

## 导出入口

| 入口 | 说明 |
| --- | --- |
| `@empjs/share` | 默认导出，包含 share 相关公共 API |
| `@empjs/share/rspack` | Rspack Module Federation 插件入口 |
| `@empjs/share/sdk` | 业务侧 SDK facade，常用 `loadRemote`、`registerRemotes` |
| `@empjs/share/runtime` | EMP runtime 实例封装 |
| `@empjs/share/mfRuntime` | 透出官方 Module Federation runtime |
| `@empjs/share/adapter` | React adapter |
| `@empjs/share/adapterVue` | Vue adapter |
| `@empjs/share/forceRemote` | `forceRemotes` runtime plugin |
| `@empjs/share/library` | 浏览器端 IIFE bundle，对应 `output/sdk.js` |
| `@empjs/share/react` / `@empjs/share/vue` | React / Vue framework 配置辅助入口 |

## Rspack 插件

推荐从 `@empjs/share/rspack` 使用：

```ts
import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import pluginRspackEmpShare, {externalReact} from '@empjs/share/rspack'

export default defineConfig(store => {
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        name: 'mfHost',
        exposes: {
          './App': './src/App',
          './CountComp': './src/CountComp',
        },
        remotes: {
          mfRemote: `mfRemote@http://${store.server.ip}:6002/emp.json`,
        },
        shared: {
          react: {singleton: true},
          'react-dom': {singleton: true},
        },
        manifest: true,
        dts: {
          generateTypes: true,
          consumeTypes: true,
        },
        empRuntime: {
          framework: {
            global: 'EMP_ADAPTER_REACT',
            libs: [`https://unpkg.com/@empjs/cdn-react@0.19.1/dist/react.${store.mode}.umd.js`],
          },
          runtime: {
            lib: `http://${store.server.ip}:2100/sdk.js`,
          },
          setExternals: externalReact,
        },
      }),
    ],
    server: {
      port: 6001,
      open: false,
    },
  }
})
```

## `empRuntime`

`empRuntime` 用于把框架库和 Module Federation runtime 外置到浏览器全局变量，降低业务包体并兼容旧项目接入。

```ts
pluginRspackEmpShare({
  name: 'mfHost',
  empRuntime: {
    framework: {
      global: 'EMP_ADAPTER_REACT',
      libs: ['https://unpkg.com/@empjs/cdn-react@0.19.1/dist/react.development.umd.js'],
    },
    runtime: {
      lib: 'http://localhost:2100/sdk.js',
    },
    setExternals: externalReact,
  },
})
```

如果不传 `runtime.lib`，插件会把 `@empjs/share/library` 内置到构建入口；如果传入远程地址，插件会自动注入 `<script>` 并把 `@module-federation/runtime`、`@module-federation/sdk` external 到指定全局 runtime。

## `@empjs/share/sdk` 类型

业务代码推荐通过 `@empjs/share/sdk` 调用 Module Federation runtime：

```ts
import {loadRemote, registerRemotes} from '@empjs/share/sdk'

const RemoteApp = await loadRemote('mfHost/App')
```

v4 会在启用 `dts.consumeTypes` 时把 `@empjs/share/sdk` 自动合并进 Module Federation 的 runtime 类型包列表。消费侧生成的 `@mf-types/index.d.ts` 会额外包含：

```ts
declare module '@empjs/share/sdk' {
  export function loadRemote<T extends string, Y>(packageName: T): Promise<Y>
}
```

这样业务侧从 `@empjs/share/sdk` 调用 `loadRemote` 时，也能获得远程模块类型提示。

如果项目已经配置了自定义 `dts.consumeTypes.runtimePkgs`，EMP 会保留已有配置并追加 `@empjs/share/sdk`。

## `forceRemotes`

`forceRemotes` 用于在运行时强制替换 remote 入口，常见于本地调试、灰度验证和版本覆盖：

```ts
pluginRspackEmpShare({
  name: 'rtHost',
  remotes: {
    rtLayout: '$@http://localhost:4004/emp.json',
  },
  forceRemotes: {
    rtLayout: '$@http://127.0.0.1:4004/emp.json',
  },
})
```

插件内部会通过 `@empjs/share/forceRemote` 注册 runtime plugin，并使用 package export 解析入口路径。

## Runtime 直接调用

`@empjs/share/runtime` 适合手动初始化 remote，再用 adapter 接入不同 React 版本或旧项目：

```tsx
import React from 'react'
import ReactDOM from 'react-dom'
import {reactAdapter} from '@empjs/share/adapter'
import empRuntime from '@empjs/share/runtime'

empRuntime.init({
  name: 'federationRuntimeDemo',
  remotes: [
    {
      name: 'mfHost',
      entry: 'http://localhost:6001/emp.js',
    },
  ],
  shared: reactAdapter.shared,
})

const MfApp = reactAdapter.adapter(empRuntime.load('mfHost/App'))

const LegacyApp = () => <MfApp />
const LegacyRoot = reactAdapter.adapter(LegacyApp, 'default', React, ReactDOM)
```

## Browser bundle

`@empjs/share/library` 对应构建产物 `output/sdk.js`，包含：

- `MFRuntime`
- `MFSDK`
- `reactAdapter`
- `runtime`

本地启动：

```bash
pnpm --filter @empjs/share start
```

默认端口为 `2100`，可通过以下地址引用：

```html
<script src="http://localhost:2100/sdk.js"></script>
```

## 开发命令

```bash
pnpm --filter @empjs/share build
pnpm --filter @empjs/share dev
pnpm --filter @empjs/share start
```

回归验证：

```bash
pnpm --filter @empjs/share exec tsc --noEmit --pretty false
node packages/emp-share/test/dts-runtime-pkgs.test.mjs
```

真实类型消费链路可使用 `mf-host` + `mf-app` 示例验证：

```bash
pnpm --filter mf-host build
pnpm --filter mf-host start
pnpm --filter mf-app dev
```

完成后检查：

```bash
rg 'declare module "@empjs/share/sdk"' projects/mf-app/@mf-types/index.d.ts
```
