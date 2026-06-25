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
