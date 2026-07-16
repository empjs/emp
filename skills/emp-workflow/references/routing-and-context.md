# EMP Routing and Context

Read this reference only when deciding preflight depth, CodeGraph use, model escalation, subagent delegation, or tool-output handling.

## Task-Tier Preflight

### Text or explanation

- Do not inspect the repository unless the answer depends on current files or external state.
- Do not load the workflow Skill again when the active instructions already answer the question.

### Single-file docs, config, script, or literal change

- Run `git status --short --branch`.
- Read the target file and the smallest directly relevant rule section.
- Use `rg` or a structured parser. Skip CodeGraph sync and `codex mcp list`.

### Cross-file or cross-package code

- Run `git status --short --branch`.
- Run `codegraph sync .` and `codegraph status .`.
- Prefer, in order: `codegraph query`, `codegraph node`, `codegraph callers`/`codegraph callees`, `codegraph affected`, then `codegraph explore`.
- Use `rg` only for missing literals, config, scripts, or evidence CodeGraph cannot provide.

### CI, dependency, build, or release

- Add the relevant package manifests, lockfile, scripts, and workflow files to the targeted read set.
- Check external package or release state only when the task depends on it.
- Use the validation matrix; do not automatically run every repository command.

### MCP, browser, or external system

- Run `codex mcp list` only for MCP-dependent tasks.
- Load or start only the connector/agent required by the task.
- Verify external writes by reading back the resulting state.

## Token-First Model Routing

| Lane | Model | Use |
| --- | --- | --- |
| Controller | `gpt-5.6-terra` low | Normal decisions and shared-state work |
| `emp-spark` | `gpt-5.3-codex-spark` low | Provided-text classification, compression, formatting |
| `emp-fast` | `gpt-5.6-terra` low | Search, one-file edits, docs/config, low-risk fixes |
| `emp-impl` | `gpt-5.6-terra` medium | Bounded multi-file implementation and tests |
| Verifier | `gpt-5.6-terra` | Independent medium/high-risk acceptance |
| `emp-deep` | `gpt-5.6-sol` medium, read-only | Architecture, public API, dependency/release/security risk |

- Escalate reasoning effort and lane by judgment cost; do not preselect Sol.
- Low-risk edits and deterministic Git commands do not need a verifier.
- Use Terra after behavior, dependency, build, release, or cross-module changes when independent execution can catch material risk.
- Use Sol only when the task needs complex judgment, not merely because it is large.
- Raise Sol to high only when representative evals show a material quality gain over medium.
- Never use a generic `gpt-5.6` model id.

## Delegation Contract

- Keep immediate blockers, shared-file decisions, exploratory debugging, release go/no-go, and destructive operations in the controller.
- Default to one child. Use two only for independent domains; never exceed three direct children or `max_depth = 1`.
- Start children without full-context fork unless the minimum brief cannot be made self-contained.
- Briefs contain only: goal, ownership, required inputs, forbidden actions, done criteria, and validation commands.
- Child output contains only: result, changed files, verification, and risk.
- The controller checks live files and external state without repeating the child's exploration.

## Tool Output Budget

- Prefer precise commands and bounded output (`rg` filters, line ranges, JSON fields, `tail`).
- For verbose checks, write full logs outside the repository, preserve the exit code, and return only a summary:

```bash
log="${TMPDIR:-/tmp}/emp-check.log"
corepack pnpm ci:verify >"$log" 2>&1
status=$?
tail -n 80 "$log"
exit "$status"
```

- On success, report command, exit code, duration when useful, and a one-line result.
- On failure, inspect the failing section plus nearby context; do not inject the entire log unless diagnosis requires it.
- CI matrices consume runner time, not model tokens. Only logs read back into the task consume context.
