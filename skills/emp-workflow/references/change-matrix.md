# EMP Change Matrix

## Directory Boundaries

Default writable areas:

- `AGENTS.md`
- `.superpowers/plans/`
- `.superpowers/specs/`
- `.superpowers/sdd/`
- `skills/<skill-name>/`
- `scripts/*.mjs`
- `.github/workflows/ci.yml`
- `.github/pull_request_template.md`
- `.github/CODEOWNERS`
- package files directly required by the task

Ask for explicit user confirmation before changing:

- `projects/**`
- `website/**`
- `packages/cdn-*/**`
- `packages/lib-*/**`
- `.github/workflows/publish.yml`
- `pnpm-lock.yaml` unless the task changes dependencies
- generated outputs such as `dist/`, `output/`, `coverage/`

Do not create or continue:

- `docs/superpowers/**`
- repo-local Skill files outside `skills/<skill-name>/`
- new test runners beside the existing real-test strategy

Never commit or preserve local caches:

- `node_modules/`
- `.codebase-memory/`
- `.codegraph/`
- `.turbo/`
- `.rslib/`
- `.rspack-cache/`

## Validation Matrix

For any workflow or documentation-only change:

- `git diff --check`
- `pnpm workflow:check`

For `skills/*` changes:

- `python3 /Users/Bigo/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/<skill-name>`
- `pnpm workflow:check`

For GitHub Actions, PR, review, or automation changes:

- `pnpm workflow:check`
- `git diff --check`
- `rg -n "NODE_AUTH_TOKEN|npm publish|release:publish" .github/workflows/ci.yml` should return no matches

For release automation or package-scope changes:

- `pnpm workflow:check`
- `pnpm test:rules`
- `pnpm release:check`
- `pnpm ci:verify`

For build-chain, package source, Rslib, Rspack, or workspace dependency changes:

- relevant package test
- `pnpm ci:verify`
- `pnpm empbuild`

## PR / Review Closure

Every implementation should leave a reviewable trail:

1. Scope: state the files and directories intentionally changed.
2. Boundaries: state protected directories that were not touched.
3. Tests: paste exact commands and outcomes.
4. Review: identify whether the change needs code review, release review, or workflow review.
5. CI: ensure PR/push CI runs `pnpm ci:verify` and `pnpm empbuild`.

## Release Safety

- CI workflow must not contain `NODE_AUTH_TOKEN`, `npm publish`, or `release:publish`.
- Publish workflow may publish only through explicit release paths.
- `release:check` must keep automatic internal release scope under `packages/**`.
- `projects/**` and `website/**` are examples or sites, not automatic publish scope.
