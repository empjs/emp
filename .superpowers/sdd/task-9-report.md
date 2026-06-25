# Task 9 Report: Test Script and End-to-End Acceptance

## Scope

- Modified `packages/cli/package.json`.
- Added package-level `rstest` create-flow scripts without changing root `package.json`.
- Kept the existing package-level full `test:real` entry as `rstest run`.

## Live Checkout

- Branch: `v4`.
- Initial status: branch ahead of `origin/v4` by 11 commits.
- Existing unrelated changes preserved:
  - Modified `.superpowers/sdd/task-4-report.md`
  - Untracked `.superpowers/plans/2026-06-24-agent-first-create-plan.md`
- `.codex/config.toml`: missing in this checkout.
- `codex mcp list`: `codebase-memory-mcp` enabled.
- `codebase-memory-mcp` project: `Users-Bigo-Desktop-develop-fontend-workspace-emp`, status `ready`, nodes `5075`, edges `8492`.

## Change

Added:

- `test:real:create`
- `test:real:create-help`
- `test:real:executor`
- `test:real:fix`
- `test:real:verify`

Retained:

- `test:real`
- `test:real:intent`
- `test:real:planner`
- `test:real:generator`

## Commands

### Pre-check

```bash
pnpm --filter @empjs/cli test:real:create
```

Result: failed before the change, expected baseline.

```text
ERR_PNPM_RECURSIVE_RUN_NO_SCRIPT None of the selected packages has a "test:real:create" script
```

### Focused create-flow rstest

```bash
pnpm --filter @empjs/cli test:real:create
```

Result: passed.

- Test files: 7
- Tests: 40
- Failed tests: 0
- Duration: 2093 ms

### Full package rstest

```bash
pnpm --filter @empjs/cli test:real
```

Result: passed.

- Test files: 7
- Tests: 40
- Failed tests: 0
- Duration: 1892 ms

### Existing package test

```bash
pnpm --filter @empjs/cli test
```

Result: passed.

- Existing `.mjs` package checks passed.
- The script also ran `pnpm run build` successfully.

### Package build

```bash
pnpm --filter @empjs/cli build
```

Result: passed.

- `rslib build --env-mode production`
- Built in 0.03 s.
- Declaration files generated in 0.68 s.

### Dry-run CLI acceptance

```bash
node packages/cli/bin/emp.js create "React 主应用 + Vue 子应用" --dry-run --json
```

Result: passed.

Confirmed JSON output included:

- `emp.intent.yaml`
- `apps/host/emp.config.ts`
- `apps/user/emp.config.ts`

### Write-mode static acceptance

```bash
TMP_DIR="$(mktemp -d)"
node packages/cli/bin/emp.js create "React 主应用 + Vue 子应用" --dir "$TMP_DIR/demo" --skip-install --skip-dev --json
```

Temp dir:

```text
/var/folders/33/n0322r3j7m370dv1mv7q5wqc0000gp/T/tmp.sHzJ1zKtTj
```

Result: failed.

- CLI exit status: 1
- `emp-report.json` status: `failed`
- Static checks: all passed
- Host file exists: `apps/host/emp.config.ts`
- User file exists: `apps/user/emp.config.ts`

Failure reason from report:

```json
{
  "name": "build",
  "command": "pnpm build",
  "status": "failed",
  "exitCode": 1,
  "stderr": "Command failed: pnpm build\n"
}
```

Relevant build stdout:

```text
apps/host build: sh: emp: command not found
ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL host@0.0.0 build: `emp build`
apps/user build: sh: emp: command not found
WARN Local package.json exists, but node_modules missing, did you mean to install?
```

Interpretation: with `--skip-install --skip-dev`, the current CLI still runs `pnpm build`. Since install was skipped, generated apps have no `node_modules`, so `emp build` is unavailable and the report correctly fails.

### Default end-to-end acceptance

```bash
TMP_DIR="$(mktemp -d)"
node packages/cli/bin/emp.js create "React 主应用 + Vue 子应用" --dir "$TMP_DIR/demo" --json
```

Temp dir:

```text
/var/folders/33/n0322r3j7m370dv1mv7q5wqc0000gp/T/tmp.c2HQi0qjVL
```

Result: failed.

- CLI exit status: 1
- `emp-report.json` status: `failed`
- `emp-report.json` includes command entries for `install`, `build`, and `dev`.

Command entries:

```json
[
  {
    "name": "install",
    "command": "pnpm install",
    "status": "passed",
    "exitCode": 0,
    "stderr": ""
  },
  {
    "name": "build",
    "command": "pnpm build",
    "status": "passed",
    "exitCode": 0,
    "stderr": ""
  },
  {
    "name": "dev",
    "command": "pnpm dev",
    "status": "failed",
    "exitCode": 1,
    "stderr": "dev command exited before startup window (code=1, signal=null)"
  }
]
```

Install completed with warnings, including:

```text
WARN 6 deprecated subdependencies found: glob@11.0.3, glob@7.2.3, inflight@1.0.6, q@1.5.1, stable@0.1.8, svgo@1.3.2
WARN Issues with peer dependencies found
@empjs/cli 4.0.0-alpha.2 -> html-webpack-plugin 5.6.4 unmet peer @rspack/core@"0.x || 1.x": found 2.0.8
```

Build completed successfully before dev failed.

### Diff check

```bash
git diff --check
```

Result: passed.

## Concerns

- The requested write-mode static acceptance does not pass with only `--skip-install --skip-dev` because build is still executed after skipping install.
- The default e2e path reaches install and build successfully, but dev exits before the startup window with status `failed`.
- No CLI source changes were made because this task was scoped to `packages/cli/package.json` and this report only.

## Follow-up Fix: Agent-first Create Acceptance

### RED

```bash
pnpm --filter @empjs/cli test:real:executor
```

Result: failed as expected.

- `captures dev stdout and stderr when the dev process exits during startup window`: `stdout` was empty because `startDevCommandForCreate` used ignored stdio.
- `skips build when install was intentionally skipped even if verify remains enabled`: `runCreateCommands` still invoked `build`.

```bash
pnpm --filter @empjs/cli test:real:create
```

Result: failed as expected.

- The new CLI `--skip-install --skip-dev --json` acceptance failed because `pnpm build` still ran without dependencies.
- The default dev-flow port test failed before the fix because generated output still used occupied default ports.

Additional RED guard:

```bash
pnpm --filter @empjs/cli exec rstest 'test/cli-create-help.test.ts' --testNamePattern 'emp create CLI > chooses available ports before writing the default dev create flow'
```

Result: failed as expected while a stale `user@http://localhost:3001/emp.js` verifier hint was still present in generated host config. The final implementation removes that stale URL from generated files.

### GREEN

```bash
pnpm --filter @empjs/cli test:real:executor
```

Result: passed.

- Test files: 1
- Tests: 9
- Failed tests: 0

```bash
pnpm --filter @empjs/cli test:real:create
```

Result: passed.

- Test files: 7
- Tests: 44
- Failed tests: 0

```bash
pnpm --filter @empjs/cli test:real
```

Result: passed.

- Test files: 7
- Tests: 44
- Failed tests: 0

```bash
pnpm --filter @empjs/cli test
```

Result: passed.

- Existing `.mjs` package checks passed.
- The script also ran package build successfully.

```bash
pnpm --filter @empjs/cli build
```

Result: passed.

- `rslib build --env-mode production`
- Declaration files generated successfully.

```bash
git diff --check
```

Result: passed.

### Live CLI Checks

```bash
node packages/cli/bin/emp.js create "React 主应用 + Vue 子应用" --dry-run --json
```

Result: passed.

- Exit code: 0
- Report status: `passed`
- Commands: none, as expected for dry-run.

```bash
node packages/cli/bin/emp.js create "React 主应用 + Vue 子应用" --dir "$TMP/demo" --skip-install --skip-dev --json
```

Result: passed.

- Exit code: 0
- Report status: `passed`
- Static checks: `root-package`, `workspace`, `intent`, `host-config`, `remote-config` all passed.
- Commands: `install` skipped, `build` skipped, `dev` skipped.

```bash
node packages/cli/bin/emp.js create "React 主应用 + Vue 子应用" --dir "$TMP/demo" --json
```

Result: passed.

- Exit code: 0
- Report status: `passed`
- App URLs: host `http://localhost:3001`, remote `http://localhost:3003` in the final live run, reflecting currently available ports.
- Commands: `install` passed, `build` passed, `dev` passed.
- Reported dev pid: `65166`; killed via process group and confirmed not alive afterward.

### Change Summary

- `--skip-install` now skips build command execution even when static verify remains enabled; static verify still runs from generated files.
- Non-dry-run dev-enabled create flow now resolves available host/remote ports before writing files and regenerates templates from that updated plan.
- Generated `emp.intent.yaml`, host remote config, remote server config, and report app URLs use the same resolved ports.
- `startDevCommandForCreate` now captures startup stdout/stderr through detached log files and reports early-exit output without keeping attached pipes that block CLI exit.

### Commit

- Commit hash: `ced76145dce9241af0a116b8370fd5273c47fded`

### Concerns

- `.codex/config.toml` is still absent in this checkout.
- Existing unrelated worktree changes were preserved and not included in this fix: `.superpowers/sdd/task-4-report.md` and `.superpowers/plans/2026-06-24-agent-first-create-plan.md`.
- Follow-up review found that `verifyGeneratedProject` still contained a default-port host-config check and `create.ts` normalized that failed check at runtime; fixed in the review follow-up below.

## Follow-up Review Fix: Dynamic Port Verifier

### Review Findings Fixed

- Recorded the original Task 9 follow-up commit hash: `ced76145dce9241af0a116b8370fd5273c47fded`.
- Updated `verifyGeneratedProject(plan)` to validate host remote URLs from `plan.apps` remote `name` and `port` values instead of hard-coding `user@http://localhost:3001/emp.js`.
- Removed `normalizeDynamicPortChecks()` and its call from `packages/cli/src/script/create.ts`; dynamic port correctness is now verified at the source.

### RED

```bash
pnpm --filter @empjs/cli test:real:verify
```

Result: failed as expected before implementation.

- Test files: 1
- Tests: 4
- Failed tests: 1
- Failure: `agent-create verification report > verifies host config against the planned remote name and port`
- Expected `host-config` to pass for `profile@http://localhost:4301/emp.js`; actual status was `failed`.

### GREEN

```bash
pnpm --filter @empjs/cli test:real:verify
```

Result: passed.

- Test files: 1
- Tests: 4
- Failed tests: 0

```bash
pnpm --filter @empjs/cli test:real:create
```

Result: passed.

- Test files: 7
- Tests: 45
- Failed tests: 0

```bash
pnpm --filter @empjs/cli test:real
```

Result: passed.

- Test files: 7
- Tests: 45
- Failed tests: 0

```bash
pnpm --filter @empjs/cli test
```

Result: passed.

- Existing `.mjs` package checks passed.
- The script also ran package build successfully.

```bash
pnpm --filter @empjs/cli build
```

Result: passed.

- `rslib build --env-mode production`
- Declaration files generated successfully.

```bash
git diff --check
```

Result: passed.

### Commit

- Code fix commit hash: `bf3da4bf6cd96d826bab31dace508ecdd9870b4a`

### Concerns

- `.codex/config.toml` is still absent in this checkout.
- Existing unrelated worktree changes were preserved and not included in this fix: `.superpowers/sdd/task-4-report.md` and `.superpowers/plans/2026-06-24-agent-first-create-plan.md`.
- The report entry recording `bf3da4bf6cd96d826bab31dace508ecdd9870b4a` is committed separately because a commit cannot contain its own final hash in a tracked file.

## Final Whole-Branch Review Fix: Dev Readiness and Report Preservation

### Review Findings Fixed

- `dev` no longer passes only because the process survives the startup window. After startup, `startDevCommandForCreate()` probes the planned host URL `http://localhost:<hostPort>/` and each remote URL `http://localhost:<remotePort>/emp.js`.
- If readiness probes fail, the detached dev process group is terminated and the `dev` command result is marked `failed` with captured stdout/stderr.
- `runCreateCommand()` now preserves collected `commandResults` and `checks` when static verify or report writing fails after install/build/dev have run.
- `writeCreateReport()` now writes through `emp-report.json.<pid>.<timestamp>.tmp` and renames to `emp-report.json`.
- `agent-first-create.md` now clarifies that overall `passed` means there are no failed executed steps; skipped or absent steps were not executed.

### RED

```bash
pnpm --filter @empjs/cli test:real:executor
```

Result: failed as expected before implementation.

- Test files: 1
- Tests: 10
- Failed tests: 1
- Failure: `fails dev readiness and terminates a long-running process that does not listen on planned ports`
- Actual old behavior: `dev` returned `passed` for a long-running process that did not listen on host/remote ports.

```bash
pnpm --filter @empjs/cli test:real:create
```

Result: failed as expected before implementation.

- Test files: 7
- Tests: 50
- Failed tests: 5
- Failures:
  - non-listening dev process was marked `passed`
  - atomic report write contract did not use temp file + rename
  - docs lacked the clarified `passed` status contract
  - verify exception after commands lost collected command results
  - report write exception after verification lost collected checks and command results

```bash
pnpm --filter @empjs/cli test:real:verify
```

Result: failed as expected before implementation.

- Test files: 1
- Tests: 5
- Failed tests: 1
- Failure: `writes emp-report.json through a temporary file before rename`

### GREEN

```bash
pnpm --filter @empjs/cli test:real:executor
```

Result: passed.

- Test files: 1
- Tests: 10
- Failed tests: 0

```bash
pnpm --filter @empjs/cli test:real:verify
```

Result: passed.

- Test files: 1
- Tests: 5
- Failed tests: 0

```bash
pnpm --filter @empjs/cli test:real:create
```

Result: passed.

- Test files: 7
- Tests: 50
- Failed tests: 0

```bash
pnpm --filter @empjs/cli test:real
```

Result: passed.

- Test files: 7
- Tests: 50
- Failed tests: 0

```bash
pnpm --filter @empjs/cli test
```

Result: passed.

- Existing `.mjs` checks passed.
- The script also ran package build successfully.

```bash
pnpm --filter @empjs/cli build
```

Result: passed.

- `rslib build --env-mode production`
- Declaration files generated successfully.

### Live CLI Checks

```bash
node packages/cli/bin/emp.js create "React 主应用 + Vue 子应用" --dir "$TMP/dry-run-app" --dry-run --json
```

Result: passed.

- Exit code: 0
- Report status: `passed`
- Commands: `0`
- Target directory was not created.

```bash
node packages/cli/bin/emp.js create "React 主应用 + Vue 子应用" --dir "$TMP/static-app" --skip-install --skip-dev --json
```

Result: passed.

- Exit code: 0
- Report status: `passed`
- Static checks: 5
- Commands: `install:skipped`, `build:skipped`, `dev:skipped`

```bash
node packages/cli/bin/emp.js create "React 主应用 + Vue 子应用" --dir "$TMP/live-app" --json
```

Result: passed.

- Exit code: 0
- Report status: `passed`
- Commands: `install:passed`, `build:passed`, `dev:passed`
- App ports in this run: host `3001`, remote `3003`
- Reported dev pid: `95199`; killed via process group and confirmed terminated.

### Change Summary

- `packages/cli/src/agent-create/executor.ts`
  - Added dev readiness probes for planned host and remote URLs.
  - Added readiness timeout/poll options for fast regression coverage.
  - Added process-group termination when readiness fails.
- `packages/cli/src/agent-create/report.ts`
  - Changed report writes to temp-file + rename.
- `packages/cli/src/script/create.ts`
  - Preserves command results and checks across verify/report exceptions.
  - Appends `verify` or `report` failed checks instead of rebuilding empty failed reports.
- `packages/cli/test/*`
  - Added regressions for non-listening dev, atomic report writes, verify exception preservation, report write preservation, and status contract docs.
- `packages/cli/docs/agent-first-create.md`
  - Clarified `passed` status semantics for skipped and dry-run flows.

### Concerns

- `.codex/config.toml` and `.codex/hooks.json` are absent in this checkout.
- `pnpm empbuild` passed with existing CDN package `DefinePlugin` `process.env.NODE_ENV` conflict warnings; the command exited 0.

### Additional Root Verification

```bash
pnpm ci:verify
```

Result: passed.

- Covered CLI legacy tests, CLI `test:real` 50/50, package tests, release rules, release check, and Rslib preset check.

```bash
pnpm empbuild
```

Result: passed.

- Built `@empjs/chain`, `@empjs/cli`, lib, plugin, CDN, and bridge packages.
- Existing CDN `DefinePlugin` `process.env.NODE_ENV` conflict warnings remained non-blocking.
