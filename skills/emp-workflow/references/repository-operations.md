# EMP Repository Operations

Read only the section matching Skill maintenance, Git/PR closure, worktree cleanup, test architecture, release automation, or package scope.

## Project Skills

- Store project Skills under `skills/<skill-name>/`; each needs `SKILL.md` with only `name` and `description` frontmatter.
- Use `skill-creator` before creating or updating a Skill. Initialize new Skills with its `init_skill.py` instead of hand-writing the full template.
- Keep the body concise. Put detailed knowledge in `references/`, deterministic helpers in `scripts/`, and output resources in `assets/`.
- Keep references one level below `SKILL.md` and link each reference directly with an explicit read condition.
- Avoid duplicating rules between `AGENTS.md`, `SKILL.md`, and references. Keep decisions in AGENTS, procedure/navigation in SKILL, and details in references.
- Maintain `agents/openai.yaml`; do not add README, installation guides, quick references, or changelogs.
- Validate with `python3 /Users/Bigo/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/<skill-name>` and run representative scripts when present.

## Directory and Package Boundaries

- `packages/**` is the publishable package area.
- `apps/**` and `website/**` are examples, acceptance projects, or sites and are excluded from automatic publishing.
- `packages/cdn-*` and `packages/lib-*` retain independent version lines unless explicitly included.
- Modify `pnpm-lock.yaml` only for dependency, workspace package, or install-result changes.
- Use `.github/workflows/ci.yml`, PR template, and CODEOWNERS for normal automation; modify publish workflow only for release work.
- Never commit generated outputs, caches, local indexes, or isolated checkouts.

## Git, PR, and Review

- Before editing or committing, inspect branch/upstream and preserve unrelated changes.
- Do not use force push, reset, checkout-overwrite, broad clean, or destructive external operations without explicit authorization.
- Commit only when the user requests commit/push or the task is release/PR closure.
- Before commit: recheck status, stage exact task files, run `git diff --cached --check`, inspect the cached file list, and run matrix-selected verification.
- PRs use `.github/pull_request_template.md` and state scope, protected paths not touched, commands/results, skipped checks, and risk.
- Follow `.github/CODEOWNERS`; workflow, Skill, script, package, and lockfile changes need the matching review route.
- A review package contains core diff, verification evidence, directory-boundary confirmation, and residual risk.

## Worktree Cleanup

- Inventory with `git worktree list --porcelain` and `du -sh .worktrees`.
- For each candidate run `git -C <path> status --short --branch`; for dirty candidates also run `git -C <path> diff --stat`.
- Preserve or obtain explicit discard confirmation for dirty worktrees before removal.
- Remove clean candidates with `git worktree remove <path>`, then run `git worktree prune`.
- Treat branch deletion separately. Check `git merge-base --is-ancestor <branch> v4`, upstream, and unmerged commits before deleting a branch.
- Never start with `rm -rf .worktrees`; use filesystem removal only for confirmed metadata corruption with no work to preserve.

## Test Strategy

- Prefer real acceptance/integration tests for CLI, Rspack/Rslib builds, Module Federation, runtime, output files, HTTP, and browser behavior.
- Use Rstest as the test runner for new or migrated tests. Do not add another runner or expand legacy `node:test` patterns.
- Route package tests through root commands such as `test:cli`, `test:packages`, `test:rules`, and `ci:verify`.
- Browser behavior belongs in the unified Rstest/Playwright capability, not ad hoc standalone scripts.
- Scale verification to risk using `change-matrix.md`; do not run full acceptance for a documentation-only change.

## Release Safety

- CI validates only and must not contain npm credentials or publish commands.
- Publish scripts require dry-run support and explicit confirmation for real publishing.
- Automatic release scope stays under `packages/**`; exclude apps and website.
- Core v4 packages may share a release line; CDN and legacy lib packages remain independent unless explicitly included.
- Release notes use actual changes only, omit empty groups, and include warning/known-issues sections for regressions or compatibility risk.
- Verify package scope, dry-run behavior, reproducible changelog, `test:rules`, `release:check`, and `ci:verify` as required by the matrix.
