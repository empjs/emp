# apps 验收项目矩阵

`apps/` 是 EMP v4 的示例与验收项目目录。新增验收能力默认放在这里；`apps/**` 与 `website` 不进入 npm 发布范围。

## 准入规则

- 每个 app 必须有 `package.json`、EMP 配置文件和 `src/`。
- 每个 app 必须提供 `dev`、`build`、`start`、`stat` 脚本。
- app 名称必须表达验收能力，不使用泛化名称。
- 每个 app 必须能通过 `node scripts/apps.mjs check`。

## 验收用例矩阵

| 能力域 | apps | 验证重点 | 最小命令 |
| --- | --- | --- | --- |
| Module Federation | `mf-host`, `mf-app`, `app-and-host`, `mf-split-chunk`, `mf-v3-host` | remote/host、split chunk、v3 host、类型产物 | `pnpm --filter ./apps/mf-host --filter ./apps/mf-app build` |
| Vue 2/3 | `vue-2-base`, `vue-2-element`, `vue-2-project`, `vue-2-stylus`, `vue-3-base`, `vue-3-project`, `vue-3-with-vue-2`, `vue3-host`, `vue3-app` | Vue 插件、remote 暴露、DTS、跨版本消费、跨版本组合 | `pnpm --filter ./apps/vue-3-base --filter ./apps/vue-3-project build` |
| React Runtime | `react-16-adapter-18`, `react-18-runtime`, `react-19-runtime`, `runtime-18-app`, `runtime-18-host` | React 16/18/19 运行时兼容、runtime remote | `pnpm --filter ./apps/react-19-runtime --filter ./apps/runtime-18-host build` |
| Adapter | `adapter-app`, `adapter-host`, `adapter-vue2-host`, `adapter-vue3-host`, `vue3-in-vue2` | React/Vue adapter、跨框架挂载与宿主消费 | `pnpm --filter ./apps/adapter-app --filter ./apps/adapter-host build` |
| CSS / Tailwind | `tailwind-2`, `tailwind-3`, `tailwind-4`, `tailwind-4-polyfill`, `tailwind-demo`, `tailwindcss-app`, `tailwindcss-host`, `daisyui-demo`, `mobile-vw-rem`, `shadcn-ui` | Tailwind 版本矩阵、CSS module、polyfill、组件样式 | `pnpm --filter ./apps/tailwind-4 build` |
| Routing | `react-router-demo`, `react-tanstack`, `react-19-tanstack`, `react-wouter`, `auto-pages` | 文件路由、动态路由、Wouter/TanStack Router | `pnpm --filter ./apps/react-router-demo --filter ./apps/react-tanstack build` |
| Proxy / Assets | `demo`, `proxy-demo`, `local-build-remote-dev-demo`, `pixi-js-demo` | proxy、资源处理、本地 remote、非 React/Vue 入口 | `pnpm --filter ./apps/demo --filter ./apps/proxy-demo build` |
| Rspack 2 Baseline | `rspack2-modern-module`, `rspack2-optimization` | Rspack 2 ESM library、parser、SWC loader、优化配置 | `pnpm --filter ./apps/rspack2-modern-module --filter ./apps/rspack2-optimization build` |
| CDN / Unpkg Runtime | `unpkg-demo`, `unpkg-lib`, `lib-main`, `lib-react`, `esm-react-app`, `esm-react-host` | CDN external、unpkg runtime、ESM/CJS 消费 | `pnpm --filter ./apps/unpkg-demo --filter ./apps/esm-react-host build` |
| Legacy / Runtime Layout | `old-func-demo`, `rtHost`, `rtLayout`, `rtProvider`, `emp-window-demo`, `react-eager-host`, `react-eager-app`, `es5-import-demo` | legacy API、layout/provider、window runtime、eager import、ES5 import | `pnpm --filter ./apps/rtHost --filter ./apps/emp-window-demo build` |

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
