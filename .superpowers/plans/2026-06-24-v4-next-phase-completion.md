# EMP v4 Next Phase Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the executable next-phase items from `docs/v4-progress-roadmap.html`: verify the existing Tailwind v4 local update, implement `empRuntime.version` isolation in `@empjs/share`, re-verify the `rtProvider` DTS path, run release dry-run gates, and update the HTML status.

**Architecture:** Treat the existing Tailwind 4.3.1 package changes as user-owned input and only verify them. Implement `empRuntime.version` inside `EmpShare` by deriving one effective package-version name and reusing it for Module Federation `name`, Rspack `output.uniqueName`, and late CSS Modules generator overrides. Keep release and DTS work as verification/documentation gates unless a command proves a real defect.

**Tech Stack:** TypeScript, Node.js `^20.19.0 || >=22.12.0`, pnpm `10.33.0`, Rspack 2, Module Federation 2.x, Node `node:test`, self-contained HTML.

## Global Constraints

- Default communication and documentation are Chinese where user-facing.
- Superpowers work products stay under `.superpowers/`; do not create `docs/superpowers/`.
- Preserve existing uncommitted Tailwind changes in `packages/plugin-tailwindcss/package.json`, `projects/react-19-tanstack/package.json`, `projects/react-tanstack/package.json`, and `pnpm-lock.yaml`.
- Preserve `docs/v4-progress-roadmap.html`; update it only to reflect verified current state.
- Do not modify `@empjs/plugin-tailwindcss2`, `@empjs/plugin-tailwindcss3`, Tailwind 2/3 demos, `website`, `@empjs/cdn-*`, or `@empjs/lib-*`.
- `empRuntime.version !== true` must keep current behavior.
- `empRuntime.version === true` derives the isolation name from `store.pkg.name` and `store.pkg.version` with `` `${pkg.name}_${pkg.version}`.replace(/@/g, '').replace(/[^\w_]/g, '_') ``.
- If `store.pkg.name` or `store.pkg.version` is missing, fall back to the legacy name behavior without throwing.
- Do not add a public `shareName` option, do not accept handwritten version strings, and keep `filename: 'emp.js'`.
- Do not change `EMPShareGlobalVal`, `runtimeGlobal`, `frameworkGlobal`, or `shareLib` behavior.
- Do not run a real npm publish; only dry-run release commands are allowed.

---

## File Structure

- Modify: `packages/emp-share/src/plugins/rspack/types.ts`
  - Add the public `empRuntime.version?: boolean` type.
- Modify: `packages/emp-share/src/plugins/rspack/share.ts`
  - Add versioned-name derivation, reuse it in `setMfName()`, and override CSS Modules generator only when needed.
- Create: `packages/emp-share/test/version-isolation.test.mjs`
  - Regression coverage for legacy name behavior, versioned MF name, `output.uniqueName`, CSS generator override, fallback when package metadata is missing, and user `css.prifixName` preservation.
- Modify: `packages/emp-share/package.json`
  - Add the new regression test to the `test` script.
- Modify: `packages/emp-share/README.md`
  - Document `empRuntime.version: true`, scope, and direct-consumer note.
- Modify: `docs/v4-progress-roadmap.html`
  - Update status from "建议" to verified current state after implementation and gates pass.

---

### Task 1: Verify Existing Tailwind v4 Local Update

**Files:**
- Review only: `packages/plugin-tailwindcss/package.json`
- Review only: `projects/react-19-tanstack/package.json`
- Review only: `projects/react-tanstack/package.json`
- Review only: `pnpm-lock.yaml`
- Review only: `.superpowers/plans/2026-06-24-tailwind-latest-update.md`

**Interfaces:**
- Consumes: Existing local dependency specs for Tailwind `4.3.1` and `@tailwindcss/postcss` `4.3.1`.
- Produces: Fresh verification evidence that the existing local Tailwind changes resolve and build.

- [x] **Step 1: Verify resolved Tailwind package versions**

Run:

```bash
pnpm --filter @empjs/plugin-tailwindcss list tailwindcss @tailwindcss/postcss --depth 0
pnpm --filter ./projects/react-19-tanstack list tailwindcss --depth 0
pnpm --filter ./projects/react-tanstack list tailwindcss --depth 0
```

Expected: all three commands exit 0 and show `tailwindcss@4.3.1`; the plugin package also shows `@tailwindcss/postcss@4.3.1`.

- [x] **Step 2: Build the updated Tailwind plugin**

Run:

```bash
pnpm --filter @empjs/plugin-tailwindcss build
```

Expected: exit 0.

- [x] **Step 3: Build the affected Tailwind v4 examples**

Run:

```bash
pnpm --filter ./projects/tailwind-4 build
pnpm --filter ./projects/tailwind-4-polyfill build
pnpm --filter ./projects/daisyui-demo build
pnpm --filter ./projects/tailwindcss-host build
pnpm --filter ./projects/tailwindcss-app build
pnpm --filter ./projects/react-19-tanstack build
pnpm --filter ./projects/react-tanstack build
```

Expected: each command exits 0. If generated route or dist artifacts appear in `git status`, inspect and keep only the planned package/lockfile changes.

- [x] **Step 4: Confirm diff scope**

Run:

```bash
git diff -- packages/plugin-tailwindcss/package.json projects/react-19-tanstack/package.json projects/react-tanstack/package.json pnpm-lock.yaml .superpowers/plans/2026-06-24-tailwind-latest-update.md
git status --short -- projects/tailwind-4 projects/tailwind-4-polyfill projects/daisyui-demo projects/tailwindcss-host projects/tailwindcss-app projects/react-19-tanstack projects/react-tanstack
```

Expected: diff contains only the existing Tailwind version and lockfile changes; status shows no source changes from example builds beyond the existing TanStack package manifests.

---

### Task 2: Add Failing `empRuntime.version` Regression Tests

**Files:**
- Create: `packages/emp-share/test/version-isolation.test.mjs`
- Modify: `packages/emp-share/package.json`
- Build before RED: `packages/emp-share/dist/rspack.js`

**Interfaces:**
- Consumes: `pluginRspackEmpShare(options).rsConfig(store)` from `packages/emp-share/dist/rspack.js`.
- Produces: Tests that fail against current legacy behavior because versioned naming and CSS generator override do not exist yet.

- [x] **Step 1: Create the regression test file**

Create `packages/emp-share/test/version-isolation.test.mjs` with:

```js
import assert from 'node:assert/strict'
import {pluginRspackEmpShare} from '../dist/rspack.js'

function deepAssign(target, ...sources) {
  for (const source of sources) {
    for (const key in source) {
      const sourceValue = source[key]
      const targetValue = target[key]
      if (Object(sourceValue) === sourceValue && Object(targetValue) === targetValue) {
        target[key] = deepAssign(targetValue, sourceValue)
        continue
      }
      target[key] = sourceValue
    }
  }
  return target
}

function createStore(overrides = {}) {
  const registeredPlugins = []
  const outputSets = []
  const merges = []

  const store = {
    chain: {
      merge(value) {
        merges.push(value)
      },
      output: {
        set(key, value) {
          outputSets.push([key, value])
        },
      },
      plugin(name) {
        return {
          use(Plugin, args) {
            registeredPlugins.push({name, Plugin, args})
          },
        }
      },
    },
    deepAssign,
    empConfig: {
      css: {},
      output: {
        uniqueName: 'legacy_unique_name',
      },
    },
    encodeVarName(value) {
      return value.replace(/@/g, '').replace(/[^\w_]/g, '_')
    },
    injectTags() {},
    isDev: false,
    mode: 'production',
    pkg: {
      name: '@nova/bigolive-common',
      version: '3.88.0',
    },
    ...overrides,
  }

  return {store, registeredPlugins, outputSets, merges}
}

async function runSharePlugin(options, storeOverrides) {
  const ctx = createStore(storeOverrides)
  await pluginRspackEmpShare(options).rsConfig(ctx.store)
  const mfPlugin = ctx.registeredPlugins.find(plugin => plugin.name === 'plugin-emp-share')
  assert.ok(mfPlugin, 'expected ModuleFederationPlugin to be registered')
  const [mfOptions] = mfPlugin.args
  return {...ctx, mfOptions}
}

{
  const {mfOptions, outputSets, merges} = await runSharePlugin({
    name: 'legacy-share',
    empRuntime: {
      runtime: {
        lib: 'http://localhost:2100/sdk.js',
      },
    },
  })

  assert.equal(mfOptions.name, 'legacy_share')
  assert.equal(mfOptions.filename, 'emp.js')
  assert.deepEqual(outputSets, [['uniqueName', 'legacy_share']])
  assert.equal(merges.find(value => value.module?.generator?.['css/module']?.localIdentName), undefined)
}

{
  const {mfOptions, outputSets, merges} = await runSharePlugin({
    name: 'legacy-share',
    empRuntime: {
      version: true,
      runtime: {
        lib: 'http://localhost:2100/sdk.js',
      },
    },
  })

  assert.equal(mfOptions.name, 'nova_bigolive_common_3_88_0')
  assert.equal(mfOptions.filename, 'emp.js')
  assert.deepEqual(outputSets, [['uniqueName', 'nova_bigolive_common_3_88_0']])
  assert.equal(
    merges.find(value => value.module?.generator?.['css/module']?.localIdentName)?.module.generator['css/module']
      .localIdentName,
    'nova_bigolive_common_3_88_0-[local]-[hash:5]',
  )
  assert.equal(
    merges.find(value => value.module?.generator?.['css/auto']?.localIdentName)?.module.generator['css/auto']
      .localIdentName,
    'nova_bigolive_common_3_88_0-[local]-[hash:5]',
  )
}

{
  const {mfOptions, outputSets, merges} = await runSharePlugin(
    {
      name: 'legacy-share',
      empRuntime: {
        version: true,
        runtime: {
          lib: 'http://localhost:2100/sdk.js',
        },
      },
    },
    {isDev: true},
  )

  assert.equal(mfOptions.name, 'nova_bigolive_common_3_88_0')
  assert.deepEqual(outputSets, [['uniqueName', 'nova_bigolive_common_3_88_0']])
  assert.equal(
    merges.find(value => value.module?.generator?.['css/module']?.localIdentName)?.module.generator['css/module']
      .localIdentName,
    'nova_bigolive_common_3_88_0-[id]-[local]-[hash:base64:8]',
  )
}

{
  const {mfOptions, outputSets, merges} = await runSharePlugin({
    name: 'legacy-share',
    empRuntime: {
      version: false,
      runtime: {
        lib: 'http://localhost:2100/sdk.js',
      },
    },
  })

  assert.equal(mfOptions.name, 'legacy_share')
  assert.equal(mfOptions.filename, 'emp.js')
  assert.deepEqual(outputSets, [['uniqueName', 'legacy_share']])
  assert.equal(merges.find(value => value.module?.generator?.['css/module']?.localIdentName), undefined)
}

{
  const {mfOptions, outputSets, merges} = await runSharePlugin(
    {
      name: 'legacy-share',
      empRuntime: {
        version: true,
        runtime: {
          lib: 'http://localhost:2100/sdk.js',
        },
      },
    },
    {
      empConfig: {
        css: {
          prifixName: 'custom_css',
        },
        output: {
          uniqueName: 'legacy_unique_name',
        },
      },
    },
  )

  assert.equal(mfOptions.name, 'nova_bigolive_common_3_88_0')
  assert.deepEqual(outputSets, [['uniqueName', 'nova_bigolive_common_3_88_0']])
  assert.equal(merges.find(value => value.module?.generator?.['css/module']?.localIdentName), undefined)
}

{
  const {mfOptions, outputSets, merges} = await runSharePlugin(
    {
      name: 'legacy-share',
      empRuntime: {
        version: true,
        runtime: {
          lib: 'http://localhost:2100/sdk.js',
        },
      },
    },
    {
      pkg: {
        name: '@nova/bigolive-common',
      },
    },
  )

  assert.equal(mfOptions.name, 'legacy_share')
  assert.deepEqual(outputSets, [['uniqueName', 'legacy_share']])
  assert.equal(merges.find(value => value.module?.generator?.['css/module']?.localIdentName), undefined)
}
```

- [x] **Step 2: Add the test to the package script**

In `packages/emp-share/package.json`, change the `test` script to:

```json
"test": "node test/module-federation-deps.test.mjs && node test/dts-runtime-pkgs.test.mjs && node test/version-isolation.test.mjs && node test/esm-only-publish.test.mjs"
```

- [x] **Step 3: Build current package output for RED**

Run:

```bash
pnpm --filter @empjs/share build
```

Expected: exit 0.

- [x] **Step 4: Run the new test and verify RED**

Run:

```bash
node packages/emp-share/test/version-isolation.test.mjs
```

Expected: FAIL because `mfOptions.name` for `empRuntime.version: true` is still `legacy_share` instead of `nova_bigolive_common_3_88_0`.

---

### Task 3: Implement Versioned MF Name and CSS Modules Isolation

**Files:**
- Modify: `packages/emp-share/src/plugins/rspack/types.ts`
- Modify: `packages/emp-share/src/plugins/rspack/share.ts`
- Test: `packages/emp-share/test/version-isolation.test.mjs`

**Interfaces:**
- Consumes: `store.pkg.name`, `store.pkg.version`, `store.empConfig.output.uniqueName`, `store.empConfig.css.prifixName`, `store.encodeVarName`, `store.isDev`, `store.chain.merge`, and `store.chain.output.set`.
- Produces: `EMPSHARERuntimeOptions.version?: boolean`, versioned `this.op.name`, synchronized `output.uniqueName`, and late Rspack `module.generator` overrides for `css/auto` and `css/module`.

- [x] **Step 1: Add the public type field**

In `packages/emp-share/src/plugins/rspack/types.ts`, add this field inside `EMPSHARERuntimeOptions` after `shareLib?: ...`:

```ts
  /**
   * Derive Module Federation name and CSS Modules prefix from package name + version.
   */
  version?: boolean
```

- [x] **Step 2: Add versioned name helper types and methods**

In `packages/emp-share/src/plugins/rspack/share.ts`, add this type near `empShareRuntimeTypePkgs`:

```ts
type VersionedShareName = {
  enabled: boolean
  baseName: string
  effectiveName: string
}
```

Then add these methods before `setMfName()`:

```ts
  private getVersionedShareName(): VersionedShareName {
    const baseName = this.op.name ? this.store.encodeVarName(this.op.name) : this.store.empConfig.output.uniqueName
    const pkg = (this.store as GlobalStore & {pkg?: {name?: string; version?: string}}).pkg
    const shouldVersion = this.op.empRuntime?.version === true

    if (!shouldVersion || !pkg?.name || !pkg.version) {
      return {
        enabled: false,
        baseName,
        effectiveName: baseName,
      }
    }

    return {
      enabled: true,
      baseName,
      effectiveName: `${pkg.name}_${pkg.version}`.replace(/@/g, '').replace(/[^\w_]/g, '_'),
    }
  }

  private setCssModulesPrefix(name: string) {
    if (this.store.empConfig.css?.prifixName) return

    const localIdentName = this.store.isDev ? `${name}-[id]-[local]-[hash:base64:8]` : `${name}-[local]-[hash:5]`

    this.store.chain.merge({
      module: {
        generator: {
          'css/auto': {
            exportsConvention: 'as-is',
            exportsOnly: false,
            localIdentName,
            esModule: true,
          },
          'css/module': {
            exportsConvention: 'as-is',
            exportsOnly: false,
            localIdentName,
            esModule: true,
          },
        },
      },
    })
  }
```

- [x] **Step 3: Replace `setMfName()`**

Replace the current `setMfName()` with:

```ts
  private setMfName() {
    const name = this.getVersionedShareName()
    this.op.name = name.effectiveName

    if (this.op.name !== this.store.empConfig.output.uniqueName) {
      this.store.chain.output.set('uniqueName', this.op.name)
    }

    if (name.enabled) {
      this.setCssModulesPrefix(name.effectiveName)
    }
  }
```

- [x] **Step 4: Verify GREEN for the new test**

Run:

```bash
pnpm --filter @empjs/share build
node packages/emp-share/test/version-isolation.test.mjs
```

Expected: both commands exit 0.

- [x] **Step 5: Verify package test script**

Run:

```bash
pnpm --filter @empjs/share test
```

Expected: exit 0 and includes `version-isolation.test.mjs` in the script path.

---

### Task 4: Document `empRuntime.version` and Refresh HTML Status

**Files:**
- Modify: `packages/emp-share/README.md`
- Modify: `docs/v4-progress-roadmap.html`

**Interfaces:**
- Consumes: implemented `empRuntime.version: true` behavior from Task 3 and verified Tailwind/DTS facts from Tasks 1 and 5.
- Produces: user-facing documentation that separates completed behavior from remaining release/publish boundaries.

- [x] **Step 1: Add README section after `empRuntime` explanation**

In `packages/emp-share/README.md`, after the paragraph ending with `runtimeGlobal runtime。`, add:

```md
### `empRuntime.version`

`empRuntime.version: true` 会从当前项目 `package.json` 的 `name` 和 `version` 派生共享包实际名称，用于隔离同页多版本共享包：

```ts
pluginRspackEmpShare({
  name: 'bigolive-common',
  empRuntime: {
    version: true,
    runtime: {
      lib: 'http://localhost:2100/sdk.js',
    },
  },
})
```

派生规则为 `` `${pkg.name}_${pkg.version}`.replace(/@/g, '').replace(/[^\w_]/g, '_') ``。启用后插件会把派生值同时用于 Module Federation `name`、Rspack `output.uniqueName`，并在业务未显式配置 `css.prifixName` 时用于 CSS Modules className 前缀。

该能力只接受布尔值，不支持手写版本号；缺少 `package.json` 的 `name` 或 `version` 时会回退到原有 `name` 行为。文件名仍是 `emp.js`，直接用 `scope@url/emp.js` 消费时需要使用派生后的实际 scope。
```

- [x] **Step 2: Update HTML summary and local status**

In `docs/v4-progress-roadmap.html`, update the top lead and status sections so they state:

- Tailwind v4 local update has fresh verification for `4.3.1`.
- `empRuntime.version` has moved from planned to implemented.
- `rtProvider` DTS revalidation now prints `Federated types created correctly`.
- Real npm publish remains out of scope; only dry-run gates were run.

- [x] **Step 3: Run doc checks**

Run:

```bash
node /Users/Bigo/.codex/skills/html-effectiveness-docs/scripts/check-html-links.mjs docs/v4-progress-roadmap.html
git diff --check -- packages/emp-share/README.md docs/v4-progress-roadmap.html
```

Expected: both commands exit 0.

---

### Task 5: Final Verification Gates

**Files:**
- Verify: all files changed by Tasks 1-4.

**Interfaces:**
- Consumes: Tailwind local update, `empRuntime.version` implementation, docs updates, and release automation.
- Produces: final evidence that the HTML next-phase items are complete without real publishing.

- [x] **Step 1: Re-run core `@empjs/share` gates**

Run:

```bash
pnpm --filter @empjs/share build
pnpm --filter @empjs/share test
pnpm --filter @empjs/cli build
```

Expected: all commands exit 0.

- [x] **Step 2: Re-run `rtProvider` DTS gate**

Run:

```bash
pnpm --filter ./projects/rtProvider build
```

Expected: exit 0 and output contains `[ Module Federation DTS ] Federated types created correctly`.

- [x] **Step 3: Run release dry-run gates**

Run:

```bash
pnpm release:check
pnpm release:publish:dry -- --skip-build
```

Expected: `release:check` exits 0; `release:publish:dry -- --skip-build` exits 0, prints dry-run publish commands, excludes `projects/**`, `website`, `@empjs/cdn-*`, and `@empjs/lib-*`, and does not perform a real npm publish.

- [x] **Step 4: Run repository hygiene checks for touched files**

Run:

```bash
git diff --check -- packages/emp-share/src/plugins/rspack/types.ts packages/emp-share/src/plugins/rspack/share.ts packages/emp-share/test/version-isolation.test.mjs packages/emp-share/package.json packages/emp-share/README.md docs/v4-progress-roadmap.html .superpowers/plans/2026-06-24-v4-next-phase-completion.md
git status --short --branch
```

Expected: no whitespace errors; status includes only intended changes plus pre-existing Tailwind local changes and this plan.

## Self-Review

1. Spec coverage: Task 1 covers Tailwind verification; Tasks 2-3 cover `empRuntime.version`; Task 4 covers README/HTML; Task 5 covers DTS and release gates.
2. Placeholder scan: This plan intentionally contains no placeholder tokens, no deferred implementation notes, and no unnamed files.
3. Type consistency: The public type is `EMPSHARERuntimeOptions.version?: boolean`; the implementation helper is `getVersionedShareName()`; CSS override method is `setCssModulesPrefix(name: string)`.
