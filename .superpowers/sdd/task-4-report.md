# Task 4 Report: Generator and Dry Run

## Status

DONE_WITH_CONCERN

## Scope

- Added `generateProject(plan, {dryRun})` for Agent First project generation.
- Added rstest coverage for dry-run, write mode, non-empty target rejection, and unsafe path rejection.
- Added `test:real:generator` to `@empjs/cli`.

## TDD Evidence

RED:

```text
pnpm --filter @empjs/cli test:real:generator
status: fail
reason: Cannot find module '../src/agent-create/generator'
```

GREEN:

```text
pnpm --filter @empjs/cli test:real:generator
status: pass
tests: 5 passed
```

## Verification

```text
pnpm --filter @empjs/cli test:real:generator
status: pass
tests: 5 passed
```

```text
pnpm test:real:cli
status: fail
reason: No test files found for tests/real/cli/**/*.test.ts
```

```text
git diff --check
status: pass
```

## Concern

`pnpm test:real:cli` currently exits 1 because the root script points to `tests/real/cli/**/*.test.ts`, but this checkout has no matching test files. Fixing that would require modifying files outside the Task 4 allowed scope.

## Fix Report 2026-06-25: Validate Paths Before Writing

Status: GREEN

Scope:

- Added dry-run path validation coverage for `../escaped.txt`.
- Added dry-run path validation coverage for absolute generated file paths.
- Added mixed safe + unsafe write-mode coverage proving earlier safe files are not created when a later path is rejected.
- Updated `generateProject` to resolve and validate all generated file paths before dry-run return or write-mode filesystem writes.

RED:

```text
pnpm --filter @empjs/cli test:real:generator
status: fail
tests: 8 total, 3 failed, 5 passed
failures:
- rejects dry-run generated file paths that escape rootDir resolved instead of rejecting
- rejects dry-run absolute generated file paths resolved instead of rejecting
- mixed safe + unsafe write mode left safe.txt on disk before rejecting
```

GREEN:

```text
pnpm --filter @empjs/cli test:real:generator
status: pass
tests: 8 passed, 0 failed
```

Verification:

```text
git diff --check
status: pass
```

Concern:

- The report file is intentionally appended for SDD evidence. The fix commit should only stage the two allowed code/test files.
