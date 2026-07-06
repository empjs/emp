# Apps 功能测试清单

生成日期：2026-07-06

## 范围

本清单只覆盖当前 v4 仓库 `scripts/apps.catalog.mjs` 中的 `TARGET_APP_DIRS`，共 13 个 apps。`tailwind-2`、`tailwind-3`、`tailwind-demo`、`daisyui-demo`、`shadcn-ui` 等旧项目已在 `RETIRED_APP_DIRS` 中，不纳入当前补测范围。

## 当前测试入口

| 入口 | 覆盖范围 | 说明 |
| --- | --- | --- |
| `corepack pnpm apps:acceptance` | `test:tsconfig`、`empbuild`、`apps:check`、`test:apps:single`、`test:library-output` | 默认 apps 构建验收入口，不包含浏览器 E2E。 |
| `corepack pnpm test:apps:single` | `apps/test/apps.acceptance.test.ts` | 默认构建验收，覆盖 8 个关键 app 的 build 和产物断言。 |
| `corepack pnpm test:apps:browser` | `apps/*/test/browser/**/*.browser.ts` | apps 浏览器真实交互入口，当前覆盖 13 个 app。 |
| `corepack pnpm test:rules` | apps catalog、browser coverage、release rules | 保护目标 app 清单、退休项目边界、browser test 文件映射和测试入口。 |
| `corepack pnpm release:acceptance` | `workflow:check`、`ci:verify`、`empbuild`、`apps:acceptance`、`release:publish:dry -- --skip-build` | 生成 `.release/acceptance/index.html` 自包含验收 HTML，命令失败时仍落盘并返回非 0，用作每次发版凭证。 |
| `corepack pnpm release:acceptance -- --include-browser` | 以上发布 gates + `test:apps:browser` | 需要把浏览器 E2E 一起纳入发版凭证时使用；默认不塞进 `apps:acceptance`，避免本地端口/浏览器环境影响基础验收。 |

## Apps 功能测试矩阵

| App | 覆盖类型 | 要测试的功能点 | 关键断言 | 当前覆盖 | 补测优先级 |
| --- | --- | --- | --- | --- | --- |
| `adapter-host` | browser-smoke + build | React bridge host、`adapterHost` remote expose、React CDN external、manifest/types 产物 | 页面显示 `React Adapter Host`；React 版本可见；build 产出 `emp.json` / `emp.js`，并断言 `./App` expose、remote entry 和 buildName | `apps/adapter-host/test/browser/smoke.browser.ts`；`apps/test/apps.acceptance.test.ts`；被 `adapter-app` 作为 remote 消费 | P2 已覆盖：remote provider manifest/entry 产物和 browser 可加载链路已纳入契约 |
| `adapter-app` | browser-interactive | React host 同时消费 React、Vue 2、Vue 3 remote；bridge adapters；跨框架状态交互 | 页面显示 Vue 2 remote、React Adapter Host、Vue 3 文案；Vuex 计数从 0 到 1；React add 后 value 从 0 到 1 | `apps/adapter-app/test/browser/local-remote.browser.ts` | P0：保持现有真实浏览器链路；后续可补 remote 加载失败时的诊断输出 |
| `demo` | browser-interactive + build | React demo shell、多入口页面、dev proxy、POST/GET/error/delay API、Lightning CSS rem/vw 转换、splitChunks | 首页表单保存；`/proxy-test.html` 调用 `/api/hello`、`/api/user`、`/api/posts`、`/api/delay`、`/api/error`、`/api/echo`；build 断言 `info.html`、`proxy-test.html`、`work/index.html`、`lib-react`、`lib-antd`、`lib-common`、`proxy-test` JS | `apps/demo/test/browser/proxy.browser.ts`；`apps/test/apps.acceptance.test.ts` | P2 已覆盖：`/api/hello` proxy target unavailable 浏览器诊断已覆盖 |
| `mf-host` | browser-interactive + build | React Module Federation host、`./App` / `./CountComp` / `./Section` expose、MobX 状态、runtime SDK | 页面显示 `EMP 3.0 React`、`Mobx Count`、`mixin test`；点击后 MobX count 从 0 到 1；build 产出 `emp.json` / `emp.js`，并断言 3 个 expose 和 remote entry | `apps/mf-host/test/browser/mobx.browser.ts`；`apps/test/apps.acceptance.test.ts` | P2 已覆盖：remote provider manifest/entry 产物和 browser 可加载链路已纳入契约 |
| `mf-app` | browser-interactive + build | React remote consumer、消费 `mfHost` remote、shared React singleton、remote props 和 remote state | 页面显示 `MF-Host`、`MF-APP`、`fromMainAppName`、`nameformRemote`；点击后本地按钮和 remote MobX count 同步到 1；build 产出 `emp.json` / `index.html`，并断言 `mfHost` remote 指向 `6001/emp.json` | `apps/mf-app/test/browser/remote.browser.ts`；`apps/test/apps.acceptance.test.ts` | P2 已覆盖：remote consumer remotes 配置、manifest 和 browser 消费链路已纳入契约 |
| `react-19-tanstack` | browser-interactive + build | React 19 hooks、Tailwind 4、TanStack Router、router code splitting、external React/TanStack CDN | React 19 页面显示 `useActionState`、`useOptimistic`、`useDeferredValue`、`startTransition`、`useFormStatus`；表单保存；optimistic 新增；过滤匹配；Router Lab 跳转到 `/router-lab/alice`；CSS 含 Tailwind v4 产物；route tree 含 `/router-lab` 和 `$id` | `apps/react-19-tanstack/test/browser/react19.browser.ts`；`apps/test/apps.acceptance.test.ts` | P2 已覆盖：直接加载 `/router-lab/alice` 深链刷新 |
| `rspack2-modern-module` | browser-smoke + build | Rspack 2 ESM 输出、`useESM`、现代模块构建目标、页面非空执行结果 | build 成功；产出 `dist/index.html`；JS 产物包含 `rspack2 modern module ready` 和 DOM append；browser smoke 能看到该文案 | `apps/rspack2-modern-module/test/browser/smoke.browser.ts`；`apps/test/apps.acceptance.test.ts` | 已补齐 P1 |
| `rspack2-optimization` | browser-smoke + build | Rspack 2 optimization、hashed module id、splitChunks、dynamic import、pureFunctions、CSS parser 配置 | 页面显示动态 chunk 输出 `pure-value`；build 产出 `dist/index.html`、entry JS、async chunk JS、CSS；JS 含 `pure-value` 且不含 `unused-call` | `apps/rspack2-optimization/test/browser/chunk.browser.ts`；`apps/test/apps.acceptance.test.ts` | 已补齐 P1 |
| `tailwind-4` | browser-interactive + build | Tailwind CSS 4、React product form、radio 状态、CSS utility 产物、旧 Tailwind 2/3 不回归 | 页面显示 `Tailwind CSS 4`、`Classic Utility Jacket`；选择 `xl` 后仍保持选中；build CSS 含 `--tw`、`.grid`、`.bg-`；不依赖 `plugin-tailwindcss2/3` | `apps/tailwind-4/test/browser/product-form.browser.ts`；`apps/test/apps.acceptance.test.ts`；`apps/test/apps.rules.test.ts` | P0：作为当前 Tailwind 主覆盖；不要恢复 Tailwind 3 用例 |
| `vue-2-base` | browser-interactive + build | Vue 2 base remote、Element UI table、Vuex、Composition API、remote-ready exposes | 页面显示 `Content Component`、`Hello JSX Component`、`Element Table`、`CompositionApi`；Vuex 从 0 到 1；base content toggle；composition count 同步变化；build manifest 断言 `./Content`、`./Table`、`./CompositionApi`、`./store`、`./setup` | `apps/vue-2-base/test/browser/interactive.browser.ts`；`apps/test/apps.acceptance.test.ts` | P2 已覆盖：remote provider exposes、manifest 和 browser 可加载链路已纳入契约 |
| `vue-2-project` | browser-interactive + build | Vue 2 consumer、消费 `vue2Base` remote、Element UI CDN、Vuex remote state、Composition API remote state | 页面显示 `Project App vue 2 project`、`=== @v2b/Content ===`、`=== @v2b/Table ===`、`王小虎`；Vuex 和 Composition API 交互变化；build manifest 断言 `vue2Base` remotes 指向 `9001/emp.js` | `apps/vue-2-project/test/browser/remote.browser.ts`；`apps/test/apps.acceptance.test.ts` | P2 已覆盖：remote consumer remotes 配置、manifest 和 browser 消费链路已纳入契约 |
| `vue-3-base` | browser-interactive + build | Vue 3 base remote、Ant Design Vue、Pinia、Lightning CSS、Vue external CDN、多个 exposes | 页面显示 `Vue 3 Base`、Ant Design 表格文本；点击 `add` 后 `value: 1`；Pinia count base 到 1；build 产出 `mf-manifest.json` / `emp.js`；配置包含 Pinia external；manifest 断言 7 个 expose | `apps/vue-3-base/test/browser/interactive.browser.ts`；`apps/test/apps.acceptance.test.ts` | P2 已覆盖：remote provider exposes、manifest 和 browser 可加载链路已纳入契约 |
| `vue-3-project` | browser-interactive + build | Vue 3 consumer、消费 `vue3Base` remote、Vue Router、Pinia remote component、host/home 路由切换 | 页面显示 `Hello App`、`Current route path: /`、`vue3Base/PiniaCount`；Pinia remote count 到 1；跳转 `/hostHome` 后显示 host 内容，再回到首页；build 产出 `mf-manifest.json` / `index.html`；manifest 断言 `vue3Base` remotes 指向 `9301/emp.js` | `apps/vue-3-project/test/browser/remote.browser.ts`；`apps/test/apps.acceptance.test.ts` | P2 已覆盖：直接加载 `/#/hostHome` 深链刷新，remote consumer 契约已纳入 manifest/browser 验收 |

## P2 边界补齐清单

| 边界类型 | 覆盖 app | 验收入口 |
| --- | --- | --- |
| remote provider manifest/entry 诊断契约 | `adapter-host`、`mf-host`、`vue-2-base`、`vue-3-base` | `apps/test/apps.acceptance.test.ts` 断言 expose、manifest、remote entry；对应 browser smoke/interactive 测试确认页面可加载。 |
| remote consumer remotes 诊断契约 | `mf-app`、`vue-2-project`、`vue-3-project` | `apps/test/apps.acceptance.test.ts` 断言 remotes URL；对应 browser 测试确认 remote 组件真实消费。 |
| proxy target unavailable 诊断 | `demo` | `apps/demo/test/browser/proxy.browser.ts` 注入 `/api/hello` 网络失败并断言错误信息展示。 |
| route deep refresh | `react-19-tanstack`、`vue-3-project` | `apps/react-19-tanstack/test/browser/react19.browser.ts` 直接加载 `/router-lab/alice`；`apps/vue-3-project/test/browser/remote.browser.ts` 直接加载 `/#/hostHome`。 |
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
