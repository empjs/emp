# Apps 功能测试清单

更新日期：2026-07-16

## 范围

本清单只覆盖当前 v4 仓库 `scripts/apps.catalog.mjs` 中的 `TARGET_APP_DIRS`，共 15 个 apps。`tailwind-2`、`tailwind-3`、`tailwind-demo`、`daisyui-demo`、`shadcn-ui` 等旧项目已在 `RETIRED_APP_DIRS` 中，不纳入当前补测范围。

## 当前测试入口

| 入口 | 覆盖范围 | 说明 |
| --- | --- | --- |
| `corepack pnpm apps:acceptance` | `test:tsconfig`、`empbuild`、`apps:check`、`test:apps:single`、`test:library-output` | 默认 apps 构建验收入口，不包含浏览器 E2E。 |
| `corepack pnpm test:apps:single` | `apps/test/apps.acceptance.test.ts` | 默认构建验收，覆盖 8 个关键 app 的 build 和产物断言。 |
| `corepack pnpm test:apps:browser` | `apps/*/test/browser/**/*.browser.ts` | apps 浏览器真实交互入口，当前覆盖 15 个 app。 |
| `corepack pnpm test:rules` | apps catalog、browser coverage、release rules | 保护目标 app 清单、退休项目边界、browser test 文件映射和测试入口。 |
| `corepack pnpm release:acceptance` | `workflow:check`、`ci:verify`、`empbuild`、`apps:acceptance`、`release:publish:dry -- --skip-build` | 生成 `.release/acceptance/index.html` 自包含验收 HTML，命令失败时仍落盘并返回非 0，用作每次发版凭证。 |
| `corepack pnpm release:acceptance -- --include-browser` | 以上发布 gates + `test:apps:browser` | 需要把浏览器 E2E 一起纳入发版凭证时使用；默认不塞进 `apps:acceptance`，避免本地端口/浏览器环境影响基础验收。 |

## Apps 功能测试矩阵

| App | 覆盖类型 | 要测试的功能点 | 关键断言 | 当前覆盖 | 补测优先级 |
| --- | --- | --- | --- | --- | --- |
| `adapter-host` | browser-smoke + build | React bridge host、`adapterHost` remote expose、React CDN external、manifest/types 产物 | 页面显示 `React Adapter Host`；React 版本可见；build 产出 `emp.json` / `emp.js`，并断言 `./App` expose、remote entry 和 buildName | `apps/adapter-host/test/browser/smoke.browser.ts`；`apps/test/apps.acceptance.test.ts`；被 `adapter-app` 作为 remote 消费 | P2 已覆盖：remote provider manifest/entry 产物和 browser 可加载链路已纳入契约 |
| `adapter-app` | browser-interactive | React host 同时消费 React、Vue 2、Vue 3 remote；bridge adapters；跨框架状态交互 | 页面显示 Vue 2 remote、React Adapter Host、Vue 3 文案；Vuex 计数从 0 到 1；React add 后 value 从 0 到 1 | `apps/adapter-app/test/browser/local-remote.browser.ts` | P0：保持现有真实浏览器链路；后续可补 remote 加载失败时的诊断输出 |
| `demo` | browser-interactive + build | React demo shell、Chrome 60 build preset、core-js、多入口页面、dev proxy、POST/GET/error/delay API、Lightning CSS rem/vw 转换、splitChunks | Chrome 60 preset 页面渲染并具备兼容 API；`/proxy-test.html` 调用 `/api/hello`、`/api/user`、`/api/posts`、`/api/delay`、`/api/error`、`/api/echo`；build 断言 core-js 先于非 module 入口加载，以及 `info.html`、`proxy-test.html`、`work/index.html` 和拆包 JS | `apps/demo/test/browser/chrome60.browser.ts`；`apps/demo/test/browser/proxy.browser.ts`；`apps/test/apps.acceptance.test.ts` | P2 已覆盖：`/api/hello` proxy target unavailable 浏览器诊断已覆盖 |
| `dual-role` | browser-interactive + build | 同一 MF container 产物运行于两个端口、双向 `init/get`、DTS 生成与消费 | 8201/8202 页面分别消费对端；产出 `@mf-types.zip`；解压声明由独立 TypeScript consumer 在 strict 模式编译通过 | `apps/dual-role/test/browser/mutual-consumption.browser.ts`；`apps/test/apps.acceptance.test.ts` | 已补齐 upstream `app-and-host` 的双角色与 DTS 能力 |
| `esm-federation` | browser-smoke + build | 原生 ESM Module Federation entry、module chunk loading | 生产构建产出含 `get/init` export 的 `esm-entry.js`；Chromium 原生 `import()` 后调用远程导出 | `apps/esm-federation/test/browser/esm-entry.browser.ts`；`apps/test/apps.acceptance.test.ts` | 已补齐 upstream ESM Federation 能力 |
| `mf-host` | browser-interactive + build | React Module Federation host、4 个 expose、MobX 状态、runtime SDK、remote async chunk | 页面显示并更新 MobX；build 断言 expose 与 async JS/CSS；点击后远程异步内容渲染 | `apps/mf-host/test/browser/mobx.browser.ts`；`apps/mf-app/test/browser/split-chunk.browser.ts`；`apps/test/apps.acceptance.test.ts` | remote provider、Runtime API 和 Federation splitChunks 均有真实验收 |
| `mf-app` | browser-interactive + build | React remote consumer、独立 Runtime API、remote splitChunks、Tailwind MF 隔离 | remote 状态交互；`init/register/load`；未知 expose 诊断；新 async chunk 请求；Tailwind remote 样式生效且 host sentinel 不变 | `apps/mf-app/test/browser/*.browser.ts`；`apps/test/apps.acceptance.test.ts` | upstream Runtime、splitChunks、Tailwind 隔离能力均已补齐 |
| `react-19-tanstack` | browser-interactive + build | React 19 hooks、Tailwind 4、TanStack Router、router code splitting、external React/TanStack CDN | React 19 页面显示 `useActionState`、`useOptimistic`、`useDeferredValue`、`startTransition`、`useFormStatus`；表单保存；optimistic 新增；过滤匹配；Router Lab 跳转到 `/router-lab/alice`；CSS 含 Tailwind v4 产物；route tree 含 `/router-lab` 和 `$id` | `apps/react-19-tanstack/test/browser/react19.browser.ts`；`apps/test/apps.acceptance.test.ts` | P2 已覆盖：直接加载 `/router-lab/alice` 深链刷新 |
| `rspack2-modern-module` | browser-smoke + build | Rspack 2 ESM 输出、`useESM`、现代模块构建目标、页面非空执行结果 | build 成功；产出 `dist/index.html`；JS 产物包含 `rspack2 modern module ready` 和 DOM append；browser smoke 能看到该文案 | `apps/rspack2-modern-module/test/browser/smoke.browser.ts`；`apps/test/apps.acceptance.test.ts` | 已补齐 P1 |
| `rspack2-optimization` | browser-smoke + build | Rspack 2 optimization、hashed module id、splitChunks、dynamic import、pureFunctions、CSS parser 配置 | 页面显示动态 chunk 输出 `pure-value`；build 产出 `dist/index.html`、entry JS、async chunk JS、CSS；JS 含 `pure-value` 且不含 `unused-call` | `apps/rspack2-optimization/test/browser/chunk.browser.ts`；`apps/test/apps.acceptance.test.ts` | 已补齐 P1 |
| `tailwind-4` | browser-interactive + build | Tailwind CSS 4、React product form、scoped MF remote、旧 Tailwind 2/3 不回归 | standalone 交互通过；`ScopedCard` utility computed style 生效；不加载 preflight，host sentinel 前后样式一致 | `apps/tailwind-4/test/browser/product-form.browser.ts`；`apps/mf-app/test/browser/tailwind-isolation.browser.ts`；`apps/test/apps.acceptance.test.ts` | 当前 Tailwind 主覆盖与 MF 隔离均已验收 |
| `vue-2-base` | browser-interactive + build | Vue 2 base remote、Element UI table、Vuex、Composition API、remote-ready exposes | 页面显示 `Content Component`、`Hello JSX Component`、`Element Table`、`CompositionApi`；Vuex 从 0 到 1；base content toggle；composition count 同步变化；build manifest 断言 `./Content`、`./Table`、`./CompositionApi`、`./store`、`./setup` | `apps/vue-2-base/test/browser/interactive.browser.ts`；`apps/test/apps.acceptance.test.ts` | P2 已覆盖：remote provider exposes、manifest 和 browser 可加载链路已纳入契约 |
| `vue-2-project` | browser-interactive + build | Vue 2 consumer、Vue 2 remote、Vue 3 + Pinia remote、跨版本生命周期 | 原有 Vue 2 remote 交互通过；Vue 3 props 更新、Pinia 0→1、unmount、重挂载状态重置 | `apps/vue-2-project/test/browser/remote.browser.ts`；`apps/vue-2-project/test/browser/vue3-in-vue2.browser.ts`；`apps/test/apps.acceptance.test.ts` | 已补齐 upstream Vue3-in-Vue2 能力 |
| `vue-3-base` | browser-interactive + build | Vue 3 base remote、Ant Design Vue、Pinia、Lightning CSS、Vue external CDN、多个 exposes | 页面显示 `Vue 3 Base`、Ant Design 表格文本；点击 `add` 后 `value: 1`；Pinia count base 到 1；build 产出 `mf-manifest.json` / `emp.js`；配置包含 Pinia external；manifest 断言 7 个 expose | `apps/vue-3-base/test/browser/interactive.browser.ts`；`apps/test/apps.acceptance.test.ts` | P2 已覆盖：remote provider exposes、manifest 和 browser 可加载链路已纳入契约 |
| `vue-3-project` | browser-interactive + build | Vue 3 consumer、消费 `vue3Base` remote、Vue Router、Pinia remote component、host/home 路由切换 | 页面显示 `Hello App`、`Current route path: /`、`vue3Base/PiniaCount`；Pinia remote count 到 1；跳转 `/hostHome` 后显示 host 内容，再回到首页；build 产出 `mf-manifest.json` / `index.html`；manifest 断言 `vue3Base` remotes 指向 `9301/emp.js` | `apps/vue-3-project/test/browser/remote.browser.ts`；`apps/test/apps.acceptance.test.ts` | P2 已覆盖：直接加载 `/#/hostHome` 深链刷新，remote consumer 契约已纳入 manifest/browser 验收 |

## P2 边界补齐清单

| 边界类型 | 覆盖 app | 验收入口 |
| --- | --- | --- |
| remote provider manifest/entry 诊断契约 | `adapter-host`、`mf-host`、`vue-2-base`、`vue-3-base` | `apps/test/apps.acceptance.test.ts` 断言 expose、manifest、remote entry；对应 browser smoke/interactive 测试确认页面可加载。 |
| remote consumer remotes 诊断契约 | `mf-app`、`vue-2-project`、`vue-3-project` | `apps/test/apps.acceptance.test.ts` 断言 remotes URL；对应 browser 测试确认 remote 组件真实消费。 |
| proxy target unavailable 诊断 | `demo` | `apps/demo/test/browser/proxy.browser.ts` 注入 `/api/hello` 网络失败并断言错误信息展示；浏览器 harness 为测试 API 动态分配空闲端口。 |
| route deep refresh | `react-19-tanstack`、`vue-3-project` | `apps/react-19-tanstack/test/browser/react19.browser.ts` 直接加载 `/router-lab/alice`；`apps/vue-3-project/test/browser/remote.browser.ts` 直接加载 `/#/hostHome`。 |
| Runtime / ESM / async chunks | `mf-app`、`mf-host`、`esm-federation` | 独立 Runtime API、原生 ESM entry、manifest async assets 与浏览器 resource timing 形成真实闭环。 |
| 双角色 / DTS / 跨框架 | `dual-role`、`vue-2-project` | 双端口 container 双向消费与独立 DTS 编译；Vue2 宿主内 Vue3 + Pinia 生命周期交互。 |
| Tailwind MF 隔离 | `mf-app`、`tailwind-4` | remote utility 正向 computed style 与 host sentinel 加载前后快照共同验收。 |
| P2 文档契约 | 全部 P2 app | `apps/test/apps.browser-coverage.test.ts` 阻止文档重新出现 P2 残留，并要求边界映射到 root browser targets。 |

## 建议补测顺序

| 优先级 | 补测项 | 原因 |
| --- | --- | --- |
| P0 | 保持 `adapter-app`、`mf-host`、`mf-app`、`tailwind-4`、`vue-2-*`、`vue-3-*`、`react-19-tanstack` 的 browser 真实交互测试持续通过 | 这些是当前 apps 的主要运行时、插件和 Module Federation 验收面。 |
| 持续守护 | remote provider/consumer manifest 与 remotes 契约 | 已进入 P2 边界补齐清单，后续改 remote 配置时必须保持 apps acceptance 和 browser 消费链路同步通过。 |
| 持续守护 | React/Vue 路由刷新场景 | 已补直接深链加载测试，后续新增路由需同步补 browser 直达用例。 |
| 持续守护 | demo proxy 端口/目标不可达诊断 | 已补 proxy target unavailable 浏览器诊断，后续代理规则调整需保留错误展示。 |

## 不纳入当前范围

| 项目 | 原因 |
| --- | --- |
| `tailwind-2` / `tailwind-3` | 当前 v4 只保留 Tailwind 4 覆盖，旧 Tailwind app 已退休。 |
| `tailwind-demo` / `tailwindcss-app` / `tailwindcss-host` / `tailwind-4-polyfill` | 已归类为 retired，不进入当前 apps 测试矩阵。 |
| `daisyui-demo` / `shadcn-ui` | 当前 plugin/workspace 表面没有对应现存 app 测试目标。 |
| `website` | 站点不属于 apps 验收矩阵。 |
