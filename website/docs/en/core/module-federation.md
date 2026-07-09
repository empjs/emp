# Module Federation

EMP v4 基于官方 Module Federation 2.x 体系。常用配置入口仍是 `pluginRspackEmpShare(...)`。

```ts
import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {externalReact, pluginRspackEmpShare} from '@empjs/share/rspack'

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginRspackEmpShare({
      name: 'mfHost',
      exposes: {
        './App': './src/App',
      },
      empRuntime: {
        version: true,
        setExternals: externalReact,
      },
    }),
  ],
})
```

## 关键概念

- `name`：当前联邦容器名称。
- `exposes`：remote 对外暴露的模块。
- `remotes`：host 消费的远端入口。
- `shared`：跨应用共享依赖。
- `empRuntime.version`：从 package `name` 和 `version` 派生隔离 scope，避免多个版本运行时互相污染。

## 验收重点

构建通过不代表联邦链路一定可用。发布前需要检查 manifest、remote entry、共享依赖版本和浏览器真实消费链路。
