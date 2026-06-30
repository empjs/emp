# React Compiler Plugin React Demo Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move `apps/demo` to the current Rspack 2.1 React Compiler path through `@empjs/plugin-react` and remove the direct `@swc/react-compiler` app dependency when it is no longer needed.

**Architecture:** `@empjs/plugin-react` owns React-specific SWC transforms and writes React Compiler options into both JavaScript and TypeScript `builtin:swc-loader` rules. `apps/demo` should enable React Compiler through `pluginReact({ reactCompiler: true })` for React 19 instead of carrying a direct `@swc/react-compiler` package or commented manual chain plugin code.

**Tech Stack:** EMP workspace, `corepack pnpm@10.33.0`, Rspack 2.1.1 `builtin:swc-loader`, `@empjs/plugin-react`, React 19, Rstest/package smoke tests.

## Global Constraints

- Use Chinese in status and delivery notes.
- Preserve existing local `apps/demo/package.json` and `pnpm-lock.yaml` user changes, including AntD 6 changes.
- Do not modify `apps/**` beyond the demo files needed for this React Compiler cleanup.
- Use `corepack pnpm`; do not use bare `pnpm`.
- Prefer real plugin/package tests over isolated helper-only assertions.
- Do not commit or push unless the user explicitly asks in this turn.

---

### Task 1: Align `@empjs/plugin-react` with current React Compiler boolean API

**Files:**
- Modify: `packages/plugin-react/src/index.ts`
- Modify: `packages/plugin-react/src/types.ts`
- Modify: `packages/plugin-react/test/react-refresh-plugin.test.mjs`

**Interfaces:**
- Consumes: `PluginReactType.reactCompiler`
- Produces: `pluginReact({ reactCompiler: true })` writes `jsc.transform.reactCompiler === true` to every SWC rule.

- [x] **Step 1: Write the failing test**

Update `packages/plugin-react/test/react-refresh-plugin.test.mjs` so it verifies both the boolean API and object API:

```js
assert.ok(
  swcUses.every(use => use.options.jsc.transform.reactCompiler === true),
  'expected plugin-react to apply boolean reactCompiler to every SWC rule',
)
```

- [x] **Step 2: Run test to verify it fails**

Run: `corepack pnpm --filter @empjs/chain run build && corepack pnpm --filter @empjs/plugin-react run build && node packages/plugin-react/test/react-refresh-plugin.test.mjs`

Expected: FAIL because `reactCompiler: true` currently becomes an empty object spread and is not written into SWC transform options.

- [x] **Step 3: Implement boolean pass-through**

Update `packages/plugin-react/src/index.ts` so `reactCompiler` accepts `true` and object options:

```ts
const transform = {
  react: {
    runtime: reactRuntime,
    development: store.isDev,
    refresh: store.isDev && o.hmr,
  },
  ...(o.reactCompiler !== undefined ? {reactCompiler: o.reactCompiler} : {}),
}
```

Update `packages/plugin-react/src/types.ts` so `ReactCompilerOptions` includes the current Rspack/Rsbuild option shape and `PluginReactType.reactCompiler` can be `boolean | ReactCompilerOptions`.

- [x] **Step 4: Run test to verify it passes**

Run: `corepack pnpm --filter @empjs/plugin-react test`

Expected: PASS.

### Task 2: Enable demo through plugin and remove direct compiler dependency

**Files:**
- Modify: `apps/demo/emp.config.ts`
- Modify: `apps/demo/package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes: `pluginReact({ reactCompiler: true })`
- Produces: demo React Compiler is enabled through plugin-react, with no direct `@swc/react-compiler` dependency in `apps/demo`.

- [x] **Step 1: Write the failing dependency/config checks**

Before removal, run:

```bash
rg -n "@swc/react-compiler|swc-react-compiler|pluginReact\\(\\)" apps/demo/emp.config.ts apps/demo/package.json pnpm-lock.yaml
```

Expected: FAIL for the desired final state because direct dependency and old commented manual plugin references are still present.

- [x] **Step 2: Update demo config**

Replace `pluginReact()` with:

```ts
pluginReact({
  reactCompiler: true,
}),
```

Remove the commented `@swc/react-compiler` manual chain plugin block.

- [x] **Step 3: Remove dependency and refresh lockfile**

Run: `corepack pnpm --filter demo remove @swc/react-compiler`

Expected: `apps/demo/package.json` no longer lists `@swc/react-compiler`, and `pnpm-lock.yaml` no longer contains `@swc/react-compiler` packages.

- [x] **Step 4: Verify final grep**

Run: `rg -n "@swc/react-compiler|swc-react-compiler" apps/demo pnpm-lock.yaml`

Expected: no matches.

### Task 3: Validate demo and package integration

**Files:**
- Validate only; no new files.

**Interfaces:**
- Consumes: updated plugin-react and demo package state.
- Produces: evidence that the plugin and demo still build under the current workspace.

- [x] **Step 1: Run plugin package test**

Run: `corepack pnpm --filter @empjs/plugin-react test`

Expected: PASS.

- [x] **Step 2: Run demo build**

Run: `corepack pnpm --filter demo build`

Expected: PASS.

- [x] **Step 3: Run targeted root checks**

Run: `corepack pnpm test:packages && git diff --check`

Expected: PASS.

- [x] **Step 4: Report remaining dirty files**

Run: `git status --short --branch`

Expected: show only intended current-task changes plus pre-existing unrelated local edits, with no staged files unless the user asks to commit.

### Task 4: Validate React Compiler output effectiveness

**Files:**
- Create: `packages/plugin-react/test/react-compiler-output.test.mjs`
- Modify: `packages/plugin-react/package.json`

**Interfaces:**
- Consumes: `pluginReact({ reactCompiler: true })`
- Produces: a real Rspack bundle that imports `react/compiler-runtime` and calls the React Compiler cache helper.

- [x] **Step 1: Write the real Rspack output test**

Create `packages/plugin-react/test/react-compiler-output.test.mjs` that compiles the same React component twice:

```js
const disabledBundle = await compileWithReactPlugin({})
assert.equal(disabledBundle.includes('react/compiler-runtime'), false)

const enabledBundle = await compileWithReactPlugin({reactCompiler: true})
assert.ok(enabledBundle.includes('react/compiler-runtime'))
assert.ok(/react_compiler_runtime[\s\S]*\.c\)\(\d+\)/.test(enabledBundle))
```

- [x] **Step 2: Run the test and confirm the first assertion form catches the wrong output marker**

Run: `corepack pnpm --filter @empjs/chain run build && corepack pnpm --filter @empjs/plugin-react run build && node packages/plugin-react/test/react-compiler-output.test.mjs`

Observed: the first version failed on a brittle `_c(` assertion while the bundle contained `(0,react_compiler_runtime__rspack_import_1.c)(2)`.

- [x] **Step 3: Use the stable bundled output marker**

Update the assertion to check `react/compiler-runtime` plus `/react_compiler_runtime[\s\S]*\.c\)\(\d+\)/`.

- [x] **Step 4: Wire the output test into package test**

Update `packages/plugin-react/package.json` so `pnpm run test` executes `react-compiler-output.test.mjs` after the config and type tests.

### Task 5: Measure runtime work reduction with React Compiler on/off

**Files:**
- Create: `packages/plugin-react/test/react-compiler-performance.test.mjs`
- Modify: `packages/plugin-react/package.json`

**Interfaces:**
- Consumes: `pluginReact({ reactCompiler: true })`
- Produces: a real Rspack-built benchmark that runs the same component with React Compiler disabled and enabled, then reports deterministic JSX runtime call reduction.

- [x] **Step 1: Add a real A/B benchmark test**

Create `packages/plugin-react/test/react-compiler-performance.test.mjs` that builds the same TSX entry twice with real Rspack:

```js
const disabled = await compileAndBenchmark({})
const enabled = await compileAndBenchmark({reactCompiler: true})
```

The benchmark repeatedly invokes the compiled component with stable props. Disabled output creates JSX elements on every render; enabled output uses the React Compiler memo cache runtime and reuses the stable JSX result.

- [x] **Step 2: Assert deterministic improvement**

Assert that disabled output performs two JSX runtime calls per iteration and enabled output performs at most two JSX runtime calls across the same iterations:

```js
assert.equal(disabled.benchmark.jsxCalls, iterations * 2)
assert.ok(enabled.benchmark.jsxCalls <= 2)
assert.ok(jsxCallReductionPercent >= 99)
```

- [x] **Step 3: Report the measured numbers**

Print the benchmark payload from the test so CI/local logs show the before/after JSX runtime call counts, avoided JSX calls, JSX call reduction percent, and observed elapsed time.

- [x] **Step 4: Wire the benchmark into package test**

Update `packages/plugin-react/package.json` so `pnpm run test` executes `react-compiler-performance.test.mjs` after the output marker test.
