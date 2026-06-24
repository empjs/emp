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
