---
name: emp-workflow
description: EMP repository workflow guide for Codex agents. Use when working in /Users/Bigo/Desktop/develop/fontend-workspace/emp on workflow, release, package, test, CI, PR, review, directory-boundary, or validation tasks; also use before implementing non-trivial EMP code changes that need repo-specific preflight and verification rules.
---

# EMP Workflow

## Core Flow

1. Confirm live state first:
   - `git status --short --branch`
   - read `AGENTS.md`
   - check `.codex/config.toml` if present
   - check `.codex/hooks.json` if present
   - check `.codex/agents/` if subagents may be used
   - `codex mcp list`
   - `command -v codegraph`
   - `codegraph status .`
2. Use CodeGraph before cross-file or cross-package code discovery:
   - `codegraph sync .`
   - `codegraph status .`
   - `codegraph query <symbol-or-topic>`
   - `codegraph node <symbol-or-file>`
   - `codegraph callers <symbol>` / `codegraph callees <symbol>`
   - `codegraph affected <files...>`
   - `codegraph explore <topic>`
   - If the task is explicitly read-only, or only touches docs/config/scripts/Skill/`.codex/*`, `codegraph status .` is enough; state why sync was skipped.
3. Use local file search for strings, configs, docs, scripts, workflows, Skill files, and `.codex/*`.
4. For worktree cleanup or branch-isolation cleanup, inventory before removal:
   - `git worktree list --porcelain`
   - `du -sh .worktrees`
   - `git -C <path> status --short --branch`
   - `git -C <path> diff --stat` for dirty candidates
5. Before dispatching a subagent, read `.codex/agents/emp-*.toml` and keep the brief limited to the task scope.
6. Keep changes scoped to the user request. Do not rewrite unrelated user edits.
7. Before editing, identify the minimum validation commands from `references/change-matrix.md`.
8. After editing, run the relevant commands and report exact results.

## Token-First Model Routing

- Default controller: `gpt-5.5` with low reasoning and no reasoning summary.
- `emp-spark`: text-only `gpt-5.3-codex-spark` with low reasoning and no reasoning summary for routing, classification, compression, and formatting of content already in the brief. Do not give it repository or tool work.
- `emp-fast`: `gpt-5.4` with low reasoning for repository search, one-file edits, docs/config work, and low-risk fixes.
- `emp-impl`: `gpt-5.5` with medium reasoning for bounded multi-file implementation and tests.
- `emp-deep`: read-only `gpt-5.6-sol` with high reasoning for architecture, contracts, security, release risk, and final review.
- Use a `gpt-5.6-terra` verifier only after medium/high-risk behavior, dependency, build, release, or cross-module changes. If Spark is unavailable or needs writes, escalate to `emp-fast`.

## Delegation Contract

- Keep simple tasks, immediate blockers, and shared-file decisions in the controller.
- Default to one child; use two parallel children only for independent domains and never exceed three direct children. Keep `max_depth = 1`.
- Give each child a short brief with goal, ownership, inputs, forbidden actions, done criteria, and validation commands.
- Do not copy the full conversation or full Skill by default. Include only required user decisions and repository facts.
- Allow one writer per file or shared state. Serialize dependency, lockfile, migration, snapshot, port, release, and external-write work.
- Require compact child output: result, changed files, verification, and risks. The controller checks live state without repeating exploration.

## Common Decisions

- For repo workflow or agent rules, edit `AGENTS.md`.
- For Codex runtime feature flags, short trigger reminders, or repo-local subagent definitions, edit `.codex/config.toml`, `.codex/hooks.json`, and `.codex/agents/emp-*.toml`.
- For reusable EMP agent behavior, create or update `skills/<skill-name>/` with `skill-creator`.
- For public usage docs, keep the website as a concise task index and put complete agent-readable usage in `skills/emp`; route blog-like launch notes and new version content to GitHub Releases and GitHub Tags.
- For repeated checks, add deterministic Node scripts under `scripts/` and expose them from root `package.json`.
- For GitHub gates, use `.github/workflows/ci.yml`, `.github/pull_request_template.md`, and `.github/CODEOWNERS`.
- For plans, specs, and execution notes, keep them in the current task by default; only create project docs when the user explicitly asks for a durable file.
- For `.worktrees/` cleanup, use `git worktree remove <path>` plus `git worktree prune` after confirming the candidate is clean or the user confirmed discard/preservation.

## Required Reference

Read `references/change-matrix.md` when the task touches:

- directory boundaries or forbidden paths
- package/release automation
- GitHub Actions, PR templates, or review policy
- validation command choices
- `skills/*` creation or updates
- `.codex/*` changes

## Decision Rules

- Use CodeGraph when the answer depends on symbols, imports, call chains, package boundaries, runtime paths, or affected tests.
- Use `rg` and direct reads when the answer depends on text literals, markdown, JSON/TOML/YAML, scripts, workflows, hooks, or plan files.
- Use Codex multi-agent tools only when an independent sidecar reduces controller context or a medium/high-risk change needs independent verification.
- Keep shared-file, blocking, or protected-path work in the main controller.
- Use `.codex/agents/emp-*.toml` as the project semantic profile when `spawn_agent` only exposes generic roles.
- Commit only when the user explicitly asks for commit/push or the active task is a release/PR closure; otherwise leave verified local changes unstaged unless asked.
- Never remove `.worktrees/` wholesale. Treat dirty worktrees as user work until preserved or explicitly discarded; separate worktree removal from branch deletion.

## Delivery Contract

Final responses for EMP workflow work must include:

- changed files
- validation commands and results
- any skipped high-cost verification with risk
- any remaining manual GitHub setting such as branch protection or reviewer configuration
