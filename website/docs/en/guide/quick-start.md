# 安装与最小配置

React 项目可以安装 CLI、React 插件和共享依赖能力：

```bash
pnpm add -D @empjs/cli@rc @empjs/plugin-react@rc @empjs/share@rc
```

Vue 3 项目使用对应框架插件：

```bash
pnpm add -D @empjs/cli@rc @empjs/plugin-vue3@rc @empjs/share@rc
```

最小配置保持 EMP 熟悉的 `defineConfig(...)` 形态：

```ts
import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {pluginRspackEmpShare} from '@empjs/share/rspack'

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginRspackEmpShare({
      name: 'host',
      shared: {
        react: {singleton: true},
        'react-dom': {singleton: true},
      },
    }),
  ],
})
```

## 构建验证

```bash
pnpm emp build
```

构建后重点检查：

- 是否生成联邦 manifest。
- remote 暴露模块是否符合约定。
- host 侧 remotes 地址是否指向正确环境。
- 类型声明是否能被消费项目识别。
