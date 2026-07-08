# Apps 验收矩阵

仓库当前的 apps 验收入口如下。基础验收只跑稳定的构建、清单和产物契约；浏览器 E2E 单独保留，方便在发版或回归时按环境选择是否纳入。

```bash
corepack pnpm apps:acceptance
corepack pnpm test:apps:single
corepack pnpm test:apps:browser
```

`apps:acceptance` 覆盖 TypeScript 配置、包构建、apps 清单、关键 app 构建和 library output。浏览器 E2E 独立放在 `test:apps:browser`，避免端口和浏览器环境影响基础验收。

## 验收链路

| 验收项 | 命令 | 验收详细内容 | 通过标准 | 失败定位 |
| --- | --- | --- | --- | --- |
| TypeScript 与根规则 | `corepack pnpm test:tsconfig` | 校验 workspace tsconfig、DTS 类型入口、根测试目标与 apps 验收链路约束。 | `test/tsconfig.rules.test.ts` 全部通过。 | 先看 tsconfig 规则失败项，再看对应 package/app 的配置文件。 |
| 发布包构建基线 | `corepack pnpm empbuild` | 构建 chain、CLI、polyfill、share、plugin、bridge、cdn 等 packages，保证 apps 构建前依赖产物可用。 | 所有 package build 退出码为 0。 | 先看失败 package，再看对应 `packages/**/rslib.config.ts` 或源码变更。 |
| Apps 清单结构 | `corepack pnpm apps:check` | 扫描 `apps/**/package.json`、EMP 配置、`src` 目录和 `dev/build/start/stat` 脚本。 | 当前 13 个目标 app 均无结构问题。 | 输出会列出缺失字段，例如 `config`、`src` 或 `scripts.build`。 |
| 关键 app 产物契约 | `corepack pnpm test:apps:single` | 构建默认 8 个关键 app 和 4 个补充 app，断言 HTML、manifest、remote entry、exposes、remotes、CSS/JS 产物。 | `apps/test/apps.acceptance.test.ts` 全部通过。 | 按失败 app 查看 `apps/<app>/dist`、`emp.config.ts` 和对应源码。 |
| Library/CDN 输出契约 | `corepack pnpm test:library-output` | 构建 CDN/runtime/library 包，启动静态服务并请求代表性 UMD/SDK 资源。 | 产物文件存在，HTTP 响应可访问，CORS 与全局变量断言通过。 | 查看 `test/library-output.smoke.test.ts` 输出的 service id、端口和资源路径。 |
| Apps 浏览器 E2E | `corepack pnpm test:apps:browser` | 启动真实浏览器，覆盖跨框架 remote、Module Federation、proxy、路由刷新、Tailwind 4、React 19、Vue 2/3 交互。 | 13 个 app 的 browser test 均通过。 | 按失败文件进入 `apps/<app>/test/browser/*.browser.ts`，结合页面截图和控制台输出排查。 |

## App 详细验收表

| App | 验收类型 | 验收详细内容 | 通过标准 | 测试证据 |
| --- | --- | --- | --- | --- |
| `adapter-app` | 浏览器交互 | React host 同时消费 React、Vue 2、Vue 3 remote，验证 bridge adapters 和跨框架状态交互。 | 页面显示 Vue 2 remote、React Adapter Host、Vue 3 文案；Vuex 计数和 React add 交互都能从 0 到 1。 | `apps/adapter-app/test/browser/local-remote.browser.ts` |
| `adapter-host` | 构建 + 浏览器 smoke | React bridge host、`adapterHost` remote expose、React CDN external、manifest 与 remote entry。 | 浏览器显示 React Adapter Host 和 React 版本；构建产出 `emp.json` / `emp.js`，manifest 暴露 `./App`。 | `apps/adapter-host/test/browser/smoke.browser.ts`、`apps/test/apps.acceptance.test.ts` |
| `demo` | 构建 + 浏览器交互 | React demo shell、多入口页面、dev proxy、POST/GET/error/delay API、Lightning CSS rem/vw、splitChunks。 | 表单保存成功；`/proxy-test.html` 基础接口、延迟、错误、POST echo 都有结果；构建产出 `info.html`、`proxy-test.html`、`work/index.html` 和 split chunks。 | `apps/demo/test/browser/proxy.browser.ts`、`apps/test/apps.acceptance.test.ts` |
| `mf-host` | 构建 + 浏览器交互 | React Module Federation provider，暴露 `./App`、`./CountComp`、`./Section`，验证 MobX 状态和 runtime SDK。 | 页面显示 EMP React、MobX Count、mixin test；点击后 MobX count 从 0 到 1；manifest buildName 为 `mf-host`。 | `apps/mf-host/test/browser/mobx.browser.ts`、`apps/test/apps.acceptance.test.ts` |
| `mf-app` | 构建 + 浏览器交互 | React Module Federation consumer，消费 `mfHost` remote，验证 shared React singleton、remote props 和 remote state。 | 页面显示 MF-Host、MF-APP、remote props；本地按钮和 remote MobX count 点击后同步到 1；remotes 指向 `6001/emp.json`。 | `apps/mf-app/test/browser/remote.browser.ts`、`apps/test/apps.acceptance.test.ts` |
| `react-19-tanstack` | 构建 + 浏览器交互 | React 19 hooks、Tailwind 4、TanStack Router、router code splitting、external React/TanStack CDN。 | `useActionState`、`useOptimistic`、`useDeferredValue`、`startTransition`、`useFormStatus` 可见且可交互；`/router-lab/alice` 深链直达；CSS 使用绝对资源路径。 | `apps/react-19-tanstack/test/browser/react19.browser.ts`、`apps/test/apps.acceptance.test.ts` |
| `rspack2-modern-module` | 构建 + 浏览器 smoke | Rspack 2 ESM 输出、`useESM`、现代模块构建目标、页面非空执行结果。 | 产出 `dist/index.html`；JS 包含 `rspack2 modern module ready` 和 DOM append；浏览器能看到该文案。 | `apps/rspack2-modern-module/test/browser/smoke.browser.ts`、`apps/test/apps.acceptance.test.ts` |
| `rspack2-optimization` | 构建 + 浏览器 smoke | Rspack 2 optimization、hashed module id、splitChunks、dynamic import、pureFunctions、CSS parser 配置。 | 产出 entry JS、async chunk JS、CSS；JS 包含 `pure-value` 且不含 `unused-call`；浏览器能看到 `pure-value`。 | `apps/rspack2-optimization/test/browser/chunk.browser.ts`、`apps/test/apps.acceptance.test.ts` |
| `tailwind-4` | 构建 + 浏览器交互 | Tailwind CSS 4、React product form、radio 状态、CSS utility 产物，确认旧 Tailwind 插件不回归。 | 页面显示 Tailwind CSS 4 和商品表单；选择尺寸和 Add to bag 可交互；CSS 包含 `--tw`、`.grid`、`.bg-`；不依赖 `plugin-tailwindcss2/3`。 | `apps/tailwind-4/test/browser/product-form.browser.ts`、`apps/test/apps.acceptance.test.ts`、`apps/test/apps.rules.test.ts` |
| `vue-2-base` | 构建 + 浏览器交互 | Vue 2 base remote、Element UI table、Vuex、Composition API、remote-ready exposes。 | 页面显示 Content、JSX、Element Table、CompositionApi；Vuex 与 composition count 可变更；manifest 暴露 `./Content`、`./Table`、`./CompositionApi`、`./store`、`./setup`。 | `apps/vue-2-base/test/browser/interactive.browser.ts`、`apps/test/apps.acceptance.test.ts` |
| `vue-2-project` | 构建 + 浏览器交互 | Vue 2 consumer，消费 `vue2Base` remote，验证 Element UI CDN、Vuex remote state、Composition API remote state。 | 页面显示 project、remote Content、remote Table、表格数据；Vuex 与 Composition API 交互变化；remotes 指向 `9001/emp.js`。 | `apps/vue-2-project/test/browser/remote.browser.ts`、`apps/test/apps.acceptance.test.ts` |
| `vue-3-base` | 构建 + 浏览器交互 | Vue 3 base remote、Ant Design Vue、Pinia、Lightning CSS、Vue external CDN、多个 exposes。 | 页面显示 Vue 3 Base 和表格文本；点击 add 后 `value: 1`；Pinia count 到 1；manifest 暴露 7 个组件并配置 Pinia external。 | `apps/vue-3-base/test/browser/interactive.browser.ts`、`apps/test/apps.acceptance.test.ts` |
| `vue-3-project` | 构建 + 浏览器交互 | Vue 3 consumer，消费 `vue3Base` remote，验证 Vue Router、Pinia remote component、host/home 路由切换。 | 页面显示 Hello App、当前路由和 remote Pinia；Pinia remote count 到 1；`/#/hostHome` 深链直达；remotes 指向 `9301/emp.js`。 | `apps/vue-3-project/test/browser/remote.browser.ts`、`apps/test/apps.acceptance.test.ts` |

## 边界验收

| 边界 | 覆盖对象 | 验收方式 |
| --- | --- | --- |
| remote provider manifest / entry / exposes | `adapter-host`、`mf-host`、`vue-2-base`、`vue-3-base` | 构建后读取 `emp.json` 或 `mf-manifest.json`，断言 buildName、remote entry 和 exposes；浏览器 smoke/interactive 再确认页面可加载。 |
| remote consumer remotes URL 与真实消费 | `mf-app`、`vue-2-project`、`vue-3-project` | 构建后断言 remotes 容器名和 URL；浏览器测试确认 remote 组件、props 和状态真实可用。 |
| 路由刷新 | `react-19-tanstack`、`vue-3-project` | 直接加载 `/router-lab/alice` 和 `/#/hostHome`，验证刷新后仍能命中对应页面和组件。 |
| proxy 失败诊断 | `demo` | 在浏览器测试中模拟 `/api/hello` 目标不可达，断言页面展示 `proxy target unavailable`。 |
| Tailwind 当前范围 | `tailwind-4` | 只守护 Tailwind CSS 4；`tailwind-2`、`tailwind-3`、`tailwind-demo` 不恢复到当前矩阵。 |
