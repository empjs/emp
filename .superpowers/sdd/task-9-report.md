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
