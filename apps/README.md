# apps 验收项目矩阵

`apps/` 是 EMP v4 的示例与验收项目目录。新增验收能力默认放在这里；`apps/**` 与 `website` 不进入 npm 发布范围。

## 准入规则

- 每个 app 必须有 `package.json`、EMP 配置文件和 `src/`。
- 每个 app 必须提供 `dev`、`build`、`start`、`stat` 脚本。
- app 名称必须表达验收能力，不使用泛化名称。
- 每个 app 必须能通过 `node scripts/apps.mjs check`。

## Default Acceptance

默认验收只保留最小代表用例，避免 59 个 app 全量构建。新增能力先判断是否能归入现有 canonical app；不能覆盖时再增加专项或 compat 用例。

| 能力域 | canonical subject | 验证重点 | 命令 |
| --- | --- | --- | --- |
| Rspack 2 Baseline | `rspack2-modern-module`, `rspack2-optimization` | 现代模块输出、优化配置和基础构建链路 | `pnpm test:apps:single` |
| React Module Federation | `mf-host`, `mf-app`, `@empjs/share` | remote/host manifest、runtime sdk、真实浏览器联动 | `pnpm test:apps:single`；`pnpm test:apps:mf` |
| Vue 3 Module Federation | `vue-3-base`, `vue-3-project` | Vue 3 remote exposes、consumer 配置和 manifest | `pnpm test:apps:single` |
| Tailwind CSS v4 | `tailwind-4` | 默认 Tailwind 支持只保留 v4 canonical | `pnpm test:apps:single` |
| React 19 Router/Query | `react-19-tanstack` | React 19、TanStack Router、Tailwind v4 组合 | `pnpm test:apps:single` |

## Compat Packs

Compat apps 不进入默认 `apps:acceptance`，只在相关能力变更或 release 前专项触发。

| 能力域 | apps | 触发条件 |
| --- | --- | --- |
| Tailwind legacy | `tailwind-2`, `tailwind-3` | 修改 Tailwind v2/v3 plugin 或 legacy CSS 兼容时 |
| Vue 2 / adapter | `vue-2-*`, `vue3-in-vue2`, `adapter-*` | 修改 Vue2、Vue bridge、adapter 或跨框架挂载时 |
| React legacy/runtime | `react-16-adapter-18`, `react-18-runtime`, `runtime-18-*` | 修改 React adapter、runtime version isolation 或 CDN React 18 时 |
| Runtime layout/provider | `rtHost`, `rtLayout`, `rtProvider`, `emp-window-demo` | 修改 runtime provider、layout、window runtime 或 force remote 时 |
| Assets / proxy / routing examples | `demo`, `proxy-demo`, `auto-pages`, `mobile-vw-rem`, `pixi-js-demo`, `react-router-demo`, `react-wouter`, `shadcn-ui`, `daisyui-demo` | 修改对应 assets、proxy、routing、UI 样式集成时 |
| Library / CDN transition | `lib-main`, `lib-react`, `unpkg-demo`, `unpkg-lib` | 迁移完成前保留；后续由 Rslib/CDN package smoke 替代 |

## Merge Candidates

| 候选组 | 目标 |
| --- | --- |
| `vue3-app` / `vue3-host` -> `vue-3-base` / `vue-3-project` | 保留必要 Pinia/router 信号后删除旧 Vue3 重复组 |
| `lib-*` / `unpkg-*` apps -> Rslib/CDN package smoke | 不再用 MF app pair 证明库产物 |

## Completed Merges

| 合并项 | 验收 |
| --- | --- |
| `react-tanstack` -> `react-19-tanstack` | `react-19-tanstack` 保留 `/router-lab` 与 `/router-lab/$id`，由 `pnpm test:apps:single` 断言 route tree |
| Tailwind duplicate group -> `tailwind-4` | `tailwind-4` 保留 v4 插件和 CSS 产物断言，`tailwind-2` / `tailwind-3` 保留为 legacy compat |

## 命令

```bash
pnpm apps:list
pnpm apps:check
pnpm apps:bench -- --apps rspack2-modern-module,rspack2-optimization
pnpm apps:acceptance
```

## Local Static And CDN Debug

本地 CDN / lib / runtime 静态服务统一走仓库根命令，不在单个 package 中安装或直接调用第三方 `serve`。

```bash
pnpm static:list
pnpm static:start -- --service emp-share,cdn-react-18 --dry-run --json
pnpm static:start -- --service emp-share
pnpm static:env -- --service emp-share,cdn-react-18,emp-polyfill --mode development
```

`emp static` 默认按 Cloudflare 动态压缩行为处理本地静态资源：Brotli 优先、Gzip 回退，小响应不压缩。这样本地 CDN 调试时的传输体积更接近线上 CDN。

如果多个服务共享历史端口，例如 `cdn-react-wouter` 与 `cdn-react-tanstack` 都是 `2200`，同一次启动会失败并输出 `port-conflict`。选择其中一个服务启动，或在服务清单中调整端口后再运行。
