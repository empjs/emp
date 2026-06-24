# Task 1 Report: Intent Parser

## Status

DONE

## RED Evidence

- Command: `pnpm --filter @empjs/cli test:real:intent`
- Result: exit 1, rstest started successfully.
- Expected failure: `Cannot find module '../src/agent-create/intent'`.
- Summary: `testFiles: 1`, `failedFiles: 1`, `tests: 0`.

## GREEN Evidence

- Command: `pnpm --filter @empjs/cli test:real:intent`
- Result: exit 0.
- Summary: `testFiles: 1`, `tests: 4`, `passedTests: 4`, `failedTests: 0`.
- Passed cases:
  - Chinese intent parses to React host and Vue user remote.
  - English intent parses Vue user remote.
  - Empty intent throws `create 命令需要项目意图`.
  - `Vue 主应用 + React 子应用` throws `P0 仅支持 React 主应用 + Vue 子应用`.

## Additional Verification

- Command: `pnpm --filter @empjs/cli test:real`
- Result: exit 0, `tests: 4`, `passedTests: 4`.
- Command: `git diff --check`
- Result: exit 0, no whitespace errors.

## Changed Files

- `packages/cli/src/agent-create/types.ts`
- `packages/cli/src/agent-create/intent.ts`
- `packages/cli/test/agent-create-intent.test.ts`
- `packages/cli/rstest.config.ts`
- `packages/cli/package.json`
- `pnpm-lock.yaml`
- `.superpowers/sdd/task-1-report.md`

## Notes

- Installed `@rstest/core@0.10.6` with `pnpm --filter @empjs/cli add -D @rstest/core@0.10.6`.
- `pnpm add` emitted existing deprecated dependency warnings and an existing `html-webpack-plugin` peer warning against `@rspack/core@2.0.8`; no task test failed.
- The parser is intentionally limited to Task 1. It does not implement planner, generator, verifier, executor, fixer, report writer, or CLI command wiring.

## Self Review

- Did not modify `AGENTS.md`, `README.md`, `.superpowers/plans/2026-06-24-agent-first-create-plan.md`, `projects/**`, or `website/**`.
- Parser checks framework and role adjacency, so `Vue 主应用 + React 子应用` is not accepted merely because the input contains both framework names and both role words.
- Staging should include only Task 1 files listed above.

## Review Fix Report - 2026-06-24

### Scope

- Fixed review finding: `parseCreateIntent` now rejects near-match framework tokens and extra host/remote role mentions.
- Fixed review finding: root test entry now covers `@empjs/cli test:real` via `test:cli` and `test:real:cli`.

### RED Evidence

- Command: `pnpm --filter @empjs/cli test:real:intent`
- Result: exit 1.
- Expected failures:
  - `rejects near-match React framework tokens`: `preact host with vue remote` did not throw.
  - `rejects multiple Vue remotes`: `React host with vue remote and another vue remote` did not throw.
- Summary: `tests: 6`, `failedTests: 2`, `passedTests: 4`.

### GREEN Evidence

- Command: `pnpm --filter @empjs/cli test:real:intent`
- Result: exit 0, `tests: 6`, `passedTests: 6`.
- Command: `pnpm test:real:cli`
- Result: exit 0, root entry ran `@empjs/cli test:real`, `tests: 6`, `passedTests: 6`.

### Command Summary

- `pnpm --filter @empjs/cli test:real:intent`: RED exit 1 before fix, GREEN exit 0 after fix.
- `pnpm test:real:cli`: exit 0.
- `git diff --check`: exit 0.

### Changed Files

- `packages/cli/src/agent-create/intent.ts`
- `packages/cli/test/agent-create-intent.test.ts`
- `package.json`
- `.superpowers/sdd/task-1-report.md`
