# EMP Change Matrix

Read this file only to select validation commands, confirm protected scope, or decide whether independent GPT-5.6 verification is required.

## Scope Matrix

| Change | Default scope | Extra authorization |
| --- | --- | --- |
| Workflow/config | `AGENTS.md`, `.codex/**`, `skills/**`, workflow scripts | Publish workflow |
| Package code | Task-owning `packages/**` | `packages/cdn-*`, `packages/lib-*` |
| CI/review | CI workflow, PR template, CODEOWNERS | Publish workflow |
| Examples/sites | None by default | `apps/**`, `website/**` |
| Dependencies | Required manifests | `pnpm-lock.yaml` only when install graph changes |

Never commit generated output or caches: `node_modules/`, `dist/`, `output/`, `coverage/`, `.codegraph/`, `.agents/`, `.worktrees/`, `.turbo/`, `.rslib/`, `.rspack-cache/`.

## Validation Matrix

### Documentation or workflow text

- `git diff --check`
- `corepack pnpm workflow:check`

### Codex routing, hooks, or Agent profiles

- Documentation/workflow checks above
- `codex debug models` must list the configured concrete model IDs
- Parse `.codex/hooks.json` as JSON and smoke-test hook commands locally
- Spark smoke keeps `model_reasoning_summary = "none"`
- `codex debug prompt-input --enable hooks --enable multi_agent "subagent 计划执行"` validates prompt assembly, not hook stdout execution
- Run `codegraph sync . && codegraph status .` only when the guard change depends on code-index behavior

### Project Skill

- `python3 /Users/Bigo/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/<skill-name>`
- `corepack pnpm workflow:check`
- Run a representative command for each deterministic Skill script changed

### GitHub Actions, PR, or review automation

- `corepack pnpm workflow:check`
- `git diff --check`
- Confirm CI has no `NODE_AUTH_TOKEN`, `npm publish`, or `release:publish`

### Tests or test configuration

- Relevant root test target
- `corepack pnpm ci:verify`

### Package source, build chain, Rslib/Rspack, or workspace dependency

- Relevant package/real acceptance test
- `corepack pnpm ci:verify`
- `corepack pnpm empbuild`

### Release automation or package scope

- `corepack pnpm workflow:check`
- `corepack pnpm test:rules`
- `corepack pnpm release:check`
- `corepack pnpm ci:verify`
- Verify dry-run, package scope, and reproducible changelog

### Worktree cleanup

- `git worktree list --porcelain`
- `du -sh .worktrees`
- Per candidate: status, and diff stat when dirty
- Use `git worktree remove <path>` then `git worktree prune`

## Independent Verification Gates

- No extra Agent for deterministic Git commands, text-only edits, or single-file low-risk changes.
- Use GPT-5.6 Terra after medium/high-risk behavior, dependency, build, release, or cross-module changes when independent execution can catch material risk.
- Use read-only GPT-5.6 Sol only for architecture, public API, dependency strategy, security, release scope, or go/no-go recommendations.
- A child cannot authorize commit, push, publish, merge, destructive cleanup, or external writes.

## Delivery Check

1. State intentionally changed files and protected scope not touched.
2. Report exact commands and outcomes using concise summaries.
3. State skipped checks and resulting risk.
4. Before commit, inspect status, stage exact files, run `git diff --cached --check`, and ensure untracked `.codex/*` files are not omitted accidentally.
