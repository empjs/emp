# Upstream `projects` 覆盖补齐计划

## 状态

- 当前阶段：6/6 阶段完成，发布级验收全部通过。
- 完成口径：每阶段均有生产构建产物契约和/或真实 Chromium 运行时证据，不以配置 shape 或 mock 代替。
- 范围：只补 v4 仍承诺支持的能力型测试；不恢复已退休的历史 `projects` 目录。

## 已验证基线

- 当前 app catalog 有 15 个 target，全部已映射到 browser coverage。
- 默认 build acceptance 保持 8 个 app；另有 6 个 supplemental artifact contract。
- 新增 `dual-role` 与 `esm-federation` 两个最小能力 app；历史 `projects` 目录仍保持 retired。

## 发布级验收结果

- `corepack pnpm test:apps:browser`：18 个测试文件、22 个真实 Chromium 用例全部通过。
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

- `autoPages: true` 的文件路由生成。
- React Router / Wouter 的专门深链与懒加载覆盖。
- PostCSS、Stylus、vw/rem 的真实 app build/browser 集成（当前已有配置和输出级测试）。
- 多 React 版本隔离与 eager shared。
- popup、Pixi、ES5、unpkg 场景；仅在产品仍承诺兼容时纳入。

## 明确不做

- 不恢复 `tailwind-2`、`tailwind-3` 和其他已 catalog 为 retired 的目录。
- 不将历史 demo 的目录数量作为覆盖率指标。
- 仅为能力验收新增或调整 `apps/**`；依赖图只增加两个 workspace app 对现有 workspace package 的引用。

## 每阶段进入前检查

1. 从 `git status --short --branch` 重新确认工作区稳定，并保留其他会话改动。
2. 重新核验 upstream `main/projects` 与当前 catalog，避免以旧审计结果直接落地。
3. 先在现有 target 中寻找可复用宿主；仅在无等价宿主时新增最小 fixture。
4. 每阶段单独运行对应 browser/build 入口，再运行 apps rules 与 browser-coverage rules。
