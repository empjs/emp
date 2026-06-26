# apps Rstest Consolidation Implementation Plan

## Goal

梳理 `apps/**` 下当前 59 个 demo / 验收项目，明确哪些是能力覆盖必须保留、哪些是重复或可合并候选，并把当前分散的规则测试迁移到统一 Rstest 入口。完成后，仓库应具备：

- 一份可复跑的 apps 清单与能力矩阵，能解释每个 app 覆盖的能力、保留原因、合并关系和验收命令。
- 一套统一由 Rstest 承载的规则测试，覆盖 app 发现、重复检测、脚本/配置校验、发布范围保护和 bench/path filter 行为。
- 一组分层真实验收用例，默认颗粒度保持小而快；Module Federation 只保留最小配对链路，其余以单项目构建和产物断言覆盖。
- 一个保守迁移路径：先改测试与清单，再合并冗余 app，最后更新文档与 `apps:acceptance`，避免一次性删除导致覆盖能力丢失。

## Architecture

当前 `apps` 既承担 demo 展示，也承担发布外的真实验收项目职责。目标结构保持这一定位，但增加“清单驱动”的治理层：

- `scripts/apps.mjs` 继续作为 apps 发现、校验、bench 命令生成入口。
- Rstest 规则测试覆盖 `scripts/apps.mjs` 和 release 规则，替代历史 `node:test` / 直接 `node scripts/*.test.mjs`。
- `apps/README.md` 作为人工可读的能力矩阵，记录 canonical app、覆盖能力、合并状态、验收命令。
- 根 `package.json` 继续保留 `apps:check`、`apps:acceptance`、`test:rules`、`ci:verify` 这些入口，但 `test:rules` 迁移为 Rstest 统一运行。
- 验收分为 metadata、single-app build、paired integration 三层；默认 CI 优先跑前两层，paired integration 只覆盖最小必要链路。
- Rstest 既承载规则测试，也承载真实验收测试；真实验收必须执行实际 CLI/build 命令并断言产物，不用 mock 替代工具链行为。

目标数据模型不引入复杂数据库，只在脚本层抽象三个结构：

- `AppDescriptor`: `dir`、`name`、`root`、`packagePath`、`configFile`、`scripts`、`dependencies`、`devDependencies`。
- `AppIssue`: `severity`、`code`、`dir`、`message`、`suggestedAction`。
- `CapabilityEntry`: `capability`、`canonicalApp`、`supportApps`、`acceptanceCommand`、`status`、`mergePolicy`。

## Tech Stack

- 包管理：`corepack pnpm@10.33.0`，与根 `packageManager` / `engines` 保持一致。
- 测试框架：`@rstest/core@0.10.6`，沿用 `packages/cli` 已有版本。
- 测试环境：Node。
- 断言风格：`import {describe, expect, test} from '@rstest/core'`。
- 真实命令执行：Node `child_process`，只在验收测试中运行实际 `corepack pnpm@10.33.0 ...` 命令。

## Global Constraints

- 本计划阶段只落计划文件，不修改 app、脚本、测试、依赖或 lockfile。
- 实施阶段不得删除能力覆盖未被证明重复的 app；删除或合并前必须有 Rstest 与真实构建验收兜底。
- 测试颗粒度默认缩小到单 app；只有验证跨应用协同时才允许要求两个或多个 app 同时参与。
- Module Federation 不把“每个场景都创建 host + remote”作为默认要求；默认验证 remote manifest、类型产物和 host 配置解析，完整 host/remote 联动只保留一条最小代表链路。
- Tailwind/CSS 默认 canonical 收敛到 Tailwind v4；v2/v3 作为 legacy compatibility，不进入默认 acceptance，除非该版本能力被明确声明仍需保障。
- 缩小测试颗粒度不等于降级为纯单测；acceptance 层必须包含真实 CLI、真实构建、真实产物文件断言，必要时补 HTTP 服务或浏览器断言。
- `apps/**` 和 `website` 仍然不进入发布包范围；release 规则必须持续验证这一点。
- 合并 app 时优先保留目录语义清晰、脚本完整、当前验收链路引用的 canonical app。
- 重命名 app 目录属于高风险变更；除非验收覆盖 path filter、workspace filter、文档链接和 acceptance 脚本，否则不与功能合并混在同一批。
- 当前 Codex runtime 的直接 `pnpm` 可能解析到 11.x；所有计划中的验证命令显式使用 `corepack pnpm@10.33.0`。
- 新增测试统一使用 Rstest；历史 `.mjs` 规则测试迁移完成后删除，不再扩展 `node:test` 风格用例。
- 不提交生成物、缓存、本地索引和构建产物，包括 `dist/`、`output/`、`.turbo/`、`.rspack-cache/`、`.codebase-memory/`。

## Current Findings

已完成的 live 检查：

- 计划起草时当前分支为 `v4...origin/v4`；提交前 live 状态需要重新检查，且本计划文件本身可能是唯一未跟踪改动。
- `codebase-memory-mcp` 已启用，当前 EMP 索引状态为 ready。
- `corepack pnpm@10.33.0 apps:check` 通过，发现 59 个 apps，当前 `issues: []`。
- 直接运行 `pnpm` 会命中 11.x runtime，与仓库 `pnpm@10.33.0` 要求不一致；后续命令使用 `corepack pnpm@10.33.0`。
- 当前测试混用 Rstest 与旧式脚本：
  - `packages/cli` 已有 Rstest 配置和 `.test.ts` 用例。
  - `scripts/apps.test.mjs`、`scripts/release.test.mjs` 仍是旧入口。
  - 根 `test:rules` 仍运行 `node --test scripts/release.test.mjs && node scripts/apps.test.mjs`。

最新执行注意：

- 后续会话中工作区已出现大量用户侧改动，实施时必须基于最新 `git status` 重新确认，不得按本计划早期“工作区干净”的记录覆盖用户改动。
- 本计划的目标是重新规划 `apps`，不是继续增加 demo 数量；默认策略是用最少代表 app 做真实测试，再用矩阵说明其它 app 的覆盖关系。

当前重复包名和初步处理方向：

| 重复包名 | 目录 | 初步处理 |
| --- | --- | --- |
| `react-19-tanstack` | `react-19-tanstack`, `react-tanstack` | 对比入口、依赖和路由；若 `react-tanstack` 只是旧命名，合并到 `react-19-tanstack`。 |
| `tailwind-demo` | `tailwind-4`, `tailwind-4-polyfill`, `tailwind-demo`, `tailwindcss-app` | 默认保留 `tailwind-4` 为 canonical；v2/v3/旧 demo 降为 legacy 或合并候选，polyfill 和 MF remote/host 只在能力独立时保留。 |
| `unpkg-lib` | `unpkg-demo`, `unpkg-lib` | 优先迁移到 Rslib/CDN fixture；迁移前修正 `unpkg-demo` 包名，避免重复 package name 干扰目录 filter。 |
| `vue-3-project` | `vue-3-project`, `vue3-app`, `vue3-host` | 对比 Vue 3 基线、remote/host、router/pinia 覆盖；保留 canonical 能力，合并旧 duplicate。 |

## Lean Replan V2 - Authoritative

本节是当前执行口径，优先级高于后面的展开分类。目标是：真实测试覆盖当前 `apps` 里的用例，但默认测试集尽量少、代码尽量少、运行尽量快。

### Lean Principles

- 不追求每个 app 都默认 build；默认只跑能代表一类能力的 canonical app。
- 不新增 demo app；Rslib/CDN 场景优先复用现有 `packages/cdn-*`、`packages/lib-*`、`packages/emp-share` 的 Rslib 产物和静态服务能力。
- 不为每个能力写一份测试文件；优先用一个小的 Rstest acceptance 表驱动执行。
- 不把 MF 的所有变体都做 browser e2e；只保留一条 browser e2e，其它 MF 变体做 build/manifest 或按需触发。
- 不用 mock 代替真实工具链；默认验收必须跑真实 CLI/build/HTTP/browser 中至少一种真实链路。

### Default Real Test Pack

默认 `apps:acceptance` 只覆盖下列代表性链路：

| 覆盖用例 | canonical subject | 为什么选它 | 默认真实测试 |
| --- | --- | --- | --- |
| EMP build baseline / Rspack 2 module | `rspack2-modern-module` | 覆盖现代模块输出和基础构建链路 | `--filter ./apps/rspack2-modern-module build` + 产物断言 |
| Rspack optimization | `rspack2-optimization` | 覆盖优化配置，当前已在 acceptance 中 | `--filter ./apps/rspack2-optimization build` + chunk 断言 |
| React + MF runtime browser | `@empjs/share`, `mf-host`, `mf-app` | 覆盖 React runtime、MF remote、runtime sdk、真实浏览器交互 | 启动 `2100/6001/6002`；断言 `emp.json` 200、remote 渲染、按钮交互、无新增 console error |
| Vue 3 MF provider | `vue-3-base` | 覆盖 Vue3 remote exposes 和 MF manifest | `--filter ./apps/vue-3-base build` + manifest/exposes 断言 |
| Vue 3 MF consumer | `vue-3-project` | 覆盖 Vue3 consumer remote 配置和页面入口 | `--filter ./apps/vue-3-project build` + remote 配置/入口产物断言 |
| Tailwind v4 | `tailwind-4` | Tailwind 默认只保留 v4 canonical | `--filter ./apps/tailwind-4 build` + CSS 产物断言 |
| React router/query | `react-19-tanstack` | 覆盖当前 React 19 + TanStack Router + Tailwind 组合 | `--filter ./apps/react-19-tanstack build` + route/CSS 产物断言 |
| Rslib/CDN library output | existing `packages/cdn-*` / `packages/lib-*` / `packages/emp-share` | 替代 `lib-react/lib-main` 和 `unpkg-*` 的库产物用例，不新增 app | Rslib package build + static service HTTP/browser smoke |

默认包控制在 7 个 app 目录 + 现有 Rslib packages。这样能覆盖当前主用例，又避免 59 个 app 全量 build。

### Current Apps Coverage Mapping

| 当前用例族 | 默认覆盖 | 非默认 apps 处理 |
| --- | --- | --- |
| Module Federation React host/remote | `mf-host` + `mf-app` + `@empjs/share` | `lib-main/lib-react`、`unpkg-*`、`react-eager-*`、`esm-react-*`、`app-and-host` 不默认 e2e；按 Rslib/CDN 或专项触发处理。 |
| Module Federation Vue3 | `vue-3-base` + `vue-3-project` build/manifest | `vue3-host/vue3-app` 若无独立能力则合并；`adapter-vue3-host` 归 adapter 专项。 |
| Tailwind/CSS | `tailwind-4` | `tailwind-2/3/polyfill` 归 legacy；`tailwind-demo` 合并候选；`tailwindcss-app/host` 只有证明跨 remote CSS 独立能力才保留专项。 |
| React runtime/router | `mf-host/mf-app` 覆盖 React runtime，`react-19-tanstack` 覆盖 router/query | `react-18-runtime`、`react-16-adapter-18`、`runtime-18-*` 归 legacy/runtime 专项。 |
| Vue2/adapter/cross-version | 默认不跑 | `vue-2-*`、`vue3-in-vue2`、`adapter-*` 按修改 Vue/adapter/bridge 时触发。 |
| Rslib/CDN/library | 现有 packages 的 Rslib build + static service | `lib-react/lib-main` 删除候选；`unpkg-lib/unpkg-demo` 迁移到 Rslib/CDN fixture 后删除或降专项。 |
| Proxy/assets/mobile/old demos | 默认不跑 | `demo` 作为手工综合样例保留；`proxy-demo`、`auto-pages`、`mobile-vw-rem`、`pixi-js-demo`、`old-func-demo` 只有对应能力变更时触发或合并。 |

### Minimal Implementation Shape

为减少代码量，实施时优先采用：

- 一个 Rstest rules 文件：迁移现有 `scripts/apps.test.mjs` / `scripts/release.test.mjs`，保留 app discovery、重复包名、path filter、release guard。
- 一个 Rstest acceptance 文件：内部只放一张 `DEFAULT_REAL_TEST_PACK` 表，按表执行真实命令和产物断言。
- 一个小型服务 helper：仅服务 P0 MF browser e2e 和 Rslib static smoke，复用已有 static service 能力；不为每个 app 写独立启动逻辑。
- 一个 `apps/README.md` 矩阵：列出每个 app 属于 default、compat、scenario、merge candidate、remove candidate 中哪一类。
- 不新增 `buildCapabilityMatrix` 这类泛化抽象，除非后续重复逻辑已经明显超过表驱动能承受的范围。

### Fast Feedback Gates

建议把命令分为三档：

```bash
# < 10s 级别，规则和清单
corepack pnpm@10.33.0 test:rules
corepack pnpm@10.33.0 apps:check

# 默认真实验收，构建少量 canonical apps + 一条 MF browser 链路
corepack pnpm@10.33.0 apps:acceptance

# 相关能力专项，按路径或手动触发
corepack pnpm@10.33.0 test:apps:compat -- --group vue2
corepack pnpm@10.33.0 test:apps:compat -- --group tailwind-legacy
corepack pnpm@10.33.0 test:apps:compat -- --group adapter
```

验收是否合格以默认真实验收为准；compat 失败只阻塞触发它的相关改动。

## Detailed Apps Portfolio

重新规划后，`apps/**` 不再按 demo 数量表达完整性，而是按可验证能力分层。每个 app 在 `apps/README.md` 中必须落到一个层级、一个能力域和一个去留策略。

### P0 - Default Paired Browser E2E

P0 是默认真实联动验收，只保留最能证明跨应用运行能力的一条链路。

| 能力域 | canonical apps | 支撑服务 | 真实测试方式 | 断言 |
| --- | --- | --- | --- | --- |
| Module Federation host/remote runtime | `mf-host`, `mf-app` | `@empjs/share` runtime on `2100/sdk.js` | 启动 `@empjs/share start`、`mf-host dev`、`mf-app dev`，用浏览器打开 `mf-app` | `6001/emp.json` 200；manifest exposes 包含 `./App`；页面出现 `MF-Host` 和 `MF-APP`；点击 remote 内按钮后 `count is 0` 变为 `count is 1`；启动 runtime 后无新增 console error。 |

P0 的意义是证明 EMP v4 + Module Federation + runtime sdk + 浏览器渲染的真实链路可用。其它 MF app 不默认进入 P0，除非覆盖了这条链路无法代表的能力。

### P1 - Default Single-App Acceptance

P1 是默认 `apps:acceptance` 的主集合，要求真实 CLI/build 和产物断言，但不要求两个或多个 app 同时运行。

| 能力域 | canonical app | 测试方式 | 关键断言 | 去留策略 |
| --- | --- | --- | --- | --- |
| Rspack 2 modern module | `rspack2-modern-module` | `corepack pnpm@10.33.0 --filter ./apps/rspack2-modern-module build` | 构建成功；目标 JS/CSS 产物存在；构建日志无 fatal error。 | `keep` |
| Rspack 2 optimization | `rspack2-optimization` | `corepack pnpm@10.33.0 --filter ./apps/rspack2-optimization build` | 构建成功；优化相关 chunk 产物存在。 | `keep` |
| React 19 runtime | `react-19-runtime` | 单 app build | 构建成功；runtime script/css 产物存在。 | `keep` |
| React 19 router/query | `react-19-tanstack` | 单 app build | 构建成功；route entry 产物存在；Tailwind v4 相关 CSS 产物存在。 | `keep` |
| Vue 3 base remote | `vue-3-base` | 单 app build | 构建成功；MF manifest/type 产物存在。 | `keep` |
| Vue 3 consumer/project | `vue-3-project` | 单 app build | 构建成功；remote 配置可解析；页面入口产物存在。 | `keep` |
| Tailwind CSS v4 | `tailwind-4` | 单 app build | 构建成功；CSS 产物存在且包含 Tailwind v4 样式输出。 | `keep` |
| Rslib library output | `rslib-react-lib` 或等价 Rslib fixture | Rslib build + 静态服务 browser smoke | UMD/ESM 产物存在；React peer/external 处理符合预期；浏览器可通过 global 或 ESM import 渲染最小组件。 | 新建后 `keep` |

P1 的目标是把默认 acceptance 控制在约 8-10 个 app，覆盖主能力面，但避免 59 个 app 全量构建导致反馈慢、失败噪声大。

### P2 - Compatibility And Scenario Acceptance

P2 代表仍有价值但不进入默认 acceptance 的兼容或专项场景。它们应保留在仓库中，但需要在矩阵中标注触发条件。

| 能力域 | apps | 触发条件 | 测试方式 | 去留策略 |
| --- | --- | --- | --- | --- |
| Tailwind legacy | `tailwind-2`, `tailwind-3`, `tailwind-4-polyfill` | 修改 Tailwind plugin、CSS polyfill、PostCSS/LightningCSS 相关逻辑时 | 单 app build + CSS artifact 断言 | `legacy keep` |
| Vue 2 compatibility | `vue-2-base`, `vue-2-project`, `vue-2-element`, `vue-2-stylus` | 修改 Vue2 plugin、Vue bridge、legacy runtime 时 | 单 app build；必要时浏览器 smoke | `legacy keep` |
| Vue cross-version | `vue-3-with-vue-2`, `vue3-in-vue2` | 修改 Vue2/Vue3 共存、adapter 或 bridge 逻辑时 | 单 app build + 页面 smoke | `scenario keep` |
| React legacy/runtime | `react-16-adapter-18`, `react-18-runtime`, `runtime-18-host`, `runtime-18-app` | 修改 React adapter、runtime version isolation、cdn-react-18 时 | 单 app build；必要时配对 smoke | `legacy keep` |
| Runtime layout/provider | `rtHost`, `rtLayout`, `rtProvider` | 修改 runtime provider/layout、forceRemotes、runtime sdk 时 | 单 app build；专项时配对 smoke | `scenario keep` |
| Adapter bridge | `adapter-host`, `adapter-app`, `adapter-vue2-host`, `adapter-vue3-host` | 修改 `@empjs/bridge-*` 或 adapter 能力时 | 单 app build + manifest/config 断言 | `scenario keep` |
| ESM/eager/split chunks | `esm-react-host`, `esm-react-app`, `react-eager-host`, `react-eager-app`, `mf-split-chunk`, `mf-v3-host` | 修改 module output、eager shared、split chunk、MF v3 compatibility 时 | 单 app build；专项时 paired smoke | `scenario keep` |
| Static/proxy/assets/mobile | `proxy-demo`, `auto-pages`, `mobile-vw-rem`, `pixi-js-demo`, `es5-import-demo` | 修改 proxy、auto pages、asset handling、mobile transform、ES5 import 时 | 单 app build + artifact/HTML 断言 | `scenario keep` |
| Local remote dev workflow | `local-build-remote-dev-demo`, `app-and-host`, `emp-window-demo` | 修改 dev server、runtime remote registration、本地联调能力时 | 专项服务启动 + browser smoke | `scenario keep` |
| UI library examples | `daisyui-demo`, `shadcn-ui`, `react-router-demo`, `react-wouter` | 修改对应 plugin、router 或 UI 样式集成时 | 单 app build | `scenario keep` |
| CDN/Unpkg shared resolution | `unpkg-demo`, `unpkg-lib` 迁移前过渡 | 修改 runtime global plugin、CDN shared resolution 或 Unpkg/esm.sh 加载策略时 | 迁移前跑现有 MF pair；迁移后跑 Rslib CDN/global browser smoke | `migrate to rslib` |

P2 不等于不用测，而是按改动类型触发。CI 默认可以跳过，release 前或相关目录变更时通过路径规则触发。

### P3 - Merge, Rename, Or Remove Candidates

P3 先通过 catalog audit 标记，再逐组处理；每组完成前必须证明 canonical app 的真实测试仍通过。

| 候选组 | 问题 | 处理顺序 | 验收 |
| --- | --- | --- | --- |
| `react-tanstack` -> `react-19-tanstack` | package name 完全重复，依赖和能力高度重叠 | diff source/config；保留唯一能力到 `react-19-tanstack`；删除旧目录 | `react-19-tanstack` P1 build + route/CSS artifact 断言 |
| `tailwind-demo` -> `tailwind-4` | 旧 Tailwind demo 能力大概率被 v4 canonical 覆盖 | 比对 PostCSS/Tailwind 配置；若无独立能力则删除 | `tailwind-4` P1 build + CSS artifact 断言 |
| `tailwindcss-app` / `tailwindcss-host` | package name 与 Tailwind 组冲突，且不应默认成对运行 | 若仅验证 CSS remote 产物，降为 P2 单 app；若无独立能力，合并到 `tailwind-4` 文档或专项 fixture | Tailwind CSS artifact；必要时一条专项 paired smoke |
| `vue3-app` / `vue3-host` -> `vue-3-project` / `vue-3-base` | `vue-3-project` package name 重复 | 判断是否是旧命名 host/app；若能力被 canonical 覆盖则合并删除 | `vue-3-base` + `vue-3-project` P1 build |
| `unpkg-demo` / `unpkg-lib` | package name 重复且 MF remote 能力与 P0 重叠，但仍可能覆盖 CDN shared resolution | 优先设计 Rslib CDN/global fixture；迁移完成后删除现有 MF pair 或降为专项 | Rslib build + static browser smoke；迁移前保留两者 build |
| `lib-main` / `lib-react` | lib provider/consumer 命名和 MF 能力已大概率被 Rslib fixture 与 P0 覆盖 | 迁移到 Rslib library fixture 后删除这条 MF pair | Rslib build + static browser smoke |
| `old-func-demo` / `demo` | 旧 API 或综合 demo 可能与默认能力重复 | 保留 `demo` 作为手工综合样例；`old-func-demo` 需要说明旧 API 覆盖点，否则移入 remove 候选 | `demo` 单 app build |

### Rslib Replacement Track

`unpkg-lib`、`unpkg-demo`、`lib-react`、`lib-main` 当前都带有“库产物”和“Module Federation remote/consumer”双重语义。重新规划时要拆开处理：

| 现有 apps | 当前职责 | 是否适合 Rslib 取代 | 规划 |
| --- | --- | --- | --- |
| `lib-react` / `lib-main` | `lib-react` 通过 `empShare.exposes` 暴露 `.`，`lib-main` 通过 `libReact@http://localhost:3301/emp.js` 消费 | 适合 | MF 联动能力已由 P0 `mf-host + mf-app` 覆盖；这组如果只是证明 React library output，应迁到 Rslib library fixture，并删除 `lib-react` / `lib-main` 这条 MF pair。 |
| `unpkg-lib` / `unpkg-demo` | `unpkg-lib` 暴露 `./App`，`unpkg-demo` 通过 `unpkglib@http://localhost:3300/emp.js` 消费，同时包含 runtime global plugin / CDN shared resolution 意图 | 有条件适合 | 如果目标是 CDN/Unpkg library consumption，迁到 Rslib-built UMD/ESM fixture；如果目标是 MF remote loading，则不再单独保留，因为 P0 已覆盖 MF remote。 |

Rslib 迁移后的验收不再用 MF manifest 作为主断言，而是验证库产物契约：

- `corepack pnpm@10.33.0 --filter ./apps/rslib-react-lib build` 或等价 Rslib fixture build 成功。
- 输出 UMD/ESM 产物存在，例如 `dist/index.umd.js`、`dist/index.mjs`。
- React / ReactDOM 等 peer dependency 不被错误打进库产物，或按 fixture 约定生成外部依赖。
- 静态服务加载产物后，浏览器能访问全局变量或 ESM import，并渲染一个最小组件。
- 如果保留 unpkg/CDN 语义，浏览器断言 CDN shared resolution 生效，而不是断言 `emp.js` remote manifest。

迁移边界：

- 不用 Rslib 替代 P0 的 `mf-host + mf-app`，因为 P0 的目标是验证 Module Federation runtime。
- 不在默认发布包范围内新增长期发布包，除非后续明确要把该 Rslib fixture 提升为 `packages/lib-*`。
- 如果 Rslib fixture 放在 `apps/**`，`scripts/apps.mjs` 需要支持 `kind: rslib-library`，避免把它误判为缺少 EMP config 的坏 app。

### Acceptance Script Shape

默认 `apps:acceptance` 建议拆成两段，避免每次都启动大量服务：

```bash
corepack pnpm@10.33.0 empbuild
corepack pnpm@10.33.0 apps:check
corepack pnpm@10.33.0 test:apps:single
corepack pnpm@10.33.0 test:apps:mf
```

其中：

- `test:apps:single` 运行 P1 单 app build 和产物断言。
- `test:apps:mf` 只运行 P0 的 `@empjs/share` + `mf-host` + `mf-app` 浏览器链路。
- P2 通过 `test:apps:compat -- --group <name>` 或路径变更规则触发，不进入默认 acceptance。

### App-Level Definition Of Done

每个保留 app 必须满足：

- `package.json` name 唯一，除测试 fixture 外不允许重复。
- 有明确能力域和测试层级。
- 有可执行的验证命令，且命令使用目录 filter：`--filter ./apps/<dir>`。
- 如果依赖支撑服务，矩阵里必须写清服务、端口、启动顺序和健康检查 URL。
- 如果是 P0/P1，必须有真实 CLI/build 或 browser 断言。
- 如果是 P2，必须写清触发条件。
- 如果是 P3，必须写清 canonical app 和删除前验收命令。

## Consolidation Policy

合并判断使用四类证据，而不是只看目录名或包名：

- 配置证据：`emp.config.*` / `rspack.config.*` 是否覆盖不同能力。
- 运行证据：`dev`、`build`、`start`、`stat` 是否存在并能执行。
- 产物证据：是否生成不同 MF manifest、remote entry、类型产物、CSS 产物或 runtime artifact。
- 文档证据：`apps/README.md`、`apps:acceptance`、包依赖关系是否引用该 app。

合并策略：

- `keep`: 代表独立能力或核心验收路径，保留并纳入矩阵。
- `merge`: 能力完全被 canonical app 覆盖，迁移独有代码后删除旧目录。
- `rename-only`: 目录或包名重复但能力独立，只修正 package name 或展示名。
- `defer`: 需要更长真实验收，当前批次不删除。

初步候选：

| 目录组 | 计划结论 | 验收口径 |
| --- | --- | --- |
| `react-19-tanstack` / `react-tanstack` | 倾向合并为 `react-19-tanstack` | 两者 build 产物、依赖和页面能力一致时删除旧目录。 |
| `tailwind-4` / `tailwind-4-polyfill` | 默认保留 v4 canonical，polyfill 仅在兼容能力独立时保留 | `tailwind-4` 进入默认 acceptance；polyfill 用单独 artifact 断言验证，不扩大默认矩阵。 |
| `tailwind-2` / `tailwind-3` / `tailwind-demo` | 降为 legacy 或合并候选 | 只有存在仍需维护的旧版本兼容场景才保留，否则合并到 `tailwind-4` 文档或删除。 |
| `tailwindcss-app` / `tailwindcss-host` | 不默认要求成对运行 | 若只验证 Tailwind remote 样式产物，保留单 app build；完整 host/app 联动只纳入最小 MF 配对链路。 |
| `unpkg-demo` / `unpkg-lib` | 迁移到 Rslib/CDN fixture | 迁移前修正重复包名并保留过渡验证；迁移后不再作为 MF pair 保留。 |
| `vue-3-project` / `vue3-app` / `vue3-host` | 倾向收敛到 Vue 3 canonical 组 | 如果 host/app 是 MF 配对场景则保留配对；如果只是旧命名 demo 则合并。 |
| `rtHost` / `rtLayout` / `rtProvider` | 当前批次不重命名目录 | runtime layout 能力独立；目录命名可在后续独立批次处理。 |
| `demo` / `proxy-demo` / `local-build-remote-dev-demo` / `pixi-js-demo` | 保留 | 覆盖代理、开发联调、非典型资产或基础 demo，不作为重复项。 |

## Missing Test Cases

需要补齐的 Rstest 用例分为规则层、单 app 验收层和最小配对验收层。

规则层：

- app 发现：只扫描 `apps/*/package.json`，按 `name` 排序，返回 `dir`、`root`、`configFile`、`scripts`。
- package name 重复：输出 grouped issue，不阻塞普通发现，但在 strict check 中作为需要处理的问题。
- package name 唯一性例外：允许配对场景保留不同目录，但必须不同 package name。
- required scripts：校验 `dev`、`build`、`start`、`stat` 的存在性或明确豁免。
- config 检测：识别 `emp.config.*`、`rspack.config.*`，缺失时报出可定位问题。
- path filter：bench 与 acceptance 命令必须使用 `--filter ./apps/<dir>`，避免重复 package name 误选。
- release guard：`apps/**`、`website` 不进入发布包范围，即使 app package name 以 `@empjs/*` 开头也不能被识别为内部发布包。

单 app 验收层：

- Module Federation remote：优先验证单项目 build 成功、manifest/remote/type artifact 存在，不要求每个 remote 都同时拉起 host。
- Vue：`vue-2-demo`、`vue-3-base`、`vue-3-project` 覆盖 Vue 2/3 差异与 MF 场景。
- React runtime：`react-18`、`react-19`、`react-19-tanstack` 覆盖 React 主版本与路由/query 场景。
- Rspack 2：`rspack2-modern-module`、`rspack2-optimization` 覆盖现代模块和优化配置。
- CSS/Tailwind：`tailwind-4` 作为默认 canonical；`tailwind-4-polyfill` 只验证 polyfill 特有产物；`tailwind-2`、`tailwind-3` 不进入默认 acceptance。
- Rslib/CDN：Rslib-built library fixture 覆盖 UMD/ESM 产物、external/peer 处理和浏览器静态加载；`unpkg-demo`、`unpkg-lib` 只作为迁移前过渡。
- Runtime layout：`rtHost`、`rtLayout`、`rtProvider` 覆盖布局/provider 组合场景。

最小配对验收层：

- Module Federation 只保留一条代表性 host/remote 联动链路，例如 `mf-host` + `mf-app`。
- Tailwind MF 场景只在样式跨 remote 注入确实需要验证时进入配对验收，否则保留单 app CSS artifact 断言。
- 配对验收不纳入所有 apps 的默认矩阵，避免每个能力都被迫创建两个或多个项目。

## Task 1 - Migrate Rule Tests To Rstest

Files:

- `package.json`
- `pnpm-lock.yaml`
- `rstest.config.ts`
- `scripts/apps.test.ts`
- `scripts/release.test.ts`
- `scripts/apps.test.mjs`
- `scripts/release.test.mjs`

Interface:

- `corepack pnpm@10.33.0 test:rules` runs `rstest run`.
- Rstest includes `scripts/**/*.test.ts` and keeps `packages/cli` package tests isolated under its package script.

Steps:

1. Add root Rstest config with Node environment and include pattern for rule tests.
2. Add root `@rstest/core@0.10.6` devDependency, matching `packages/cli`.
3. Port `scripts/apps.test.mjs` assertions to `scripts/apps.test.ts`.
4. Port `scripts/release.test.mjs` assertions to `scripts/release.test.ts`.
5. Remove legacy `.mjs` test files only after Rstest version passes.
6. Update `package.json` `test:rules` to `rstest run`.

Verification:

```bash
corepack pnpm@10.33.0 test:rules
corepack pnpm@10.33.0 ci:verify
git diff --check
```

## Task 2 - Add Apps Catalog Audit Rules

Files:

- `scripts/apps.mjs`
- `scripts/apps.test.ts`
- `apps/README.md`

Interface:

- `discoverApps(root)` remains stable.
- `validateApps(apps, options)` gains strict issue codes without breaking existing `apps:check` output shape.
- `buildCapabilityMatrix(apps)` returns canonical capability rows for docs/tests.

Steps:

1. Write Rstest fixtures for duplicate package names, missing scripts, missing config, and path filter command generation.
2. Add issue codes such as `duplicate-package-name`, `missing-required-script`, `missing-config`, `missing-src-entry`.
3. Make duplicate package detection grouped by package name with all directories listed.
4. Keep path filter commands directory-based: `--filter ./apps/<dir>`.
5. Add matrix generation helper only if it reduces duplicated logic between tests and docs; otherwise keep matrix as explicit data in tests.

Verification:

```bash
corepack pnpm@10.33.0 test:rules
corepack pnpm@10.33.0 apps:check
```

## Task 3 - Classify And Normalize Duplicate App Groups

Files:

- `apps/*/package.json` for affected duplicate groups
- `apps/README.md`
- `package.json`

Interface:

- Package names under `apps/**` should be unique unless a test fixture intentionally creates duplicates.
- `apps:acceptance` keeps using directory filters.

Steps:

1. Compare duplicate groups by config, scripts, dependencies, source entry and acceptance role.
2. Apply `keep` / `merge` / `rename-only` / `defer` labels in `apps/README.md`.
3. For `unpkg-demo` / `unpkg-lib`, design the Rslib/CDN replacement first; keep the current pair only as transitional coverage until the Rslib fixture is green.
4. For `react-tanstack` and older Vue duplicates, migrate any unique source or config into canonical app before deleting old directory.
5. Update acceptance filters only after directory removals are complete.

Verification:

```bash
corepack pnpm@10.33.0 apps:check
corepack pnpm@10.33.0 test:rules
corepack pnpm@10.33.0 apps:acceptance
git diff --check
```

## Task 4 - Add Rstest-Driven Acceptance Coverage

Files:

- `scripts/apps.acceptance.test.ts`
- `scripts/apps.mjs`
- `package.json`

Interface:

- `corepack pnpm@10.33.0 test:rules` remains fast and deterministic.
- Heavy real build checks stay under `corepack pnpm@10.33.0 apps:acceptance` or a dedicated `test:apps:acceptance` script if runtime cost is too high for every rules run.
- Acceptance cases use the smallest viable subject: metadata checks first, then single-app build, then one representative paired integration only when cross-app behavior is the feature under test.
- Acceptance cases are real tests: they spawn `corepack pnpm@10.33.0 --filter ./apps/<dir> build` or equivalent repo scripts, then assert files under the generated app output.

Steps:

1. Add a small command runner helper that captures stdout, stderr, exit code and elapsed time.
2. Add artifact assertions for representative single apps after build.
3. Keep the default rules suite from building all 59 apps.
4. Add only one minimal MF paired integration for host/remote wiring.
5. Wire the selected real acceptance suite into `apps:acceptance`, not into release publishing flows.
6. Ensure failure output names the app directory, exact command and whether the case is metadata, single-app or paired integration.
7. For every app removed or merged, require at least one real acceptance command proving the canonical app still builds and emits the expected artifact.

Verification:

```bash
corepack pnpm@10.33.0 apps:acceptance
corepack pnpm@10.33.0 ci:verify
```

## Task 5 - Merge Redundant Apps Conservatively

Files:

- Affected `apps/<dir>/**`
- `apps/README.md`
- `package.json`
- `scripts/apps.test.ts`

Interface:

- Removed directories must no longer appear in `apps:acceptance`, docs, package filters, or tests.
- Canonical app keeps all unique behavior from merged app.

Steps:

1. Start with the smallest low-risk group: `react-19-tanstack` / `react-tanstack`.
2. Run source/config diff and build both apps before merging.
3. Preserve unique pages, dependencies, aliases or config options in canonical app.
4. Delete redundant directory only after canonical build and artifact assertions pass.
5. Repeat for Vue after Task 2 and Task 4 are green.
6. For Tailwind, make `tailwind-4` the canonical default first; then decide whether v2/v3/old demo are legacy keep or merge candidates based on explicit compatibility value.

Verification:

```bash
corepack pnpm@10.33.0 apps:check
corepack pnpm@10.33.0 apps:acceptance
corepack pnpm@10.33.0 test:rules
git diff --check
```

## Task 6 - Update Documentation Matrix

Files:

- `apps/README.md`

Interface:

- Matrix columns: `能力域`、`canonical app`、`辅助 app`、`测试层级`、`状态`、`验收命令`、`合并策略`。
- 状态值：`keep`、`merge`、`rename-only`、`defer`。
- 测试层级值：`metadata`、`single-app`、`paired-integration`。

Steps:

1. Replace the current broad capability table with canonical app mapping.
2. Add duplicate group handling notes directly in matrix rows, not as scattered prose.
3. Document why `apps/**` remains outside release package scope.
4. Mark Tailwind v4 as the default canonical CSS case; v2/v3 only appear as legacy compatibility rows when retained.
5. Reference `corepack pnpm@10.33.0 apps:check` and `corepack pnpm@10.33.0 apps:acceptance` as authoritative verification.

Verification:

```bash
corepack pnpm@10.33.0 apps:check
git diff --check
```

## Task 7 - Final Verification Package

Files:

- All files touched by Tasks 1-6

Interface:

- Final local verification entry remains `corepack pnpm@10.33.0 ci:verify`.
- Build-chain validation remains `corepack pnpm@10.33.0 empbuild` when build configs or app dependencies changed.

Steps:

1. Run full rule suite.
2. Run apps check and apps acceptance with the reduced default matrix.
3. Run full CI verification.
4. Run build-chain verification when app configs, workspace dependencies, or package source changed.
5. Capture remaining risk explicitly, especially any app group marked `defer`.

Verification:

```bash
corepack pnpm@10.33.0 test:rules
corepack pnpm@10.33.0 apps:check
corepack pnpm@10.33.0 apps:acceptance
corepack pnpm@10.33.0 ci:verify
corepack pnpm@10.33.0 empbuild
git diff --check
```

## Implementation Order

1. 先完成 Rstest rules harness，为后续清理建立回归边界。
2. 再完成 apps catalog audit，让 duplicate 判断有结构化证据。
3. 再更新 docs matrix，让用户和 CI 使用同一份能力口径。
4. 再补 acceptance coverage，优先单 app 构建和产物断言，只为跨应用能力保留最小配对链路。
5. 最后做 app consolidation，每次只处理一个 duplicate group。

## Initial Success Criteria

- `corepack pnpm@10.33.0 test:rules` 不再依赖 `node:test` 或 `.mjs` 规则测试。
- `corepack pnpm@10.33.0 apps:check` 能报告重复包名和能力矩阵风险。
- `apps/README.md` 可以解释 59 个 app 中哪些是 canonical、哪些是辅助、哪些可合并。
- 默认 acceptance 不要求每个 MF 场景都创建两个或多个项目，只保留一条最小 host/remote 联动链路。
- Tailwind/CSS 默认 canonical 为 `tailwind-4`，旧版本只作为明确的 legacy compatibility 保留。
- `apps:acceptance` 至少包含真实 CLI/build 执行和产物文件断言，不只停留在 metadata 或 helper 函数测试。
- 至少补齐一组真实 artifact 断言，覆盖 MF manifest/type、Tailwind v4 CSS 产物或 runtime layout 中的关键路径。
- 删除任何 app 前，有对应 canonical app 的 Rstest 与真实 build 证据。
