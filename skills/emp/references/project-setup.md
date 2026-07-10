# Project Setup

Use this reference for EMP v4 project creation, installation, and machine-readable diagnostics.

## Inputs to collect

- Target project type: standalone app, host, remote, or mixed workspace.
- Framework choice: React, Vue 2, Vue 3, or bridge scenario.
- Package manager and Node.js version from `emp doctor --json`.
- Whether the user expects a dry-run plan, file writes, dependency install, or dev server startup.

## Files to inspect

- `package.json`
- `pnpm-workspace.yaml`
- `emp.config.ts`
- `emp.intent.yaml`
- `emp-report.json`

## Success evidence

- `emp doctor --json` reports a supported runtime and package manager.
- `emp create --dry-run --json` returns a complete plan before file writes.
- Generated `emp-report.json` records apps, checks, command results, skipped steps, and failure reasons.
- The selected app or workspace builds with the EMP v4 formal release packages.

## Environment Baseline

- Node.js `^20.19.0 || >=22.12.0`
- pnpm `pnpm@10.33.0`
- EMP v4 docs use formal release packages and do not append prerelease dist-tags to install commands.
- Run package-manager commands through Corepack when operating in this repository.

## Install Patterns

React host or standalone React project:

```bash
pnpm add -D @empjs/cli @empjs/plugin-react @empjs/share
```

Vue 3 remote or standalone Vue 3 project:

```bash
pnpm add -D @empjs/cli @empjs/plugin-vue3 @empjs/share
```

Vue 2 project:

```bash
pnpm add -D @empjs/cli @empjs/plugin-vue2 @empjs/share
```

## Agent-First Create

Create the current P0 topology:

```bash
emp create "React 主应用 + Vue 子应用"
```

Dry-run without writing files:

```bash
emp create "React 主应用 + Vue 子应用" --dry-run --json
```

Create into a target directory:

```bash
emp create "React 主应用 + Vue 子应用" --dir <target-dir>
```

Skip installation and dev server startup while keeping structured output:

```bash
emp create "React 主应用 + Vue 子应用" --skip-install --skip-dev --json
```

## Doctor

Use doctor before creating or rewriting a project:

```bash
emp doctor --json
emp --json doctor
```

`emp doctor --json` is the preferred automation input because it reports runtime, package manager, cwd, and next-step hints without requiring account credentials.

## Generated Files

The create flow writes:

- `emp.intent.yaml`
- root `package.json`
- `pnpm-workspace.yaml`
- `apps/host`
- `apps/user`
- `emp-report.json`

`emp-report.json` records apps, checks, command results, skipped steps, and failure reasons. A `passed` status means no executed step failed; skipped steps are not implicit passes.

## Safety

- Do not overwrite a non-empty target directory.
- Use `--dry-run --json` before writing when an agent needs user approval.
- Treat create as new-project scaffolding, not a lossless migration of an existing project.
