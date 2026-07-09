# Circular Check Rspack Plugin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Add an EMP config switch for Rspack's built-in `CircularCheckRspackPlugin`, defaulting to disabled.

**Architecture:** Reuse the existing CLI plugin wiring pattern used by `tsCheckerRspackPlugin`: expose a top-level config field, normalize `true` to `{}`, preserve `false`/`undefined` as disabled, and register the Rspack plugin only when explicitly enabled. Keep the change inside `@empjs/cli` and add shape coverage through the existing real CLI fixture test.

**Tech Stack:** TypeScript, `@rspack/core@2.1.3`, `@empjs/chain`, Node fixture tests, `corepack pnpm`.

## Global Constraints

- Default communication and final reporting are in Chinese.
- Do not touch unrelated dirty files; `test/website.rules.test.ts` already has unrelated local changes and must not be modified.
- `CircularCheckRspackPlugin` is Rspack built-in; do not add a dependency.
- The new option defaults to disabled unless explicitly configured.
- Follow TDD: write failing CLI fixture tests before implementation.
- Verification must include focused CLI shape test, CLI package test, workflow check, `git diff --check`, and explain if full `empbuild` is skipped.

---

### Task 1: Add CLI Shape Coverage

**Files:**
- Modify: `packages/cli/test/rspack-config-shape.test.mjs`

**Interfaces:**
- Consumes: built `packages/cli/dist/index.js` through the existing `loadStoreForFixture` helper.
- Produces: assertions that `circularCheckRspackPlugin` is disabled by default and enabled only when configured.

- [x] **Step 1: Write the failing test**

Add fixture assertions:

```js
const getPluginNames = config => (config.plugins ?? []).map(plugin => plugin?.constructor?.name ?? plugin?.name ?? '')

assert.ok(!getPluginNames(defaultConfig).includes('CircularCheckRspackPlugin'))

const enabledConfig = await loadStoreForFixture(
  await createFixture('rspack-circular-check', {
    appSrc: 'src',
    appEntry: 'index.ts',
    circularCheckRspackPlugin: {
      failOnError: true,
      include: /src/,
    },
  }),
)
assert.ok(getPluginNames(enabledConfig).includes('CircularCheckRspackPlugin'))
```

- [x] **Step 2: Run RED check**

Run: `node packages/cli/test/rspack-config-shape.test.mjs`

Expected: FAIL because the config field is not wired and the plugin is not present.

### Task 2: Wire EMP Config to Rspack Plugin

**Files:**
- Modify: `packages/cli/src/types/config.ts`
- Modify: `packages/cli/src/store/empConfig.ts`
- Modify: `packages/cli/src/store/chain.ts`
- Modify: `packages/cli/src/store/rspack/plugin.ts`

**Interfaces:**
- Consumes: `circularCheckRspackPlugin?: CircularCheckRspackPluginOptions | boolean`.
- Produces: `store.empConfig.circularCheckRspackPlugin` returning `false | CircularCheckRspackPluginOptions`, and a chain plugin named `CircularCheckRspackPlugin` when enabled.

- [x] **Step 1: Add config type**

Import `CircularCheckRspackPluginOptions` from `@rspack/core` and add:

```ts
circularCheckRspackPlugin?: CircularCheckRspackPluginOptions | boolean
```

- [x] **Step 2: Add config normalizer**

Add an `EmpConfig` getter matching `tsCheckerRspackPlugin` semantics:

```ts
get circularCheckRspackPlugin() {
  let options = {}
  if (!this.store.empOptions.circularCheckRspackPlugin) return false
  if (typeof this.store.empOptions.circularCheckRspackPlugin === 'object') {
    options = this.store.empOptions.circularCheckRspackPlugin
  }
  return this.assign({}, options)
}
```

- [x] **Step 3: Add chain name and plugin registration**

Add `circularCheckRspackPlugin: 'CircularCheckRspackPlugin'` to chain names, call `this.circularCheckRspackPlugin()` during plugin setup, and register:

```ts
this.store.chain
  .plugin(this.store.chainName.plugin.circularCheckRspackPlugin)
  .use(rspack.CircularCheckRspackPlugin, [this.store.empConfig.circularCheckRspackPlugin])
```

### Task 3: Verify

**Files:**
- All files modified by Tasks 1-2.

**Interfaces:**
- Consumes: updated CLI source and test.
- Produces: verification evidence for final report.

- [x] **Step 1: Build CLI**

Run: `corepack pnpm --filter @empjs/cli build`

Expected: PASS.

- [x] **Step 2: Run focused fixture test**

Run: `node packages/cli/test/rspack-config-shape.test.mjs`

Expected: PASS.

- [x] **Step 3: Run CLI package test**

Run: `corepack pnpm --filter @empjs/cli test`

Expected: PASS.

- [x] **Step 4: Run workflow and diff checks**

Run: `corepack pnpm workflow:check && git diff --check`

Expected: PASS.
