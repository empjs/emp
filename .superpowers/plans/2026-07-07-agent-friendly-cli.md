# Agent-Friendly CLI Doctor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a stable, machine-readable `emp doctor` self-check so future agents can inspect the EMP CLI before running project-changing commands.

**Architecture:** Keep the change inside `@empjs/cli` and reuse the existing Commander entrypoint. Implement `doctor` as a local, no-network diagnostic command with a shared JSON payload builder, then expose it through both `emp --json doctor` and `emp doctor --json` without changing existing `create`, `static`, `dev`, `build`, or `serve` behavior.

**Tech Stack:** TypeScript, Node.js ESM, Commander `11.1.0`, Rslib, Rstest, existing `@empjs/cli` package scripts.

## Global Constraints

- Default communication and delivery notes are Chinese.
- Do not touch unrelated dirty files: `scripts/release-acceptance-report.mjs`, `test/release-acceptance-report.test.ts`, or existing Rsbuild plan docs.
- Do not modify `apps/**`, `website`, publish workflow, lockfile, generated caches, or `packages/cli/dist/**` by hand.
- Use TDD: write the failing real CLI test first, run it, then implement the command.
- JSON mode prints JSON to stdout only; diagnostics and errors must remain machine-readable and must not include credentials.
- `doctor` must not require auth, network, package installation, or project generation.

---

### Task 1: Add `emp doctor --json` Agent Self-Check

**Files:**
- Create: `packages/cli/src/script/doctor.ts`
- Modify: `packages/cli/src/script/index.ts`
- Modify: `packages/cli/test/cli-create-help.test.ts`
- Modify: `packages/cli/docs/agent-first-create.md`

**Interfaces:**
- Produces: `runDoctorCommand(options?: {json?: boolean; cwd?: string}): Promise<void>` in `packages/cli/src/script/doctor.ts`
- Produces: JSON payload with fields `ok`, `command`, `version`, `cwd`, `auth`, `checks`, `warnings`, `errors`, and `nextActions`
- Consumes: existing `pkg.version` from `packages/cli/package.json`

- [x] **Step 1: Write the failing real CLI test**

Add a Rstest case in `packages/cli/test/cli-create-help.test.ts` that builds the CLI, runs:

```bash
node packages/cli/bin/emp.js --json doctor
node packages/cli/bin/emp.js doctor --json
```

and asserts both stdout values parse as JSON with:

```ts
expect(payload.ok).toBe(true)
expect(payload.command).toBe('doctor')
expect(payload.version).toMatch(/\d+\.\d+\.\d+/)
expect(payload.auth).toEqual({required: false, source: 'not-required'})
expect(payload.checks.some((check: {name: string; status: string}) => check.name === 'node' && check.status === 'passed')).toBe(true)
expect(payload.nextActions).toContain('emp create "React 主应用 + Vue 子应用" --dry-run --json')
```

- [x] **Step 2: Run the focused test and verify RED**

Run:

```bash
corepack pnpm --filter @empjs/cli test:real:create-help
```

Expected: FAIL because `doctor` or top-level `--json` is not registered.

- [x] **Step 3: Implement the doctor command**

Create `packages/cli/src/script/doctor.ts` with a deterministic local payload builder:

```ts
export interface DoctorCommandOptions {
  json?: boolean
  cwd?: string
}

export async function runDoctorCommand(options: DoctorCommandOptions = {}): Promise<void> {
  // Build a local diagnostic payload and print JSON when requested.
}
```

Register `program.option('--json', '输出 JSON 结果')` and `program.command('doctor')` in `packages/cli/src/script/index.ts`. Make `emp --json doctor` and `emp doctor --json` use the same JSON payload.

- [x] **Step 4: Document the agent entry**

Update `packages/cli/docs/agent-first-create.md` with a short “Agent 自检” section:

```bash
emp --json doctor
emp create "React 主应用 + Vue 子应用" --dry-run --json
```

Document that `doctor` is local/no-auth/no-network and that JSON mode is intended for agents.

- [x] **Step 5: Run focused GREEN verification**

Run:

```bash
corepack pnpm --filter @empjs/cli test:real:create-help
```

Expected: PASS.

- [x] **Step 6: Run package and workflow checks**

Run:

```bash
corepack pnpm --filter @empjs/cli test
corepack pnpm workflow:check
git diff --check
```

Expected: all commands exit 0.
