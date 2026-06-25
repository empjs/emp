# Task 8 Report: Minimal Agent First Fixer

状态：DONE_WITH_CONCERN

## 范围

- 新增 `packages/cli/src/agent-create/fix.ts`
- 修改 `packages/cli/src/agent-create/types.ts`
- 新增 `packages/cli/test/agent-create-fix.test.ts`
- 未接入 `packages/cli/src/script/create.ts` 自动修复流程，避免 create flow 在本任务内覆盖已有用户文件。

## TDD Evidence

RED:

```text
pnpm --filter @empjs/cli exec rstest run test/agent-create-fix.test.ts
status: fail
reason: Cannot find module '../src/agent-create/fix'
tests: 0
```

GREEN:

```text
pnpm --filter @empjs/cli exec rstest run test/agent-create-fix.test.ts
status: pass
tests: 3 passed, 0 failed
```

## 实现摘要

- `FixResult` 支持 `applied` / `skipped` 两种 deterministic fixer 结果。
- `fixGeneratedProject(plan, checks)` 只在 `report` check failed 时处理。
- 缺失 `emp-report.json` 时使用 `buildCreateReport(plan, [], [])` 重新生成最小 report。
- 已存在 `emp-report.json` 时返回 skipped，并通过 `flag: 'wx'` 防止覆盖。
- 非 report failed check 返回空数组，不创建 report。

## 验证

```text
pnpm --filter @empjs/cli exec rstest run test/agent-create-fix.test.ts
status: pass
testFiles: 1
tests: 3 passed, 0 failed
```

```text
pnpm --filter @empjs/cli test:real
status: pass
testFiles: 7
tests: 39 passed, 0 failed
```

```text
git diff --check
status: pass
```

## Concern

- Task brief 仍写旧的 `.test.mjs` / `node` 测试入口；本轮按当前用户指令和 EMP 测试策略改为 `rstest` `.test.ts`。
- 本轮只提供 helper，不自动接入 `create.ts`。如果后续需要 create flow 自动应用 fixer，需要新增参数或严格限定只在 report 缺失场景触发。
- 当前 checkout 原本已有无关改动：`.superpowers/sdd/task-4-report.md` 和 `.superpowers/plans/2026-06-24-agent-first-create-plan.md`，本任务提交不纳入这些文件。

## Commit

```text
e9290be5 feat(cli): add minimal agent first fixer
```

---

# Task 8 Reviewer Fix Report: Preserve Failed Checks

状态：DONE

## Reviewer Finding

- `fixGeneratedProject` 在 `report` missing 和其他 failed checks 同时存在时，使用 `buildCreateReport(plan, [], [])` 补写假绿 report。

## RED

```text
pnpm --filter @empjs/cli exec rstest run test/agent-create-fix.test.ts
status: fail
tests: 4
failedTests: 1
reason: expected 'passed' to be 'failed'
case: preserves non-report failed checks when regenerating a missing report
```

## GREEN

```text
pnpm --filter @empjs/cli exec rstest run test/agent-create-fix.test.ts
status: pass
tests: 4 passed, 0 failed
```

## 实现摘要

- 调整第一条用例，明确只有没有其他失败时，缺失 report 的补写结果才是 `passed`。
- 新增 `report` failed + `host-config` failed 场景，断言补写出的 `emp-report.json` 为 `failed`，并只保留真实业务 failed check。
- `writeReportIfMissing(plan, checks)` 生成 report 前过滤 `report` synthetic check，并保留其他原始 checks。

## 验证

```text
pnpm --filter @empjs/cli exec rstest run test/agent-create-fix.test.ts
status: pass
testFiles: 1
tests: 4 passed, 0 failed
```

```text
pnpm --filter @empjs/cli test:real
status: pass
testFiles: 7
tests: 40 passed, 0 failed
```

```text
git diff --check
status: pass
```

## Concern

- 当前 checkout 仍有无关未提交/未跟踪改动：`.superpowers/sdd/task-4-report.md`、`.superpowers/plans/2026-06-24-agent-first-create-plan.md`；本 fix 不纳入提交。
