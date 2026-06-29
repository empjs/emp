# Root Test Script Entrypoints Implementation Plan

**Goal:** 优化 EMP 根脚本与测试脚本执行入口，消除 `test/` 迁移后在 `package.json`、`scripts/` 与 Rstest 命令之间重复硬编码测试路径带来的错误风险。

**Architecture:** 根 `rstest.config.ts` 保持统一配置入口；新增 `scripts/root-test-targets.mjs` 集中维护根 Rstest target 到测试文件的映射；新增 `scripts/run-root-test.mjs` 按 target 执行并提前校验文件存在；`package.json` 和 `scripts/emp-workflow-check.mjs` 只依赖 target 名称和共享映射。

**Tech Stack:** Node ESM、`@rstest/core`、`corepack pnpm`、EMP workflow guard。

## Global Constraints

- 默认中文沟通和交付。
- EMP 包管理命令使用 `corepack pnpm`。
- 本任务不修改 `apps/**`、`website`、`packages/cdn-*`、`packages/lib-*`。
- 根测试文件位于 `test/**/*.test.ts`，脚本实现位于 `scripts/*.mjs`。
- 完成前必须验证 `workflow:check`、根 Rstest alias、`ci:verify` 和 `git diff --check`。

## Task 1: 集中根 Rstest Target

**Files:**
- Create: `scripts/root-test-targets.mjs`
- Create: `scripts/run-root-test.mjs`
- Modify: `package.json`
- Modify: `scripts/emp-workflow-check.mjs`

**Interfaces:**
- Produces: `ROOT_RSTEST_CONFIG`、`ROOT_TEST_TARGETS`、`ROOT_TEST_PACKAGE_SCRIPTS`、`rootTestCommand(targetName)`。
- Consumes: `test/toolchain.rules.test.ts`、`test/tsconfig.rules.test.ts`、`test/apps.rules.test.ts`、`test/release.rules.test.ts`、`test/apps.acceptance.test.ts`、`test/apps.mf-browser.test.ts`、`test/library-output.smoke.test.ts`。

Steps:
- [x] 新增 target 映射，包含 `toolchain`、`tsconfig`、`rules`、`apps-single`、`apps-mf`、`library-output`、`all`。
- [x] 新增 runner，执行前检查 `rstest.config.ts` 和目标测试文件存在。
- [x] 将根测试脚本改为 `node scripts/run-root-test.mjs <target>`。
- [x] 将 workflow guard 改为读取共享映射，避免重复写具体测试路径。

Validation:
- `corepack pnpm workflow:check`
- `corepack pnpm test:toolchain`
- `corepack pnpm test:tsconfig`
- `corepack pnpm test:rules`

## Task 2: 验证脚本与测试入口无错误

**Files:**
- Read: `package.json`
- Read: `scripts/root-test-targets.mjs`
- Read: `scripts/run-root-test.mjs`
- Read: `test/*.test.ts`

**Interfaces:**
- Consumes: Task 1 的 target runner。
- Produces: 根测试和 apps/library smoke 入口均可执行的验证结果。

Steps:
- [x] 运行 `node scripts/run-root-test.mjs all -- --reporter dot`。
- [x] 运行 `corepack pnpm test:apps:single`、`corepack pnpm test:apps:mf`、`corepack pnpm test:library-output`。
- [x] 运行 `corepack pnpm ci:verify` 与 `git diff --check`。
