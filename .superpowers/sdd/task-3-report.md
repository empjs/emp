# Task 3 Report: Template Generation

## Status

完成 `createTemplateFiles()` P0 模板扩展，并用 rstest 覆盖完整文件列表和关键配置内容。

## Changed Files

- `packages/cli/test/agent-create-planner.test.ts`
- `packages/cli/src/agent-create/templates.ts`
- `.superpowers/sdd/task-3-report.md`

## Generated P0 Files

- `package.json`
- `pnpm-workspace.yaml`
- `emp.intent.yaml`
- `apps/host/package.json`
- `apps/host/emp.config.ts`
- `apps/host/src/main.tsx`
- `apps/host/src/App.tsx`
- `apps/host/src/remotes.d.ts`
- `apps/user/package.json`
- `apps/user/emp.config.ts`
- `apps/user/src/main.ts`
- `apps/user/src/App.vue`

## RED Evidence

Command:

```bash
pnpm --filter @empjs/cli test:real:planner
```

Result: failed as expected before implementation.

Key failure:

```text
expected [ 'apps/host/emp.config.ts', ...(2) ] to deeply equal [ 'apps/host/emp.config.ts', ...(11) ]
Received only:
apps/host/emp.config.ts
apps/user/emp.config.ts
emp.intent.yaml
```

## GREEN Evidence

Command:

```bash
pnpm --filter @empjs/cli test:real:planner
```

Result: passed.

```text
tests: 2
passedTests: 2
failedTests: 0
```

Command:

```bash
pnpm test:real:cli
```

Result: passed.

```text
testFiles: 2
tests: 8
passedTests: 8
failedTests: 0
```

Command:

```bash
git diff --check
```

Result: passed with no whitespace errors.

## Implementation Notes

- `@empjs/share/rspack` in this repo exports both `pluginRspackEmpShare` and a default export; templates use the named export from the task plan.
- CLI default entry discovery looks for `src/index.*`; because Task 3 requires `main.tsx` and `main.ts`, templates set `appEntry` explicitly in both app configs.
- CLI default HTML template provides a generated HTML shell with configurable `mountId`; templates set `html.mountId` to `root` for host and `app` for remote, so no app-local `index.html` is generated.
- Current CLI source does not expose an `emp verify` command. Root `verify` uses the same real build matrix as `build`: `pnpm --filter "./apps/*" build`.
- Cross-framework bridge behavior is not implemented in Task 3; the template follows the brief by exposing Vue `./App` and declaring `user/App` for host consumption.

## Self Review

- Scope stayed within allowed files.
- Did not modify `AGENTS.md`, `README.md`, `.superpowers/plans/*`, `projects/**`, or `website/**`.
- Did not change generator, executor, or CLI command wiring.
- User pre-existing changes remain untouched.

## Review Fix: Vue Remote Bridge

Follow-up review findings were fixed in the template generator.

Changed files:

- `packages/cli/src/agent-create/templates.ts`
- `packages/cli/test/agent-create-planner.test.ts`
- `.superpowers/sdd/task-3-report.md`

RED evidence:

```bash
pnpm --filter @empjs/cli test:real:planner
```

Result: failed as expected before the template fix.

```text
expected undefined to be 'pnpm@10.33.0'
```

GREEN evidence:

```bash
pnpm --filter @empjs/cli test:real:planner
```

Result: passed.

```text
testFiles: 1
tests: 2
passedTests: 2
failedTests: 0
```

```bash
pnpm test:real:cli
```

Result: passed.

```text
testFiles: 2
tests: 8
passedTests: 8
failedTests: 0
```

```bash
git diff --check
```

Result: passed with no whitespace errors.

Fix notes:

- Root generated `package.json` now includes `packageManager: pnpm@10.33.0` and the required Node/pnpm engines.
- Host generated `package.json` now includes `@empjs/bridge-react`, `@empjs/bridge-vue3`, and `vue`.
- Host generated `App.tsx` now wraps the Vue `user/App` remote with `createBridgeComponent()` and `createRemoteAppComponent()`.
- Host generated `remotes.d.ts` now declares `user/App` as `unknown` instead of a React `ComponentType`.
- This review fix supersedes the earlier note that cross-framework bridge behavior was not implemented in Task 3.
