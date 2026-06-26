# Goal

Complete the EMP v4 beta release from the current `v4` branch by removing the current beta blocker, proving the local and remote gates, preparing the beta version, and running the dry-run and publish workflow to a verifiable result.

# Architecture

The beta release is validated through the existing root automation:

- `pnpm ci:verify` remains the local and CI verification umbrella.
- `pnpm empbuild` verifies the publish package build surface.
- `pnpm apps:acceptance` verifies the reduced `apps/**` real-use matrix, including the Module Federation browser smoke.
- `.github/workflows/ci.yml` must keep `verify`, `build`, and `apps` as independent jobs so CI failures identify the broken surface.
- `.github/workflows/publish.yml` remains the release executor and must keep dry-run and real publish as explicit workflow modes.

# Tech Stack

- Node.js 24 in CI.
- pnpm 10.33.0 through Corepack.
- Rstest for rule and integration tests.
- Playwright Chromium for Module Federation browser verification.
- GitHub Actions for CI and publish workflow execution.
- npm registry checks for final beta package verification.

# Global Constraints

- Communicate and summarize in Chinese.
- Work from live checkout state; preserve unrelated user changes.
- Keep changes minimal and directly tied to beta readiness.
- Do not add a second test runner; new coverage uses Rstest.
- Keep the Module Federation verification real: build representative apps, start real HTTP services, load the browser page, and assert runtime behavior.
- Keep Tailwind CSS default demo on v4.
- Do not introduce `NODE_AUTH_TOKEN`, `npm publish`, or `release:publish` into `.github/workflows/ci.yml`.
- `apps/**` and `website` remain examples or acceptance projects, not publish packages.
- Before push, run `pnpm workflow:check`, `git diff --check`, and the relevant Rstest suite.
- Before release, run or account for `pnpm ci:verify`, `pnpm empbuild`, `pnpm apps:acceptance`, and `pnpm release:publish:dry -- --skip-build`.

# Task 1: Fix CI MF Browser Dependency

Files:

- `.github/workflows/ci.yml`
- `scripts/apps.rules.test.ts`
- `.superpowers/plans/2026-06-26-v4-beta-release.md`

Steps:

1. Add a Rstest rule asserting the CI apps job installs Playwright Chromium before `pnpm apps:acceptance`.
2. Run `pnpm test:rules` and confirm the new rule fails before the workflow change.
3. Add an `Install Playwright Chromium` step in the CI `apps` job after dependency install and before `pnpm apps:acceptance`.
4. Run `pnpm test:rules`, `pnpm workflow:check`, `git diff --check`, and verify `.github/workflows/ci.yml` does not contain forbidden publish patterns.
5. Commit and push the fix to `v4`.
6. Confirm the new remote CI run reaches green for `verify`, `build`, and `apps`.

# Task 2: Prepare Beta Version

Files:

- Root and package version files touched by the existing release version script.
- Changelog files touched by the existing release version script.

Steps:

1. Inspect the release version command behavior enough to confirm the intended beta version path.
2. Run the existing version command to prepare `4.0.0-beta.0`.
3. Review the diff to confirm only release metadata and version files changed.
4. Run `pnpm release:check` and `pnpm release:publish:dry -- --skip-build`.
5. Run the relevant local gates after the version change.
6. Commit and push the beta prep commit to `v4`.
7. Confirm the remote CI run for the beta prep commit reaches green.

# Task 3: Publish Dry-Run

Files:

- No source file changes expected.

Steps:

1. Trigger the publish workflow in dry-run mode from `v4`.
2. Wait for completion and inspect failure logs if the workflow fails.
3. Confirm the dry-run does not publish packages and uses the expected internal package scope.

# Task 4: Publish Beta

Files:

- No source file changes expected.

Steps:

1. Trigger the publish workflow in real publish mode from `v4` after green CI and dry-run success.
2. Wait for completion and inspect failure logs if the workflow fails.
3. Verify npm registry beta dist-tags and representative package versions, at minimum `@empjs/cli`, `@empjs/share`, and `@empjs/plugin-react`.
4. Record final evidence: commit hashes, CI runs, publish runs, verification commands, and any remaining risk.
