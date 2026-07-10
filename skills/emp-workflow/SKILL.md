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
   - If the task is explicitly read-only, or only touches docs/config/scripts/Skill/`.codex/*`/`.superpowers/*`, `codegraph status .` is enough; state why sync was skipped.
3. Use local file search for strings, configs, docs, scripts, workflows, Skill files, `.codex/*`, and `.superpowers/*`.
4. For worktree cleanup or branch-isolation cleanup, inventory before removal:
   - `git worktree list --porcelain`
   - `du -sh .worktrees`
   - `git -C <path> status --short --branch`
   - `git -C <path> diff --stat` for dirty candidates
5. Before executing any `.superpowers/plans/*` plan or dispatching a subagent, read `.superpowers/subagents.md`.
6. Keep changes scoped to the user request. Do not rewrite unrelated user edits.
7. Before editing, identify the minimum validation commands from `references/change-matrix.md`.
8. After editing, run the relevant commands and report exact results.

## Common Decisions

- For repo workflow or agent rules, edit `AGENTS.md`.
- For Codex runtime feature flags, short trigger reminders, or repo-local subagent definitions, edit `.codex/config.toml`, `.codex/hooks.json`, and `.codex/agents/emp-*.toml`.
- For reusable EMP agent behavior, create or update `skills/<skill-name>/` with `skill-creator`.
- For public usage docs, keep the website as a concise task index and put complete agent-readable usage in `skills/emp`; route blog-like launch notes and new version content to GitHub Releases and GitHub Tags.
- For repeated checks, add deterministic Node scripts under `scripts/` and expose them from root `package.json`.
- For GitHub gates, use `.github/workflows/ci.yml`, `.github/pull_request_template.md`, and `.github/CODEOWNERS`.
- For long-lived Superpowers plans/specs, use `.superpowers/plans/` and `.superpowers/specs/`; for subagent dispatch rules, use `.superpowers/subagents.md`.
- For `.worktrees/` cleanup, use `git worktree remove <path>` plus `git worktree prune` after confirming the candidate is clean or the user confirmed discard/preservation.

## Required Reference

Read `references/change-matrix.md` when the task touches:

- directory boundaries or forbidden paths
- package/release automation
- GitHub Actions, PR templates, or review policy
- validation command choices
- `skills/*` creation or updates
- `.codex/*` or `.superpowers/subagents.md` changes

## Decision Rules

- Use CodeGraph when the answer depends on symbols, imports, call chains, package boundaries, runtime paths, or affected tests.
- Use `rg` and direct reads when the answer depends on text literals, markdown, JSON/TOML/YAML, scripts, workflows, hooks, or plan files.
- Use `superpowers:subagent-driven-development` when a written plan has independent task domains and multi-agent tools are available.
- Use `superpowers:executing-plans` when tasks share files/state, the next step is blocking, or subagent tools are unavailable.
- Use `.codex/agents/emp-*.toml` as the project semantic profile and `.superpowers/subagents.md` as the runtime mapping when `spawn_agent` only exposes generic roles.
- Commit only when the user explicitly asks for commit/push or the active task is a release/PR closure; otherwise leave verified local changes unstaged unless asked.
- Never remove `.worktrees/` wholesale. Treat dirty worktrees as user work until preserved or explicitly discarded; separate worktree removal from branch deletion.

## Delivery Contract

Final responses for EMP workflow work must include:

- changed files
- validation commands and results
- any skipped high-cost verification with risk
- any remaining manual GitHub setting such as branch protection or reviewer configuration
