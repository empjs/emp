# EMP Change Matrix

## Directory Boundaries

Default writable areas:

- `AGENTS.md`
- `.codex/config.toml`
- `.codex/hooks.json`
- `.codex/agents/emp-*.toml`
- `skills/<skill-name>/`
- `scripts/*.mjs`
- `.github/workflows/ci.yml`
- `.github/pull_request_template.md`
- `.github/CODEOWNERS`
- package files directly required by the task

Ask for explicit user confirmation before changing:

- `apps/**`
- `website/**`
- `packages/cdn-*/**`
- `packages/lib-*/**`
- `.github/workflows/publish.yml`
- `pnpm-lock.yaml` unless the task changes dependencies
- generated outputs such as `dist/`, `output/`, `coverage/`

Do not create or continue:

- repo-local historical workflow directories
- repo-local Skill files outside `skills/<skill-name>/`
- new test runners beside the existing real-test strategy

Never commit or preserve local caches:

- `node_modules/`
- `.codegraph/`
- `.agents/`
- `.worktrees/`
- `.turbo/`
- `.rslib/`
- `.rspack-cache/`

## Validation Matrix

For any workflow or documentation-only change:

- `git diff --check`
- `pnpm workflow:check`

For Codex trigger or subagent rule changes:

- `git diff --check`
- `pnpm workflow:check`
- `codex debug models` must list `gpt-5.3-codex-spark`, `gpt-5.4`, `gpt-5.5`, `gpt-5.6-terra`, and `gpt-5.6-sol`
- Spark smoke must set `model_reasoning_summary = "none"`; otherwise current Codex request assembly sends an unsupported parameter
- parse `.codex/hooks.json` as JSON and smoke-test hook commands locally
- `codex debug prompt-input --enable hooks --enable multi_agent "subagent 计划执行"` should show the repo `AGENTS.md` instructions and avoid retired workflow or memory-MCP terminology; this proves prompt assembly, not hook stdout execution
- `codegraph sync . && codegraph status .` before finalizing workflow guard changes

For `skills/*` changes:

- `python3 /Users/Bigo/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/<skill-name>`
- `pnpm workflow:check`

For `.worktrees/` or Git worktree cleanup:

- `git worktree list --porcelain`
- `du -sh .worktrees`
- `git -C <path> status --short --branch` for every cleanup candidate
- `git -C <path> diff --stat` for every dirty candidate
- Use `git worktree remove <path>` for clean or explicitly confirmed candidates, then `git worktree prune`
- Check `git merge-base --is-ancestor <branch> v4` before branch deletion; do not delete branches as part of directory cleanup unless explicitly requested

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

## Token-First Model Gates

- Spark is text-only and limited to routing, classification, compression, and formatting of content already in the brief; it does not receive repository or tool work.
- GPT-5.4 handles one-file edits and low-risk fixes; GPT-5.5 handles normal multi-file implementation and controller work.
- Medium/high-risk behavior, dependency, build, release, or cross-module changes get a separate GPT-5.6-Terra verification pass.
- GPT-5.6-Sol review is reserved for architecture, public API, dependency strategy, security, release scope, or go/no-go recommendations.
- No child result authorizes commit, push, publish, merge, destructive cleanup, or external writes; the controller applies the repository gates.

## Commit Rules

- Commit when the user explicitly says `提交`, `push`, `改完要 push 代码`, or when release/PR closure is the requested deliverable.
- Do not commit for read-only analysis, planning-only work, failed validation, unclear scope, or unrelated dirty worktree state.
- Before commit: run `git status --short --branch`, stage only intended files, run `git diff --cached --check`, and run the validation commands required by this matrix.
- For newly created workflow files, always include `git status --short --branch` or `git diff --stat --cached` in the handoff so untracked `.codex/*` files are not invisible to reviewers.

## Release Safety

- CI workflow must not contain `NODE_AUTH_TOKEN`, `npm publish`, or `release:publish`.
- Publish workflow may publish only through explicit release paths.
- `release:check` must keep automatic internal release scope under `packages/**`.
- `apps/**` and `website/**` are examples or sites, not automatic publish scope.
