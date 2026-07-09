# React Compiler Skill And RC2 Tag Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Document the React Compiler adoption policy in EMP's Agent-First skill, include the policy in the rc.2 release notes, and create a local annotated rc tag.

**Architecture:** Keep React Compiler as an explicit `@empjs/plugin-react` option instead of a hidden default. Put agent-facing decision rules in `skills/emp-v4-agent-first/references/plugins.md`, keep package docs aligned in `packages/plugin-react/README.md`, and guard the skill content with root rules tests. Create a commit and annotated tag only after validation passes.

**Tech Stack:** EMP v4, Rspack 2.1, React Compiler via `builtin:swc-loader`, Rstest, skill-creator validation, Git annotated tags.

## Global Constraints

- Use Chinese for user-facing documentation.
- Do not enable React Compiler automatically in `@empjs/plugin-react`.
- Agent may recommend React Compiler, but project config must explicitly opt in.
- React 17/18 requires explicit `target` and `react-compiler-runtime`.
- Do not stage unrelated existing website/theme/tmp dirty changes unless required by this plan.
- Do not push the tag or publish npm packages without explicit user confirmation.

---

### Task 1: Add React Compiler Skill Rules

**Files:**
- Modify: `test/agent-first-skill.rules.test.ts`
- Modify: `skills/emp-v4-agent-first/references/plugins.md`
- Modify: `packages/plugin-react/README.md`

**Interfaces:**
- Consumes: existing `reactCompiler?: boolean | ReactCompilerOptions` plugin option.
- Produces: documented manual opt-in policy, React 19 quick path, React 17/18 target/runtime path, and Agent decision guardrails.

- [x] **Step 1: Add failing rule assertions**

Add assertions that `references/plugins.md` contains:

```ts
expect(plugins).toContain('React Compiler')
expect(plugins).toContain('默认不自动开启')
expect(plugins).toContain('Agent 可以建议开启')
expect(plugins).toContain('react-compiler-runtime')
expect(plugins).toContain("target: '18'")
expect(plugins).toContain('compilationMode')
expect(plugins).toContain('Module Federation')
```

- [x] **Step 2: Run RED check**

Run: `corepack pnpm test:rules`

Expected: FAIL before the skill reference is updated.

- [x] **Step 3: Update skill and package docs**

Add a React Compiler section to `skills/emp-v4-agent-first/references/plugins.md` and `packages/plugin-react/README.md` with:

```ts
pluginReact({
  reactCompiler: true,
})
```

and:

```ts
pluginReact({
  reactCompiler: {
    target: '18',
    compilationMode: 'annotation',
  },
})
```

- [x] **Step 4: Validate skill folder**

Run: `python3 /Users/Bigo/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/emp-v4-agent-first`

Expected: PASS.

### Task 2: Update RC2 Release Notes

**Files:**
- Modify: `CHANGELOG.md`

**Interfaces:**
- Consumes: rc.2 release section.
- Produces: rc.2 release notes that include all new capability surfaces.

- [x] **Step 1: Add React Compiler policy to rc.2**

Update `CHANGELOG.md` to mention the Agent-First React Compiler policy and plugin docs.

- [x] **Step 2: Verify release metadata**

Run: `corepack pnpm release:check`

Expected: PASS with root version `4.0.0-rc.2` and 17 internal packages.

### Task 3: Verify And Create RC Tag

**Files:**
- Stage only plan-scoped files plus previous rc.2 implementation files.

**Interfaces:**
- Consumes: local working tree and release scripts.
- Produces: commit and local annotated tag `v4.0.0-rc.2`.

- [x] **Step 1: Run validation**

Run:

```bash
corepack pnpm test:rules
corepack pnpm ci:verify
corepack pnpm empbuild
node scripts/release.mjs publish --dry-run --skip-build --force-all --tag rc
git diff --check
```

Expected: PASS.

- [x] **Step 2: Commit scoped files**

Stage only the rc.2 implementation, skill docs, tests, release manifests, changelog, and plan files. Run:

```bash
git diff --cached --check
git commit -m "feat(release): prepare emp v4 rc2"
```

- [x] **Step 3: Create local annotated tag**

Run:

```bash
git tag -a v4.0.0-rc.2 -m "EMP v4.0.0-rc.2"
```

The tag message must include Rspack 2.1 defaults, manual opt-ins, React Compiler policy, and validation evidence.
