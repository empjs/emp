# 2026-07-06 rc.1 Release And Default v4

## Goal

Publish EMP v4 `4.0.0-rc.1` as the npm `rc` prerelease line, align README version/tag messaging with the current rc tag, and switch the GitHub repository default branch from `main` to `v4`.

## Architecture

- Release source of truth is the root package version `4.0.0-rc.1` plus the internal package selection produced by `scripts/release.mjs`.
- npm publishing stays limited to the 17 internal `@empjs/*` packages selected by `release:check`; `apps/**`, `website`, `@empjs/cdn-*`, and `@empjs/lib-*` remain outside the unified rc publish set.
- README badges read package metadata from npm dist-tag manifests and package manager metadata from the `v4` branch.
- GitHub repository settings are changed through `gh repo edit --default-branch v4` and verified with `gh repo view`.

## Tech Stack

- `pnpm@10.33.0` through Corepack.
- Node engine `^20.19.0 || >=22.12.0`.
- `scripts/release.mjs` and `scripts/release-core.mjs` for release plan, dry-run, pack, and publish commands.
- GitHub CLI for repository default branch verification and update.
- npm registry auth for real package publishing.

## Global Constraints

- Do not publish or version `apps/**`, `website`, `@empjs/cdn-*`, or `@empjs/lib-*` as part of the unified rc release.
- Real npm publish must use `release:publish` with `--yes`; dry-run remains the default without `--yes`.
- Do not overwrite unrelated user changes; stage only files touched for this release.
- Use direct file reads and release scripts for package manifest and README checks; CodeGraph is not the source of truth for this docs/release metadata task.
- If npm auth is unavailable, complete README/changelog/default-branch/git preparation and report the publish blocker with the exact auth evidence.

## Task 1 - Release Plan And Current State

Files:

- `.superpowers/plans/2026-07-06-rc1-release-and-default-v4.md`
- `scripts/release.mjs`
- `scripts/release-core.mjs`
- `package.json`

Steps:

- Confirm branch, dirty state, repo default branch, and release package selection.
- Confirm `4.0.0-rc.1` is not already published for `@empjs/cli`.
- Confirm npm auth state before attempting real publish.

Validation:

- `git status --short --branch`
- `corepack pnpm release:check`
- `npm view @empjs/cli@4.0.0-rc.1 version --json`
- `npm whoami`

## Task 2 - README And Changelog rc Alignment

Files:

- `README.md`
- `CHANGELOG.md`

Steps:

- Switch README npm badge, dependency badge, Node badge, and license badge sources from `alpha` to `rc`.
- Update README copy so the current v4 line references `@empjs/cli@rc` and `rc` manifests.
- Add a `4.0.0-rc.1 - 2026-07-06` changelog entry describing the rc package scope, README tag alignment, default branch change, and validation.

Validation:

- `rg -n "alpha|@empjs/cli@alpha|/alpha" README.md`
- `git diff --check`

## Task 3 - Release Verification

Files:

- Release scripts and package manifests as read-only inputs.
- `packages/cli/test/cli-create-help.test.ts` if validation exposes an environment-dependent real-test failure that blocks the release gate.

Steps:

- Run dry-run publish for the full rc selection with `--force-all --skip-build`.
- Run workflow and release validation before commit/push.
- Run full build and acceptance gates for publish readiness.
- Stabilize only the failing gate test if it depends on local machine port occupancy; keep the CLI behavior under test unchanged.

Validation:

- `corepack pnpm workflow:check`
- `corepack pnpm release:check`
- `corepack pnpm release:publish:dry -- --force-all --skip-build`
- `corepack pnpm ci:verify`
- `corepack pnpm empbuild`
- `corepack pnpm apps:acceptance`
- `git diff --check`

## Task 4 - GitHub Default Branch, Git Tag, And Publish

Files:

- Git metadata only.

Steps:

- Commit README/changelog/plan updates after validation.
- Push `v4` to origin.
- Switch the GitHub default branch to `v4` and verify it.
- Create and push `v4.0.0-rc.1` tag only after the release commit is pushed and the tag is confirmed absent.
- Publish packages with `corepack pnpm release:publish -- --force-all --yes --skip-build --tag rc` only when npm auth is available.

Validation:

- `git diff --cached --check`
- `git push origin v4`
- `gh repo edit --default-branch v4`
- `gh repo view --json defaultBranchRef`
- `git ls-remote --tags origin v4.0.0-rc.1`
- `npm view @empjs/cli@4.0.0-rc.1 version --json`
- `npm view @empjs/cli dist-tags --json`
