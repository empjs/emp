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
| React Module Federation | `mf-host`, `mf-app`, `@empjs/share` | remote/host manifest、runtime sdk、默认 app 验收链路 | `pnpm test:apps:single` |
| Vue 3 Module Federation | `vue-3-base`, `vue-3-project` | Vue 3 remote exposes、consumer 配置和 manifest | `pnpm test:apps:single` |
| Tailwind CSS v4 | `tailwind-4` | 默认 Tailwind 支持只保留 v4 canonical | `pnpm test:apps:single` |
| React 19 Router/Query | `react-19-tanstack` | React 19、TanStack Router、Tailwind v4 组合 | `pnpm test:apps:single` |

## Compat Packs

Compat apps 不进入默认 `apps:acceptance`，只在相关能力变更或 release 前专项触发。

| 能力域 | apps | 触发条件 |
| --- | --- | --- |
| Vue 2 / adapter | `vue-2-base`, `vue-2-project`, `adapter-app`, `adapter-host` | 修改 Vue2、Vue bridge、adapter 或跨框架挂载时 |
| Manual smoke | `demo` | 修改 proxy、assets、React compiler 或临时调试链路时 |

当前无待合并重复 package name。已退休 app 只保留在 `scripts/apps.catalog.mjs` 的 `RETIRED_APP_DIRS` 中，用于防止根脚本和公开文档重新引用。

## Completed Merges

| 合并项 | 验收 |
| --- | --- |
| `react-tanstack` -> `react-19-tanstack` | `react-19-tanstack` 保留 `/router-lab` 与 `/router-lab/$id`，由 `pnpm test:apps:single` 断言 route tree |
| Tailwind duplicate group -> `tailwind-4` | `tailwind-4` 保留 v4 插件和 CSS 产物断言 |
| `vue3-app` / `vue3-host` -> `vue-3-base` / `vue-3-project` | `vue-3-base` 暴露 `PiniaCount`，`vue-3-project` 安装 Pinia 并消费 `@v3/PiniaCount` |
| Legacy library demos -> package smoke | `pnpm test:library-output` 构建并 HTTP 验证 CDN、lib runtime 和 `@empjs/share` 产物 |

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
