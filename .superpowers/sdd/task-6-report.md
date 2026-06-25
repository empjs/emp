# Task 6 Report: CLI Create Command

## Status

Passed. `emp create` 已接入真实 CLI，支持 help、dry-run JSON、write mode report。

## Scope

- 新增 `packages/cli/src/script/create.ts`
- 修改 `packages/cli/src/script/index.ts`
- 新增 `packages/cli/test/cli-create-help.test.ts`
- 未修改 root package 或 root scripts
- 未修改既有无关变更：`.superpowers/sdd/task-4-report.md`、`.superpowers/plans/2026-06-24-agent-first-create-plan.md`

## RED

命令：

```bash
pnpm --filter @empjs/cli exec rstest run test/cli-create-help.test.ts
```

结果：失败，符合预期。

- `create --help` 输出不包含 `创建 EMP 新项目`
- dry-run/write mode 均失败于 `error: unknown command 'create'`
- 失败原因是 create 命令尚未注册，不是测试拼写或环境问题

## GREEN

实现内容：

- `runCreateCommand(intentText, options)` 负责：
  - `parseCreateIntent`
  - `createProjectPlan`
  - `generateProject`
  - 非 dry-run 且未 `--skip-verify` 时执行 `verifyGeneratedProject`
  - `buildCreateReport(plan, checks, [])`
  - 非 dry-run 写入 `emp-report.json`
  - `--json` 输出 `plan`、计划文件路径、`report` 和 `reportPath`
- `script/index.ts` 注册：
  - `create <intent>`
  - `--dir`
  - `--dry-run`
  - `--skip-install`
  - `--skip-dev`
  - `--skip-verify`
  - `--json`

聚焦测试复跑：

```bash
pnpm --filter @empjs/cli exec rstest run test/cli-create-help.test.ts
```

结果：通过，3/3 passed。

## Verification

```bash
pnpm --filter @empjs/cli build
```

结果：通过，生成 `dist/create.js`。

```bash
pnpm --filter @empjs/cli exec rstest run test/cli-create-help.test.ts
```

结果：通过，3/3 passed。

```bash
pnpm --filter @empjs/cli test:real
```

结果：通过，5 files / 22 tests passed。

```bash
node packages/cli/bin/emp.js create "React 主应用 + Vue 子应用" --dry-run --json
```

结果：通过，stdout 包含 `emp.intent.yaml`、`apps/host/emp.config.ts`、`apps/user/emp.config.ts`；`emp-app` 未创建。

```bash
git diff --check
```

结果：通过，无 whitespace error。

```bash
pnpm ci:verify
```

结果：通过，覆盖 CLI 旧测试、CLI `test:real` 22/22、package 测试、rules、release check 和 rslib preset check。

```bash
pnpm empbuild
```

结果：通过。构建日志里保留了既有 CDN 包 `DefinePlugin` NODE_ENV 冲突 warning，但命令 exit 0。

## Self Check

- 非 dry-run `--skip-install --skip-dev --json` 会写入 `emp-report.json`，测试已验证 `report.status === "passed"`。
- dry-run 不写目标目录，也不写 report；测试和 smoke 已验证。
- Task 6 暂不执行 install/dev commands，`buildCreateReport` 第三个参数传 `[]`。
- `--skip-install` / `--skip-dev` 已保留并传入 plan options，等待 Task 7 接命令执行。
- 代码发现优先使用了 `codebase-memory-mcp`；测试、package 脚本和缺失 `.codex/config.toml` 属于配置/非代码检查，已用本地读取补充。

---

## Fix Report: Reviewer Findings (2026-06-25)

## Status

Passed. 已修复 Task 6 reviewer findings：create 结构化计划保留执行选项；failed report 会设置失败 exit status 且非 JSON 模式不再打印成功文案；`--skip-verify --json` 覆盖真实 CLI report 生成。

## RED

先改测试后运行：

```bash
pnpm --filter @empjs/cli exec rstest run test/agent-create-planner.test.ts test/cli-create-help.test.ts
```

结果：失败，符合预期。

- 2 test files / 7 tests，2 failed。
- `createProjectPlan > plans React host and Vue user remote from parsed intent` 失败于 `plan.options === undefined`。
- `emp create CLI > marks process failed and prints failure summary for failed reports` 失败于 `applyCreateReportExitStatus is not a function`。
- `--skip-verify --json` 集成测试已加入同一文件，用真实 CLI 生成并读取 `emp-report.json`。

## GREEN

实现内容：

- `CreateProjectPlan` 新增 `options: CreateOptions`。
- `createProjectPlan` 写入传入的 `CreateOptions` 浅拷贝，避免后续执行阶段丢失 CLI flags。
- `runCreateCommand` 改为从 `plan.options` 读取 `dryRun`、`verify`、`json`。
- 新增 `applyCreateReportExitStatus(report, reportPath, json)`：
  - failed report 设置 `process.exitCode = 1`
  - JSON 模式保持 stdout 为结构化 JSON
  - 非 JSON 模式输出中文失败摘要
  - failed report 不再继续打印 `EMP 新项目创建完成`
- 新增真实 CLI 集成断言：`--skip-verify --json` 后 stdout/report 文件里的 `report.checks === []`，且 `emp-report.json` 已生成。

聚焦测试复跑：

```bash
pnpm --filter @empjs/cli exec rstest run test/agent-create-planner.test.ts test/cli-create-help.test.ts
```

结果：通过，2 files / 7 tests passed。

## Verification

```bash
pnpm --filter @empjs/cli build
```

结果：通过，`dist/create.js` 和声明文件生成成功。

```bash
pnpm --filter @empjs/cli exec rstest run test/agent-create-planner.test.ts test/cli-create-help.test.ts
```

结果：通过，2 files / 7 tests passed。

```bash
pnpm --filter @empjs/cli test:real
```

结果：通过，5 files / 24 tests passed。

```bash
git diff --check
```

结果：通过，无 whitespace error。

## Changed Files

- `packages/cli/src/agent-create/types.ts`
- `packages/cli/src/agent-create/planner.ts`
- `packages/cli/src/script/create.ts`
- `packages/cli/test/agent-create-planner.test.ts`
- `packages/cli/test/cli-create-help.test.ts`
- `.superpowers/sdd/task-6-report.md`

## Self Check

- 本次只修改用户允许文件；未触碰既有无关改动 `.superpowers/sdd/task-4-report.md` 和 `.superpowers/plans/2026-06-24-agent-first-create-plan.md`。
- `--skip-install`、`--skip-dev`、`--skip-verify`、`--json` 已通过 `CreateOptions` 落到 `plan.options`，Task 7 可从 plan 读取。
- failed report 的 exit status helper 用真实 `buildCreateReport(...)` report 对象测试。
- `--skip-verify --json` 使用真实 CLI 执行，并确认磁盘 report 已生成、checks 为空。
