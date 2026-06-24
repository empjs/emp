# apps 新版验收项目设计

## 目标

建立 `apps/` 作为 EMP v4 后续的新版验收项目目录，用小而明确的验收 app 覆盖核心能力、Rspack 2 新能力和性能测试场景；`projects/` 保留为历史 demo 和兼容案例，并按新版验收矩阵逐步淘汰重复 demo。

## 目录定位

- `apps/`：新版验收项目，只放可自动检查、可构建、可进入性能基线的项目。
- `projects/`：历史 demo、业务展示、兼容性案例和迁移参考，不再作为新增验收项目默认目录。
- `scripts/apps.mjs`：新版验收项目的统一入口，负责列出、检查和跑性能基线。
- `apps/README.md`：记录验收项目清单、准入规则和 `projects/**` 淘汰策略。

## 准入规则

- 每个 `apps/<name>` 必须有 `package.json`、`emp.config.ts` 或 `emp-config.ts/js`、`src/`。
- 每个 app 的 `package.json` 必须提供 `dev`、`build`、`start`、`stat` 脚本。
- app 名必须表达验收能力，例如 `rspack2-modern-module`、`rspack2-optimization`。
- 新 app 必须能被 `node scripts/apps.mjs check` 发现并通过检查。
- 性能测试默认只跑 `apps/`，不自动扫描 `projects/`。

## 首批验收项目

1. `apps/rspack2-modern-module`
   - 验收 `build.useESM`、`target: 'es2018'`、`output.library.type = 'modern-module'`、`preserveModules`。
   - 用最小 TypeScript 入口，避免 React/Vue 依赖干扰构建性能。

2. `apps/rspack2-optimization`
   - 验收 `moduleIds: 'hashed'`、`splitChunks.enforceSizeThreshold`、`experiments.pureFunctions`、`parser.javascript.pureFunctions`、CSS `resolveImport`、SWC `detectSyntax`。
   - 用动态 import 和 CSS import 构造可观察的分包/解析场景。

## 性能测试设计

`node scripts/apps.mjs bench` 输出 JSON，记录：

- app 名称
- build 命令
- exit code
- 耗时毫秒
- `dist` 总大小
- JS/CSS asset 数量

默认只运行 `apps/` 下通过检查的项目。为了避免误判，bench 不负责判断快慢，只输出可比较数据。

## projects 淘汰策略

- 第一阶段：不删除 `projects/**`，只新增 `apps/` 和检查脚本。
- 第二阶段：把重复 demo 标记为 `legacy` 或 `archive`，从默认验证矩阵移除。
- 第三阶段：当 `apps/` 覆盖同等能力且连续通过验证后，再移动或删除对应旧 demo。
- 历史兼容项目如 `old-func-demo`、`es5-import-demo` 只作为 legacy 保留，不再新增同类 demo。

## 验收标准

- `node scripts/apps.mjs check` 通过。
- `node scripts/apps.mjs list` 能输出首批 app。
- `node scripts/apps.mjs bench --apps rspack2-modern-module,rspack2-optimization` 能生成性能结果。
- `pnpm --filter rspack2-modern-module build` 通过。
- `pnpm --filter rspack2-optimization build` 通过。
- `pnpm --filter @empjs/cli test` 仍通过。
