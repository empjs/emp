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
   - `codex mcp list`
   - `command -v codegraph`
   - `codegraph status .`
2. Use CodeGraph for code discovery before file search:
   - `codegraph sync .`
   - `codegraph status .`
   - `codegraph query <symbol-or-topic>`
   - `codegraph node <symbol-or-file>`
   - `codegraph callers <symbol>` / `codegraph callees <symbol>`
   - `codegraph affected <files...>`
   - `codegraph explore <topic>`
3. Use local file search only for strings, configs, docs, scripts, workflows, and Skill files.
4. Keep changes scoped to the user request. Do not rewrite unrelated user edits.
5. Before editing, identify the minimum validation commands from `references/change-matrix.md`.
6. After editing, run the relevant commands and report exact results.

## Common Decisions

- For repo workflow or agent rules, edit `AGENTS.md`.
- For reusable EMP agent behavior, create or update `skills/<skill-name>/` with `skill-creator`.
- For repeated checks, add deterministic Node scripts under `scripts/` and expose them from root `package.json`.
- For GitHub gates, use `.github/workflows/ci.yml`, `.github/pull_request_template.md`, and `.github/CODEOWNERS`.
- For long-lived Superpowers plans/specs, use `.superpowers/plans/` and `.superpowers/specs/`.

## Required Reference

Read `references/change-matrix.md` when the task touches:

- directory boundaries or forbidden paths
- package/release automation
- GitHub Actions, PR templates, or review policy
- validation command choices
- `skills/*` creation or updates

## Delivery Contract

Final responses for EMP workflow work must include:

- changed files
- validation commands and results
- any skipped high-cost verification with risk
- any remaining manual GitHub setting such as branch protection or reviewer configuration
