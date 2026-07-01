# Goal

Move app-owned tests out of the centralized root `test/apps` browser tree and into project/domain-owned test directories while keeping one root command surface for release validation.

The target topology is:

- `apps/<app>/test/browser/*.browser.ts` for app browser acceptance tests.
- `apps/test/*.test.ts` for apps-wide catalog, rules, and acceptance orchestration.
- `packages/<pkg>/test/**` for package-owned tests, keeping the existing `packages/emp-share/test/browser` lane.
- `test/*.test.ts` only for cross-cutting root, release, toolchain, and library-output checks.

# Architecture

The root remains the single orchestration layer:

- `scripts/root-test-targets.mjs` lists every root and browser target file.
- `rstest.config.ts` discovers decentralized app browser tests through the app test glob.
- `scripts/run-app-browser-tests.mjs` keeps app browser execution app-scoped through `EMP_BROWSER_SCOPE=apps`.
- `scripts/emp-workflow-check.mjs` verifies every decentralized test file is listed and located in the expected ownership boundary.

Tests move physically, then import paths and rule assertions are updated to make the new topology enforceable.

# Tech Stack

- `@rstest/core` and `@rstest/browser` remain the only test runner layer.
- Playwright remains the browser provider through Rstest browser mode.
- Existing Node scripts continue to provide orchestration and workflow guardrails.
- No new runtime or test dependencies are introduced.

# Global Constraints

- Do not change package publish scope or release package selection.
- Do not add a second runner such as Vitest, Jest, Mocha, or Ava.
- Do not commit generated output, coverage, cache, or browser service artifacts.
- Keep app browser tests as real browser acceptance tests with actual page interaction.
- Keep unified validation available from root package scripts.
- Preserve existing user changes if the working tree changes while executing.

# Task 1 - Lock the new ownership rule with a failing test

Files:

- `test/apps.browser-coverage.test.ts`

Steps:

1. Update the browser coverage matrix to parse `apps/<app>/test/browser/*.browser.ts`.
2. Assert each browser-covered app file lives under its app-local `test/browser` directory.
3. Run `corepack pnpm test:rules` and confirm it fails before the migration.

Validation:

- `corepack pnpm test:rules` fails before implementation because current files still live under `test/apps/browser`.

# Task 2 - Move app test ownership to app and apps-domain directories

Files:

- `test/apps.acceptance.test.ts` -> `apps/test/apps.acceptance.test.ts`
- `test/apps.rules.test.ts` -> `apps/test/apps.rules.test.ts`
- `test/apps.browser-coverage.test.ts` -> `apps/test/apps.browser-coverage.test.ts`
- `test/apps/browser/*/*.browser.ts` -> `apps/<app>/test/browser/*.browser.ts`
- `test/apps/browser/support/frame.ts` -> `apps/test-support/browser/frame.ts`

Steps:

1. Move files with Git-aware renames.
2. Update imports from moved tests to the new support helper path.
3. Keep cross-cutting root tests in `test/`.

Validation:

- `rg "test/apps/browser" apps test scripts rstest.config.ts` only returns intentional negative assertions or no results after config updates.

# Task 3 - Update root orchestration and workflow guards

Files:

- `scripts/root-test-targets.mjs`
- `rstest.config.ts`
- `scripts/run-app-browser-tests.mjs`
- `scripts/emp-workflow-check.mjs`
- `apps/test/apps.rules.test.ts`
- `apps/test/apps.browser-coverage.test.ts`

Steps:

1. Point app browser targets at `apps/<app>/test/browser/*.browser.ts`.
2. Include `apps/test/**/*.test.ts` in non-browser Rstest runs.
3. Make workflow guard scan `test`, `apps/test`, `apps/*/test/browser`, and `packages/emp-share/test/browser`.
4. Update app rules assertions to enforce the new decentralized paths.

Validation:

- `corepack pnpm test:rules`
- `corepack pnpm workflow:check`

# Task 4 - Run acceptance

Commands:

- `corepack pnpm test:rules`
- `corepack pnpm test:browser:all`
- `corepack pnpm exec rstest watch --browser --browser.headless=false`
- `corepack pnpm ci:verify`
- `git diff --check`

Acceptance criteria:

- Rules pass with decentralized path assertions.
- Browser all passes with app and emp-share browser tests.
- Watch headed command reaches a full green first pass and is then stopped cleanly.
- CI verification passes.
- No generated artifacts or cache files are staged.
