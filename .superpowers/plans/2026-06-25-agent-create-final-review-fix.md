# Agent Create Final Review Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the final whole-branch review blockers for EMP CLI agent-first create so dev readiness uses real HTTP probes and failed verify/report paths preserve collected evidence.

**Architecture:** Keep the existing `agent-create` module boundaries. Extend the executor to probe planned host and remote URLs after the dev process survives the startup window, and restructure create orchestration so command results and verification checks live outside the try/catch boundary and remain in failed reports. Report writes become temp-file plus rename operations.

**Tech Stack:** TypeScript, Node.js `^20.19.0 || >=22.12.0`, pnpm `10.33.0`, `@rstest/core`, existing EMP CLI scripts.

## Global Constraints

- 默认中文沟通；最终交付必须说明真实验证结果和未覆盖边界。
- 不 revert 或触碰无关改动；当前任务只改 final review 指定文件和本计划/报告记录。
- 代码发现优先使用 `codebase-memory-mcp`；字符串、配置、文档和 diff 读取可使用本地命令。
- 新增行为先写失败的 `rstest` 或真实 CLI 回归用例，再实现。
- 不扩大 `CheckStatus` / status union；`skipped` 和空数组的 `passed` 语义通过文档明确为“没有失败的已执行步骤”。
- dry-run 不落盘，`emp-report.json` 只在非 dry-run 写入。
- dev readiness 必须探测 host `http://localhost:<hostPort>/` 和 remote `http://localhost:<remotePort>/emp.js`；探测失败时保留 stdout/stderr 并清理 dev 进程组。

---

### Task 1: RED Coverage For Final Review Findings

**Files:**
- Modify: `packages/cli/test/agent-create-executor.test.ts`
- Modify: `packages/cli/test/cli-create-help.test.ts`

**Interfaces:**
- Consumes: `startDevCommandForCreate(plan, options)`
- Consumes: real CLI `node packages/cli/bin/emp.js create ... --json`
- Produces: failing tests for dev readiness, verify exception preservation, report write exception preservation, and status contract docs.

- [ ] **Step 1: Add dev readiness regression**

Add an executor test that starts a long-lived Node process with no HTTP listeners:

```ts
const result = await startDevCommandForCreate(
  {
    rootDir: tmpRoot,
    apps: [
      {name: 'host', role: 'host', framework: 'react', port: hostPort},
      {name: 'user', role: 'remote', framework: 'vue', port: remotePort},
    ],
  },
  {
    command: process.execPath,
    args: ['-e', "process.stdout.write('fake dev alive\\n'); setInterval(() => {}, 1000)"],
    startupWindowMs: 20,
    readinessTimeoutMs: 120,
    readinessPollIntervalMs: 20,
  },
)
expect(result.status).toBe('failed')
expect(result.stdout).toContain('fake dev alive')
expect(result.stderr).toMatch(/readiness probe failed/)
```

- [ ] **Step 2: Add CLI preservation regressions**

Add two real CLI tests using fake `pnpm` binaries:

```ts
// verify throws after install/build/dev results were collected
// fake build replaces pnpm-workspace.yaml with a directory; expect report.commands kept
// and checks contains {name: 'verify', status: 'failed'}.

// writeCreateReport throws after checks/commands were collected
// fake build creates emp-report.json as a directory; expect report.commands and passed
// checks kept, plus {name: 'report', status: 'failed'}.
```

- [ ] **Step 3: Add docs contract regression**

Add a test that reads `packages/cli/docs/agent-first-create.md` and expects the phrase:

```text
没有失败的已执行步骤
```

- [ ] **Step 4: Run RED**

Run:

```bash
pnpm --filter @empjs/cli test:real:executor
pnpm --filter @empjs/cli test:real:create
```

Expected before implementation: executor fails because the long-lived non-listening dev process is marked passed; create tests fail because failed reports lose collected commands/checks and docs do not include the clarified status contract.

### Task 2: Dev Readiness HTTP Probe And Cleanup

**Files:**
- Modify: `packages/cli/src/agent-create/executor.ts`
- Modify: `packages/cli/test/agent-create-executor.test.ts`
- Modify: `packages/cli/test/cli-create-help.test.ts`

**Interfaces:**
- Produces: `StartDevCommandOptions.readinessTimeoutMs?: number`
- Produces: `StartDevCommandOptions.readinessPollIntervalMs?: number`
- Updates: `startDevCommandForCreate(plan: Pick<CreateProjectPlan, 'rootDir' | 'apps'>, options?: StartDevCommandOptions): Promise<CommandResult>`

- [ ] **Step 1: Implement HTTP probe helpers**

In `executor.ts`, add Node `http`/`https` request helpers that treat 2xx/3xx as reachable, retry until `readinessTimeoutMs`, and produce a message listing failed probe URLs.

- [ ] **Step 2: Kill process group on readiness failure**

Add a helper that tries `process.kill(-pid, 'SIGTERM')` first and then `process.kill(pid, 'SIGTERM')`. Use it when readiness fails after the startup window.

- [ ] **Step 3: Return structured dev results**

After the startup window:

```ts
const readiness = await waitForDevReadiness(plan, options)
if (!readiness.ok) {
  terminateDevProcess(child)
  settle({name: 'dev', command, status: 'failed', exitCode: null, stdout: appendDevMessage(readDevLog(stdoutPath), `pid=${child.pid}`), stderr: appendDevMessage(readDevLog(stderrPath), readiness.message)})
  return
}
settle({name: 'dev', command, status: 'passed', exitCode: null, stdout: appendDevMessage(readDevLog(stdoutPath), `pid=${child.pid}`), stderr: readDevLog(stderrPath)})
child.unref()
```

- [ ] **Step 4: Update fake dev CLI helper**

Change `createFakePnpmBin()` in `cli-create-help.test.ts` so fake `pnpm dev` reads generated `emp.intent.yaml`, starts an HTTP host server for `/`, starts a remote server for `/emp.js`, and keeps the process alive.

- [ ] **Step 5: Run GREEN for executor**

Run:

```bash
pnpm --filter @empjs/cli test:real:executor
```

Expected: passed.

### Task 3: Preserve Collected Results And Atomic Report Writes

**Files:**
- Modify: `packages/cli/src/agent-create/report.ts`
- Modify: `packages/cli/src/script/create.ts`
- Modify: `packages/cli/test/agent-create-verify.test.ts`
- Modify: `packages/cli/test/cli-create-help.test.ts`

**Interfaces:**
- Updates: `writeCreateReport(report: EmpCreateReport): Promise<void>` to write `emp-report.json.<pid>.<timestamp>.tmp` then rename.
- Updates: `runCreateCommand()` to keep `commandResults` and `checks` variables outside the catch boundary and append stage-specific failed checks.

- [ ] **Step 1: Implement atomic report write**

In `writeCreateReport`, create the report directory, write JSON to a temp path named `emp-report.json.${process.pid}.${Date.now()}.tmp`, then rename the temp file to `emp-report.json`. On error, remove the temp file if it exists.

- [ ] **Step 2: Keep command results and checks across exceptions**

In `runCreateCommand`, declare:

```ts
let commandResults: CommandResult[] = []
let checks: VerificationCheck[] = []
let failureCheckName = 'create'
```

Assign `commandResults` immediately after `runCreateCommands`, assign `checks` immediately after `verifyGeneratedProject`, and on catch build the report from existing `checks` and `commandResults` plus a failed check named by the current stage.

- [ ] **Step 3: Handle report write failure without losing report truth**

When `writeCreateReport()` throws, append a `report` failed check and rebuild the in-memory report as failed. Do not replace collected command results with an empty array.

- [ ] **Step 4: Run GREEN for create/report**

Run:

```bash
pnpm --filter @empjs/cli test:real:create
pnpm --filter @empjs/cli test:real:verify
```

Expected: passed.

### Task 4: Documentation And SDD Record

**Files:**
- Modify: `packages/cli/docs/agent-first-create.md`
- Modify: `.superpowers/sdd/task-9-report.md`

**Interfaces:**
- Produces: user-facing status contract text that says `passed` means no failed executed steps, not that dry-run/skipped steps actually ran.
- Produces: SDD final fix evidence with RED/GREEN/verification commands.

- [ ] **Step 1: Update docs status semantics**

Update the report semantics section:

```md
整体 `status` 为 `passed` 表示“没有失败的已执行步骤”；`skipped` 命令和空 `checks` / `commands` 不代表对应检查或命令已经执行通过。
```

- [ ] **Step 2: Append final fix report**

Append `.superpowers/sdd/task-9-report.md` with final review findings fixed, RED/GREEN commands, live CLI checks, and remaining concerns.

- [ ] **Step 3: Run docs GREEN**

Run:

```bash
pnpm --filter @empjs/cli test:real:create
```

Expected: passed.

### Task 5: Required Verification And Commit

**Files:**
- Verify all modified files.
- Commit final fix.

**Interfaces:**
- Produces: commit `fix(cli): verify agent create dev readiness`

- [ ] **Step 1: Run required test matrix**

Run:

```bash
pnpm --filter @empjs/cli test:real:executor
pnpm --filter @empjs/cli test:real:create
pnpm --filter @empjs/cli test:real
pnpm --filter @empjs/cli test
pnpm --filter @empjs/cli build
```

- [ ] **Step 2: Run live CLI checks**

Run dry-run, static, and default live create commands with temporary directories. For the default live command, parse the dev pid from JSON output, kill the process group, and confirm the pid is no longer alive.

- [ ] **Step 3: Run final static check**

Run:

```bash
git diff --check
git status --short --branch
```

- [ ] **Step 4: Commit**

Run:

```bash
git add packages/cli/src/agent-create/executor.ts packages/cli/src/agent-create/report.ts packages/cli/src/script/create.ts packages/cli/test/agent-create-executor.test.ts packages/cli/test/cli-create-help.test.ts packages/cli/test/agent-create-verify.test.ts packages/cli/docs/agent-first-create.md .superpowers/sdd/task-9-report.md .superpowers/plans/2026-06-25-agent-create-final-review-fix.md
git commit -m "fix(cli): verify agent create dev readiness"
```

Expected: commit succeeds and worktree returns clean on `v4` ahead of `origin/v4`.

## Self-Review

- Spec coverage: each final review finding maps to a task and a verification command.
- Placeholder scan: this plan contains no `TBD`, `TODO`, or deferred implementation markers.
- Type consistency: `CommandResult`, `VerificationCheck`, `EmpCreateReport`, `CreateProjectPlan`, and existing status strings are reused without widening the status union.
