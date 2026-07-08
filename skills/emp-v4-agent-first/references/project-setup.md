# Project Setup

Use this reference for EMP v4 project creation, installation, and machine-readable diagnostics.

## Environment Baseline

- Node.js `^20.19.0 || >=22.12.0`
- pnpm `pnpm@10.33.0`
- EMP v4 rc packages use the `@rc` dist-tag for trial installs.
- Run package-manager commands through Corepack when operating in this repository.

## Install Patterns

React host or standalone React project:

```bash
pnpm add -D @empjs/cli@rc @empjs/plugin-react@rc @empjs/share@rc
```

Vue 3 remote or standalone Vue 3 project:

```bash
pnpm add -D @empjs/cli@rc @empjs/plugin-vue3@rc @empjs/share@rc
```

Vue 2 project:

```bash
pnpm add -D @empjs/cli@rc @empjs/plugin-vue2@rc @empjs/share@rc
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
