# apps 新版验收项目 Implementation Plan

> **执行代理要求：** 使用 `superpowers:executing-plans` 按任务推进；涉及行为变更时先写失败测试，再写实现。步骤使用 checkbox（`- [ ]`）语法跟踪状态。

**Goal:** 创建 `apps/` 新版验收项目目录、首批 Rspack 2 验收 app、统一检查和性能测试脚本，并为后续淘汰 `projects/**` 重复 demo 建立规则。

**Architecture:** `apps/` 只承载新版可自动验证项目，`projects/` 保持历史 demo 目录。`scripts/apps.mjs` 提供 `list`、`check`、`bench` 三个命令，根 `package.json` 暴露 `apps:list`、`apps:check`、`apps:bench`。首批 app 使用最小 TypeScript 入口，减少框架依赖对性能数据的干扰。

**Tech Stack:** Node.js ESM, pnpm workspace, `@empjs/cli`, Rspack 2, TypeScript.

## Global Constraints

- 全部设计、计划、README 和最终说明使用中文。
- `apps/**` 是新版验收目录；`projects/**` 暂不删除，仅逐步从默认验收矩阵淘汰。
- 每个 app 必须有 `package.json`、EMP 配置文件、`src/`、`dev/build/start/stat` 脚本。
- 性能测试只输出事实数据，不直接给快慢结论。
- 不引入新测试框架。
- 完成后必须运行 `node scripts/apps.test.mjs`、`node scripts/apps.mjs check`、首批 app build、`pnpm --filter @empjs/cli test`。

---

### Task 1: 脚本测试和 apps 目录规则

**Files:**
- Create: `scripts/apps.test.mjs`
- Create: `scripts/apps.mjs`
- Create: `apps/README.md`
- Modify: `package.json`
- Modify: `pnpm-workspace.yaml`

**Interfaces:**
- Produces: `discoverApps(root): AppInfo[]`
- Produces: `validateApps(apps): ValidationIssue[]`
- Produces: CLI commands `list`、`check`、`bench`

- [ ] **Step 1: Write the failing test**

创建 `scripts/apps.test.mjs`，断言 `scripts/apps.mjs` 导出 `discoverApps`、`validateApps`、`runBench`，并要求能发现 `rspack2-modern-module` 和 `rspack2-optimization`。

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node scripts/apps.test.mjs
```

Expected: FAIL，因为 `scripts/apps.mjs` 和 `apps/` 尚不存在。

- [ ] **Step 3: Implement script and README**

创建 `scripts/apps.mjs`、`apps/README.md`，并在根 `package.json` 增加：

```json
"apps:list": "node scripts/apps.mjs list",
"apps:check": "node scripts/apps.mjs check",
"apps:bench": "node scripts/apps.mjs bench"
```

修改 `pnpm-workspace.yaml` 增加：

```yaml
  - apps/**
```

- [ ] **Step 4: Run verification**

Run:

```bash
node scripts/apps.test.mjs
node scripts/apps.mjs check
```

Expected: PASS。

### Task 2: 首批 Rspack 2 验收 app

**Files:**
- Create: `apps/rspack2-modern-module/package.json`
- Create: `apps/rspack2-modern-module/emp.config.ts`
- Create: `apps/rspack2-modern-module/src/index.ts`
- Create: `apps/rspack2-optimization/package.json`
- Create: `apps/rspack2-optimization/emp.config.ts`
- Create: `apps/rspack2-optimization/src/index.ts`
- Create: `apps/rspack2-optimization/src/feature.ts`
- Create: `apps/rspack2-optimization/src/style.css`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes: `@empjs/cli` workspace package.
- Produces: two workspace packages: `rspack2-modern-module` and `rspack2-optimization`.

- [ ] **Step 1: Write minimal app files**

两个 app 均使用 `@empjs/cli`，不引入 React/Vue。

- [ ] **Step 2: Update lockfile**

Run:

```bash
pnpm install --lockfile-only
```

Expected: lockfile 增加 `apps/rspack2-*` importers。

- [ ] **Step 3: Run app builds**

Run:

```bash
pnpm --filter rspack2-modern-module build
pnpm --filter rspack2-optimization build
```

Expected: both commands exit 0。

### Task 3: 性能测试入口

**Files:**
- Modify: `scripts/apps.mjs`
- Modify: `scripts/apps.test.mjs`

**Interfaces:**
- Produces: `runBench({apps, cwd})`
- Produces: CLI `node scripts/apps.mjs bench --apps <a,b>`

- [ ] **Step 1: Add bench test**

测试 `runBench` 支持 `dryRun: true`，输出包含 `name`、`command`、`durationMs`、`distSizeBytes`、`assets` 字段。

- [ ] **Step 2: Implement bench command**

`bench` 逐个运行 `pnpm --filter <app> build`，记录耗时和 dist 指标。`--dry-run` 只返回计划，不执行构建。

- [ ] **Step 3: Run verification**

Run:

```bash
node scripts/apps.test.mjs
node scripts/apps.mjs bench --apps rspack2-modern-module,rspack2-optimization --dry-run
node scripts/apps.mjs bench --apps rspack2-modern-module,rspack2-optimization
```

Expected: PASS and JSON output。

### Task 4: Final verification

**Files:**
- No new files.

**Interfaces:**
- Consumes all previous tasks.
- Produces final verified state.

- [ ] **Step 1: Run full verification**

Run:

```bash
node scripts/apps.test.mjs
node scripts/apps.mjs check
node scripts/apps.mjs list
node scripts/apps.mjs bench --apps rspack2-modern-module,rspack2-optimization --dry-run
pnpm --filter rspack2-modern-module build
pnpm --filter rspack2-optimization build
pnpm --filter @empjs/cli test
git diff --check
git status --short --branch
```

Expected: all commands exit 0, with only scoped files changed.
