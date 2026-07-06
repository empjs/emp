# Apps P2 Boundary Coverage

## Goal

补齐当前 v4 apps 功能矩阵里的 P2 未覆盖边界，并把这些边界纳入可重复验收：remote 边界契约、路由深链刷新、demo proxy 目标不可达诊断。完成后运行相关验收，通过后提交并推送到 `v4`。

## Architecture

P2 覆盖按三层收口：

1. `apps/test/apps.browser-coverage.test.ts` 作为矩阵契约，防止文档继续出现 `剩余 P2`，并要求每个 P2 边界都绑定到现有真实测试文件。
2. apps 浏览器测试补真实用户路径：
   - `demo` 在 iframe 内注入 `/api/hello` 网络失败，验证页面展示 proxy 目标不可达诊断。
   - `react-19-tanstack` 直接加载 `/router-lab/alice`，验证 TanStack Router 深链刷新。
   - `vue-3-project` 直接加载 `/#/hostHome`，验证 Vue hash router 深链刷新和 remote 页面渲染。
3. `docs/testing/apps-feature-test-matrix.md` 更新为已覆盖清单，删除 P2 残留项。

## Tech Stack

- Rstest browser tests
- 现有 `@empjs/test-support/browser/*` helper
- 根测试入口：`node scripts/run-root-test.mjs rules`、`corepack pnpm test:apps:browser`、`corepack pnpm apps:acceptance`

## Global Constraints

- 不恢复 Tailwind 3；只覆盖当前 `scripts/apps.catalog.mjs` 的 13 个 apps。
- 不新增第二套测试 runner。
- 不修改发布包范围，不把 `apps/**` 纳入发布包。
- 仅 stage 本任务文件，保留用户和生成物无关改动。
- 提交前运行 `git diff --cached --check`，验收通过后 push。

## Task 1 - P2 Coverage Contract

文件：
- `apps/test/apps.browser-coverage.test.ts`
- `docs/testing/apps-feature-test-matrix.md`

步骤：
1. 增加 `p2BoundaryCoverage` 契约，列出 P2 apps 与对应边界类型。
2. 断言文档没有 `剩余 P2`。
3. 断言每个 P2 app 都绑定至少一个真实 browser test 文件。

验证：
- `node scripts/run-root-test.mjs rules -- --testNamePattern "P2"`

## Task 2 - Browser Boundary Tests

文件：
- `apps/test-support/browser/demo-api.ts`
- `apps/demo/test/browser/proxy.browser.ts`
- `apps/react-19-tanstack/test/browser/react19.browser.ts`
- `apps/vue-3-project/test/browser/remote.browser.ts`

步骤：
1. 给 demo browser helper 增加 API 失败注入能力。
2. 给 demo proxy 页面补 `/api/hello` 网络失败诊断断言。
3. 给 React 19 TanStack Router 补直接深链加载断言。
4. 给 Vue 3 project 补 hash 深链刷新断言。

验证：
- `APPS_BROWSER_SERVICE_FILTER=demo,react-19-tanstack,vue-3-project corepack pnpm test:apps:browser -- --testNamePattern "proxy target unavailable|direct route refresh|hash route refresh"`

## Task 3 - Acceptance And Commit

文件：
- 以上任务文件

步骤：
1. 运行规则、浏览器和 apps 验收。
2. 重新生成 release acceptance HTML，确认未覆盖边界为 0。
3. 检查 diff，只 stage 本任务文件。
4. commit 并 push `v4`。

验证：
- `node scripts/run-root-test.mjs rules`
- `corepack pnpm apps:acceptance`
- `corepack pnpm test:apps:browser`
- `corepack pnpm release:acceptance -- --dry-run`
- `git diff --check`
- `git diff --cached --check`
