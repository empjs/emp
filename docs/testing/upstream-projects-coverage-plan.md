# Upstream `projects` 覆盖补齐计划

## 状态

- 第一阶段：6/6 核心能力已完成，发布级验收全部通过。
- 第二阶段：次级候选已收口；只补当前 v4 仍支持且现有测试无法等价覆盖的能力。
- 完成口径：每阶段均有生产构建产物契约和/或真实 Chromium 运行时证据，不以配置 shape 或 mock 代替。
- 范围：只补 v4 仍承诺支持的能力型测试；不恢复已退休的历史 `projects` 目录。

## 已验证基线

- 当前提交基线的 app catalog 有 15 个 target，全部已映射到 browser coverage。
- 默认 build acceptance 有 8 个 app；另有 6 个 supplemental artifact contract。
- 新增 `dual-role` 与 `esm-federation` 两个最小能力 app；历史 `projects` 目录仍保持 retired。

## 发布级验收结果

- `corepack pnpm test:apps:browser`：当前注册的真实 Chromium 用例全部通过。
- `corepack pnpm ci:verify`：workflow、TS7、CLI、packages、rules、release check 与 Rslib preset 全部通过。
- `corepack pnpm empbuild`：workspace package 全量构建通过。
- `corepack pnpm apps:acceptance`：14 个 app artifact contract 与 library output smoke 全部通过。
- 已知非阻断告警：Vue 2 fixture 的 Module Federation DTS 仍会输出既有 TS5055 fallback 警告，但构建、artifact contract 和浏览器验收均成功。

## 执行顺序

| 阶段 | 目标能力 | 上游场景参考 | 计划交付 | 最小验收 |
| --- | --- | --- | --- | --- |
| 1 | Runtime API 动态加载 | `runtime-18-*`、`local-build-remote-dev-demo` | ✅ `mf-app` dev consumer 使用独立 `EMPRuntime` 加载 production `mf-host` | `init → register → load → render` 与未知 expose 诊断均通过 |
| 2 | ESM Federation | `esm-react-app`、`esm-react-host` | ✅ `esm-federation` 产出原生 module container | Chromium 原生 `import()` 后执行 `init/get` 并调用远程导出 |
| 3 | Vue3-in-Vue2 | `vue3-in-vue2` | ✅ `vue-2-project` app-local adapter 加载 `vue-3-base/PiniaCount` | props 更新、Pinia 0→1、unmount、重挂载状态重置均通过 |
| 4 | Federation splitChunks | `mf-split-chunk` | ✅ `mf-host/App` 增加远程异步 JS/CSS | manifest 标记 async assets，浏览器点击后确认新 chunk 请求与渲染 |
| 5 | 双角色与 dts | `app-and-host` | ✅ `dual-role` 同一产物运行于 8201/8202 | 双端口互相执行 container `init/get`；DTS 解压后独立 `tsc --strict` 通过 |
| 6 | Tailwind MF 隔离 | `tailwindcss-app`、`tailwindcss-host` | ✅ `mf-app` 动态消费 `tailwind-4/ScopedCard` | remote utility computed style 生效，host sentinel 加载前后完全一致 |

## 次级候选（按支持承诺决定）

| 优先级 | 能力 | 当前结论 | 本轮动作 | 完成证据 |
| --- | --- | --- | --- | --- |
| P0 | `autoPages` | 默认 `src/pages` 的 TS 入口和 HTML 产物已覆盖；自定义目录、TSX/JSX 发现仍缺 | 扩展 CLI real fixture，不新增 catalog app | 自定义 path 下 TSX/JSX 页面生成、标题、mountId 与 bundle 文本断言通过 |
| P0 | PostCSS / Stylus / vw-rem | PostCSS helper 与 loader shape 已覆盖；Stylus 只有 loader shape，没有真实编译输出 | 在独立输出测试中补真实编译证据，避免占用共享 apps catalog | PostCSS rem/vw 输出与 Stylus 编译 CSS 均由真实处理器产生 |
| P1 | React Router / Wouter | 当前支持面由 React 19 TanStack app 覆盖；上游 React Router/Wouter app 已 retired | 不恢复历史 app；只核对仍发布的 CDN/library artifact contract | 现有 library output/static-service 契约覆盖，或记录明确缺口 |
| P1 | 多 React 版本 / eager shared | adapter 与 version-isolation 已覆盖配置和运行时隔离；历史 eager app 已 retired | 不把路由或 retired app 混入 version-isolation；仅在现有契约缺失时补独立断言 | 版本隔离测试与 bridge browser 继续通过 |
| P2 | popup、Pixi、ES5、unpkg、旧 UI demo | 非当前 v4 承诺面 | 保持 retired，不实现 | catalog/rules 明确分类且无公开文档推荐 |

## 第二阶段完成结果

- `autoPages` real fixture 已覆盖自定义 `path` 下的 TSX/JSX 页面发现、嵌套 HTML、标题、mountId 与 bundle marker。
- PostCSS real output 已扩展到 `calc()` 中的 rem/vw 转换和 `1px` 保留；Stylus 已覆盖变量、嵌套与算术的真实编译输出。
- React Router/Wouter 与多 React 版本不恢复 retired app：现有 library HTTP smoke、static-service 端口冲突规则、adapter browser 和 version-isolation 契约继续作为支持证据。
- 定向检查：autoPages 2/2，plugin output + apps rules 27/27。
- 统一检查：`ci:verify`、`apps:acceptance`、`test:apps:browser` 全部通过；执行时保留了工作区内其他兼容性改动，本提交不包含那些文件。

## 第二阶段执行与停止条件

1. ✅ 完成两个互不共享写状态的批次：CLI `autoPages` real test、CSS output test。
2. 不修改当前其他会话正在占用的 `scripts/apps.catalog.mjs`、root browser targets、apps acceptance、lockfile 和现有兼容 app。
3. ✅ 两个批次各自通过定向测试后，运行 rules 与 CLI/package 最小回归。
4. ✅ 已运行 `ci:verify`、包含全量 `empbuild` 的 `apps:acceptance`，以及真实 Chromium apps browser。
5. ✅ 当前 v4 支持面中的真实缺口全部有证据后停止；不以恢复 retired 目录作为完成条件。

## 明确不做

- 不恢复 `tailwind-2`、`tailwind-3` 和其他已 catalog 为 retired 的目录。
- 不将历史 demo 的目录数量作为覆盖率指标。
- 仅为能力验收新增或调整 `apps/**`；依赖图只增加两个 workspace app 对现有 workspace package 的引用。

## 每阶段进入前检查

1. 从 `git status --short --branch` 重新确认工作区稳定，并保留其他会话改动。
2. 重新核验 upstream `main/projects` 与当前 catalog，避免以旧审计结果直接落地。
3. 先在现有 target 中寻找可复用宿主；仅在无等价宿主时新增最小 fixture。
4. 每阶段单独运行对应 browser/build 入口，再运行 apps rules 与 browser-coverage rules。
