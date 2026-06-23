# EMP v4 Rspack 2 升级设计

## 摘要

EMP v4 用于承载这次构建底座大版本升级：最低运行环境对齐 Rspack 2 的 Node `^20.19.0 || >=22.12.0` 要求，包管理器统一到 pnpm 10，核心构建器升级到 Rspack 2，并把 Module Federation 迁移到官方 2.x Rspack 集成链路。

这次升级同时清理 `@empjs/share` 对历史 fork 包 `@empjs/module-federation-rspack` 的依赖。后续 `@empjs/share` 应直接基于官方 Module Federation Rspack 插件实现 EMP 的封装能力。

EMP v4 定位为 **ESM-first**，不是 **ESM-only**。v4 会保留 CJS exports 和 CJS 构建产物，避免把 Rspack 2 迁移、Module Federation 2.x 迁移、全仓 ESM-only 三类风险叠在同一次发布里。

## 目标

- 以 EMP v4 作为 Rspack 2 迁移的大版本发布线。
- 开发环境和发布包 engines 统一要求 Node `^20.19.0 || >=22.12.0`。
- 根工程 pnpm 统一到 `10.x`。
- `@empjs/cli` 升级到 Rspack 2 兼容依赖。
- `@empjs/share` 移除 `@empjs/module-federation-rspack` fork 依赖。
- `@empjs/share` 迁移到官方 Module Federation 2.x Rspack 集成。
- 保持现有 `pluginRspackEmpShare(...)` 用户侧 API 不变。
- v4 保留 CJS 兼容出口。
- 验证矩阵必须覆盖 package 声明、lockfile 和实际安装树，避免三者不一致。

## 非目标

- v4 不做全仓 ESM-only。
- v4 不要求业务项目重写已有 `emp.config.ts` 里的 `pluginRspackEmpShare(...)` 调用。
- v4 不重构整个 `@empjs/chain` API。
- v4 不移除 `@empjs/chain` 里基于 `require` 的插件序列化机制。
- v4 不继续把历史 Module Federation fork 包作为长期依赖。

## 当前上下文

当前 workspace 根包、`@empjs/cli`、`@empjs/share` 已经声明 `"type": "module"`，但发布面仍然暴露 CJS 入口，很多 package 也仍然同时构建 ESM 和 CJS。这是现有兼容面，不能在 Rspack 2 迁移时直接删除。

当前关键依赖状态如下：

- `@empjs/cli` 依赖 `@rspack/core@1.7.4` 和 `@rspack/dev-server@1.2.1`。
- `@empjs/plugin-react` 依赖 `@rspack/plugin-react-refresh@1.6.0`。
- `@empjs/share` 声明依赖 `@empjs/module-federation-rspack@0.22.5`、`@module-federation/runtime@0.23.0`、`@module-federation/sdk@0.23.0`。

历史检查中出现过 package 声明、lockfile、实际 `node_modules` 解析结果不一致的问题。因此实施时不能只看 `package.json` 或 lockfile，必须用 `pnpm list` 和实际解析结果复核。

## 版本策略

EMP v4 是这次迁移的大版本线。

- 根工程增加或更新 `packageManager`，统一到 pnpm 10，例如 `pnpm@10.33.0`。
- 对外发布包进入 `4.0.0` 版本线。至少包括 `@empjs/cli`、`@empjs/share`、核心插件包、`@empjs/chain` 等 v4 发布面。
- 根工程和发布包 engines 的 Node 要求统一为 `^20.19.0 || >=22.12.0`。
- 根工程 engines 的 pnpm 要求统一为 `10.x`。

v4 的 breaking changes 明确为：

- Node `^20.19.0 || >=22.12.0` 基线。
- pnpm 10 基线。
- Rspack 2 运行时和配置兼容。
- `@empjs/share` 使用官方 Module Federation 2.x Rspack 集成。

## 依赖策略

`@empjs/cli` 迁移到 Rspack 2 兼容依赖：

- `@rspack/core`：`^2.0.0`
- `@rspack/dev-server`：兼容 `2.x`
- `@rspack/plugin-react-refresh`：兼容 `2.x`，归属在 `@empjs/plugin-react`

`@empjs/share` 移除：

- `@empjs/module-federation-rspack`

`@empjs/share` 改用官方 Module Federation 2.x 依赖：

- 优先使用 `@module-federation/rspack` 作为 Rspack 插件来源。
- `@module-federation/runtime` 和 `@module-federation/sdk` 使用同一条 2.x 版本线。
- 只有在最终 API 检查确认 `dts`、`manifest` 或 runtime plugin 行为必须依赖增强入口时，才切换到 `@module-federation/enhanced/rspack`。

Rspack 相关包不要求机械统一到同一个 patch 版本。`@rspack/core`、`@rspack/dev-server`、`@rspack/plugin-react-refresh` 的最新 patch 线不同，实施时以 peer 兼容为准。

## `@empjs/share` 联邦设计

`@empjs/share` 对外保持现有插件 API：

```ts
pluginRspackEmpShare({
  name,
  remotes,
  exposes,
  shared,
  dts,
  manifest,
  empRuntime,
  forceRemotes,
})
```

内部实现上，`packages/emp-share/src/helper/rspack.ts` 不再从 `@empjs/module-federation-rspack` 导出 `ModuleFederationPlugin`，而是改为从官方 Module Federation Rspack 集成导入。

如果官方插件选项和 EMP 当前选项结构不完全一致，新增一个很薄的本地 adapter，在构造官方插件前做字段归一。这个 adapter 只服务 `@empjs/share` 内部，不发展成新的 fork。

历史 fork patch 的替代原则：

- EMP 继续通过 `@empjs/share/sdk` 作为用户侧 SDK facade。
- 类型同步继续基于官方 Module Federation 2.x DTS 能力实现。
- EMP 特有兼容逻辑放在 `@empjs/share` 内部维护，不再通过改名外部 fork 包解决。

## Runtime Plugin 路径解析

当前部分代码在 ESM 输出里依赖 `require.resolve(...)`。v4 可以保留仍然安全的内部用法，但 Rspack 2 和 pure ESM 依赖会让包路径解析更敏感。

对 `@empjs/share`，`forceRemotes` 使用的 runtime plugin 路径解析应集中封装，例如：

```ts
resolvePackageExport('@empjs/share/forceRemote')
```

这个 helper 可以使用 Node 20.19+ / 22.12+ 兼容的 ESM 解析能力，例如 `import.meta.resolve(...)`，并在需要传给 Rspack 插件选项时把 `file://` URL 归一成文件系统路径。

这样可以保持 `forceRemotes` 行为稳定，同时避免在联邦插件逻辑里散落多个 `require.resolve(...)`。

## Rspack 2 兼容检查点

Rspack 2 是 pure ESM，官方 Node 要求为 `^20.19.0 || >=22.12.0`。EMP v4 采用同一最低运行基线。

实施时必须逐项审计这些配置和 API：

- `experiments.rspackFuture`
- `experiments.cache`
- `experiments.incremental`
- `experiments.parallelLoader`
- `lazyCompilation`
- `resolve.tsConfig`
- CSS minimizer 插件可用性
- `rspack.experiments.EsmLibraryPlugin`
- dev server 构造方式和 WebSocket 行为
- React refresh 插件路径和 peer dependency

现有 `isOldRspack` 兼容分支如果无害可以保留，但 v4 的主路径必须以 Rspack 2 行为为准。

## ESM-only 判断

EMP v4 应声明为 ESM-first，不应声明为 ESM-only。

原因：

- 多个公开 package 仍然暴露 `exports.require`。
- 多个 package 仍然构建 `.cjs` 和 `.d.cts`。
- `@empjs/chain` 支持字符串形式的 plugin path，并用 `require(pluginPath)` 解析。
- 多个插件包和 bridge 包仍把 CJS 产物作为公开兼容面。
- 在同一个版本里同时做 Rspack 2、Module Federation 2.x、全仓 ESM-only，会显著放大迁移风险。

推荐发布路径：

- `v4.0.0`：Node `^20.19.0 || >=22.12.0`、pnpm 10、Rspack 2、Module Federation 2.x、ESM-first、保留 CJS 兼容。
- `v4.x`：逐步替换低风险的内部 `require.resolve(...)` 和 `require(...)` 热点。
- `v5` 候选：当下游插件、示例项目、文档和包消费矩阵都通过 ESM-only 验证后，再考虑真正 ESM-only。

## 验证矩阵

工具链检查：

```bash
node -v
pnpm -v
```

期望结果：

- Node 满足 `^20.19.0 || >=22.12.0`。
- pnpm 为 `10.x`。

依赖检查：

```bash
pnpm list @rspack/core @rspack/dev-server @rspack/plugin-react-refresh --depth 0 --filter @empjs/cli --filter @empjs/plugin-react
pnpm list @module-federation/rspack @module-federation/runtime @module-federation/sdk @empjs/module-federation-rspack --depth 0 --filter @empjs/share
```

期望结果：

- `@rspack/core` 为 `2.x`。
- `@rspack/dev-server` 为兼容的 `2.x`。
- `@rspack/plugin-react-refresh` 为兼容的 `2.x`。
- `@empjs/share` 不再依赖 `@empjs/module-federation-rspack`。
- Module Federation 相关包处于官方 `2.x` 版本线。

核心构建检查：

```bash
pnpm --filter @empjs/chain build
pnpm --filter @empjs/cli build
pnpm --filter @empjs/share build
pnpm --filter @empjs/plugin-react build
```

示例构建检查：

```bash
pnpm --filter mf-host build
pnpm --filter mf-app build
pnpm --filter rtHost build
pnpm --filter rtProvider build
```

示例检查覆盖：

- Module Federation manifest 生成。
- DTS 生成和消费。
- runtime plugin 注册。
- `forceRemotes`。
- external runtime 注入。
- React HMR 插件兼容。

兼容性检查：

```bash
node -e "import('@empjs/cli').then(m => console.log(Boolean(m.runScript)))"
node -e "console.log(Boolean(require('./packages/cli/dist/index.cjs')))"
```

期望结果：

- ESM import 可用。
- 构建后 CJS require 兼容入口仍然可用。

## 回滚策略

依赖迁移应限制在 package manifest、lockfile 和最小 adapter 代码内。如果 Rspack 2 或官方 Module Federation 2.x 在关键路径上失败，应能通过回退依赖和 adapter 改动恢复，不影响无关插件 API。

同一个变更里不要删除 CJS exports。保留 CJS 兼容面可以降低回滚成本。

## 实施前检查项

实施代码修改前，先验证以下事实，并按对应 fallback 执行：

- 先使用 `@module-federation/rspack`；只有当 `manifest`、`dts` 或 runtime plugin 检查失败时，才把 adapter 切到 `@module-federation/enhanced/rspack`。
- 只有在 Rspack 2 仍导出并可运行 `rspack.experiments.EsmLibraryPlugin` 时，才保留该分支；否则移除或替换这个可选的 `isESM` 分支，但不改变公开的 `build.useESM` 选项。
- 只有在 `ts-checker-rspack-plugin@1.1.6` 实测支持 Rspack 2 时，才保留当前版本；否则升级、替换，或通过已有 `tsCheckerRspackPlugin` 选项保持可关闭。
- 如果 `html-webpack-plugin`、`sass-loader`、`less-loader` 构建通过且 peer warning 可接受，则保留；否则在同一次依赖迁移中更新受影响版本。
