# EMP Share Version Isolation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `empRuntime.version: true` to `@empjs/share` so package `name + version` isolates the Module Federation container scope and CSS Modules class names.

**Architecture:** Compute one internal `effectiveName` from current project `package.json` when `empRuntime.version === true`. Reuse that name for `ModuleFederationPlugin.name`, Rspack `output.uniqueName`, and CSS Modules `localIdentName` when the user did not explicitly set `css.prifixName`.

**Tech Stack:** TypeScript, Rspack chain config, Module Federation Rspack plugin, Node 22, pnpm 10, existing `node` test scripts in `packages/emp-share/test`.

## Global Constraints

- Public API adds only `empRuntime.version?: boolean`.
- `empRuntime.version !== true` keeps current behavior.
- `empRuntime.version === true` derives the versioned name from `store.pkg.name` and `store.pkg.version`.
- The derived name must match `/Users/Bigo/Desktop/develop/workflow/bigo-nova-core`: `` `${pkg.name}_${pkg.version}`.replace(/@/g, '').replace(/[^\w_]/g, '_') ``.
- Do not add a public `shareName` option.
- Do not support handwritten string versions such as `empRuntime.version: '1.2.3'`.
- Keep `filename: 'emp.js'`.
- Do not change `EMPShareGlobalVal`.
- Do not override user-provided `css.prifixName`.
- CSS isolation covers CSS Modules class generation only; global CSS selectors are out of scope.
- EMP plugins run after the default Rspack module generator, so CSS Modules isolation must override `store.chain.module.generator` directly from the share plugin instead of mutating `store.empConfig.css.prifixName`.

---

## File Structure

- Modify: `packages/emp-share/src/plugins/rspack/types.ts`
  - Owns the public `empRuntime.version?: boolean` type.
- Modify: `packages/emp-share/src/plugins/rspack/share.ts`
  - Owns versioned name normalization, MF name / `output.uniqueName` assignment, and late CSS Modules generator override.
- Create: `packages/emp-share/test/version-isolation.test.mjs`
  - Owns regression tests for legacy behavior, versioned MF name, and CSS Modules prefix override.
- Modify: `packages/emp-share/package.json`
  - Adds the new regression test to the package test script.
- Modify: `packages/emp-share/README.md`
  - Documents `empRuntime.version: true`.

---

### Task 1: Add Failing MF Scope Regression Tests

**Files:**
- Create: `packages/emp-share/test/version-isolation.test.mjs`
- Modify: `packages/emp-share/package.json`

**Interfaces:**
- Consumes: `pluginRspackEmpShare(options).rsConfig(store)` from `packages/emp-share/dist/rspack.js`.
- Produces: tests asserting `ModuleFederationPlugin` receives the expected `name` and `filename`.

- [ ] **Step 1: Create the failing test file**

Create `packages/emp-share/test/version-isolation.test.mjs` with this content:

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
      output: {
        uniqueName: 'legacy_unique_name',
      },
    },
    empOptions: {
      css: {},
    },
    encodeVarName(value) {
      return value.replaceAll('/', '_').replaceAll('@', '_').replaceAll('-', '_')
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
  const cssGeneratorMerge = merges.find(value => value.module?.generator?.['css/module']?.localIdentName)
  assert.equal(cssGeneratorMerge, undefined)
}

{
  const {mfOptions, outputSets} = await runSharePlugin({
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
}

{
  const {mfOptions, outputSets} = await runSharePlugin({
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
}
```

- [ ] **Step 2: Add the test to the package script**

In `packages/emp-share/package.json`, change the `test` script to:

```json
"test": "node test/module-federation-deps.test.mjs && node test/dts-runtime-pkgs.test.mjs && node test/version-isolation.test.mjs && node test/esm-only-publish.test.mjs"
```

- [ ] **Step 3: Build current code and verify the new test fails**

Run:

```bash
pnpm --filter @empjs/share build
node packages/emp-share/test/version-isolation.test.mjs
```

Expected: FAIL on the `version: true` case because `mfOptions.name` is still `legacy_share` instead of `nova_bigolive_common_3_88_0`.

- [ ] **Step 4: Commit the failing regression test**

```bash
git add packages/emp-share/test/version-isolation.test.mjs packages/emp-share/package.json
git commit -m "test: cover emp share version scope isolation"
```

---

### Task 2: Implement Versioned MF Name

**Files:**
- Modify: `packages/emp-share/src/plugins/rspack/types.ts`
- Modify: `packages/emp-share/src/plugins/rspack/share.ts`

**Interfaces:**
- Consumes: `store.pkg.name`, `store.pkg.version`, `store.empConfig.output.uniqueName`, `store.encodeVarName`.
- Produces: `this.op.name` set to legacy encoded name or versioned package name before `setMF()` registers `ModuleFederationPlugin`.

- [ ] **Step 1: Add the public type field**

In `packages/emp-share/src/plugins/rspack/types.ts`, add this property inside `EMPSHARERuntimeOptions`:

```ts
  /**
   * 使用当前项目 package.json 的 name + version 隔离 MF scope。
   * 不传或 false 保持旧行为。
   */
  version?: boolean
```

- [ ] **Step 2: Add version name helpers**

In `packages/emp-share/src/plugins/rspack/share.ts`, add these definitions after `const empShareRuntimeTypePkgs = ['@empjs/share/sdk']`:

```ts
type ShareVersionScope = {
  enabled: boolean
  baseName: string
  effectiveName: string
}

function sanitizeVersionedShareName(value: string) {
  return value.replace(/@/g, '').replace(/[^\w_]/g, '_')
}
```

- [ ] **Step 3: Add the scope calculation method**

In the `EmpShare` class, add this method before `setMfName()`:

```ts
  private getShareVersionScope(): ShareVersionScope {
    const baseName = this.op.name ? this.store.encodeVarName(this.op.name) : this.store.empConfig.output.uniqueName
    const packageName = this.store.pkg?.name
    const packageVersion = this.store.pkg?.version

    if (this.op.empRuntime?.version === true && packageName && packageVersion) {
      const versionedName = sanitizeVersionedShareName(`${packageName}_${packageVersion}`)
      if (versionedName) {
        return {
          enabled: true,
          baseName,
          effectiveName: versionedName,
        }
      }
    }

    return {
      enabled: false,
      baseName,
      effectiveName: baseName,
    }
  }
```

- [ ] **Step 4: Replace `setMfName()`**

Replace the current `setMfName()` with:

```ts
  private setMfName() {
    const scope = this.getShareVersionScope()
    this.op.name = scope.effectiveName
    if (this.op.name !== this.store.empConfig.output.uniqueName) {
      this.store.chain.output.set('uniqueName', this.op.name)
    }
  }
```

- [ ] **Step 5: Build and run the version isolation test**

Run:

```bash
pnpm --filter @empjs/share build
node packages/emp-share/test/version-isolation.test.mjs
```

Expected: PASS for all assertions currently in `version-isolation.test.mjs`.

- [ ] **Step 6: Run existing package tests**

Run:

```bash
pnpm --filter @empjs/share test
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add packages/emp-share/src/plugins/rspack/types.ts packages/emp-share/src/plugins/rspack/share.ts
git commit -m "feat: isolate emp share mf scope by package version"
```

---

### Task 3: Add CSS Modules Prefix Isolation

**Files:**
- Modify: `packages/emp-share/test/version-isolation.test.mjs`
- Modify: `packages/emp-share/src/plugins/rspack/share.ts`

**Interfaces:**
- Consumes: `ShareVersionScope` from Task 2 and `store.empOptions.css?.prifixName`.
- Produces: late Rspack chain merge overriding `module.generator['css/auto'].localIdentName` and `module.generator['css/module'].localIdentName` only when `empRuntime.version === true` and no user CSS prefix exists.

- [ ] **Step 1: Add CSS prefix assertions**

Append these two blocks to `packages/emp-share/test/version-isolation.test.mjs`:

```js
{
  const {merges} = await runSharePlugin({
    name: 'legacy-share',
    empRuntime: {
      version: true,
      runtime: {
        lib: 'http://localhost:2100/sdk.js',
      },
    },
  })

  const cssGeneratorMerge = merges.find(value => value.module?.generator?.['css/module']?.localIdentName)
  assert.ok(cssGeneratorMerge, 'expected versioned CSS Modules generator merge')
  assert.equal(
    cssGeneratorMerge.module.generator['css/module'].localIdentName,
    'nova_bigolive_common_3_88_0-[local]-[hash:5]',
  )
  assert.equal(
    cssGeneratorMerge.module.generator['css/auto'].localIdentName,
    'nova_bigolive_common_3_88_0-[local]-[hash:5]',
  )
}

{
  const {merges} = await runSharePlugin(
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
      empOptions: {
        css: {
          prifixName: 'custom_prefix',
        },
      },
    },
  )

  const cssGeneratorMerge = merges.find(value => value.module?.generator?.['css/module']?.localIdentName)
  assert.equal(cssGeneratorMerge, undefined)
}
```

- [ ] **Step 2: Build current code and verify CSS assertions fail**

Run:

```bash
pnpm --filter @empjs/share build
node packages/emp-share/test/version-isolation.test.mjs
```

Expected: FAIL with `expected versioned CSS Modules generator merge`.

- [ ] **Step 3: Add CSS generator override method**

In `packages/emp-share/src/plugins/rspack/share.ts`, add this method after `getShareVersionScope()`:

```ts
  private setVersionedCssModulePrefix(scope: ShareVersionScope) {
    if (!scope.enabled) return
    if (this.store.empOptions.css?.prifixName) return

    const prifixName = `${scope.effectiveName}-`
    const localIdentName = this.store.isDev
      ? `${prifixName}[id]-[local]-[hash:base64:8]`
      : `${prifixName}[local]-[hash:5]`

    this.store.chain.merge({
      module: {
        generator: {
          'css/auto': {
            localIdentName,
          },
          'css/module': {
            localIdentName,
          },
        },
      },
    })
  }
```

- [ ] **Step 4: Call the CSS override from `setMfName()`**

Update `setMfName()` to:

```ts
  private setMfName() {
    const scope = this.getShareVersionScope()
    this.op.name = scope.effectiveName
    if (this.op.name !== this.store.empConfig.output.uniqueName) {
      this.store.chain.output.set('uniqueName', this.op.name)
    }
    this.setVersionedCssModulePrefix(scope)
  }
```

- [ ] **Step 5: Build and run the version isolation test**

Run:

```bash
pnpm --filter @empjs/share build
node packages/emp-share/test/version-isolation.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Run existing package tests**

Run:

```bash
pnpm --filter @empjs/share test
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add packages/emp-share/src/plugins/rspack/share.ts packages/emp-share/test/version-isolation.test.mjs
git commit -m "feat: isolate emp share css modules by package version"
```

---

### Task 4: Document the New Option and Run Final Verification

**Files:**
- Modify: `packages/emp-share/README.md`

**Interfaces:**
- Consumes: public API `empRuntime.version?: boolean`.
- Produces: reader-facing docs explaining scope name and CSS Modules prefix behavior.

- [ ] **Step 1: Add README section**

Add this section to `packages/emp-share/README.md` near the Rspack plugin usage section:

````md
### Version isolation

Use `empRuntime.version: true` when the same shared package can appear on one page in multiple versions.

```ts
pluginRspackEmpShare({
  name: 'bigoliveCommon',
  empRuntime: {
    version: true,
  },
})
```

When enabled, EMP reads the current project `package.json` and derives a safe share name from `name + version`, for example `@nova/bigolive-common@3.88.0` becomes `nova_bigolive_common_3_88_0`.

The derived name is used for:

- Module Federation `name`, so `emp.js` exposes a versioned container scope.
- Rspack `output.uniqueName`, so runtime globals do not reuse the legacy name.
- CSS Modules class name prefix when `css.prifixName` is not already configured.

This option does not change the `emp.js` filename and does not isolate ordinary global CSS selectors.
````

- [ ] **Step 2: Run package tests**

Run:

```bash
pnpm --filter @empjs/share test
```

Expected: PASS.

- [ ] **Step 3: Run package build**

Run:

```bash
pnpm --filter @empjs/share build
```

Expected: PASS.

- [ ] **Step 4: Run CLI build**

Run:

```bash
pnpm --filter @empjs/cli build
```

Expected: PASS.

- [ ] **Step 5: Inspect git diff scope**

Run:

```bash
git status --short
git diff -- packages/emp-share/src/plugins/rspack/types.ts packages/emp-share/src/plugins/rspack/share.ts packages/emp-share/test/version-isolation.test.mjs packages/emp-share/package.json packages/emp-share/README.md
```

Expected: only the files listed in this task plan have relevant changes for this feature.

- [ ] **Step 6: Commit**

```bash
git add packages/emp-share/src/plugins/rspack/types.ts packages/emp-share/src/plugins/rspack/share.ts packages/emp-share/test/version-isolation.test.mjs packages/emp-share/package.json packages/emp-share/README.md
git commit -m "docs: document emp share version isolation"
```

---

## Self-Review

- Spec coverage: Task 2 covers `empRuntime.version?: boolean`, package-derived MF scope, `output.uniqueName`, legacy fallback, and unchanged `emp.js` filename. Task 3 covers CSS Modules prefix behavior and user prefix preservation. Task 4 covers documentation and final verification.
- Placeholder scan: no placeholder steps are present; every code-changing step includes the exact code or command.
- Type consistency: `ShareVersionScope`, `sanitizeVersionedShareName`, `getShareVersionScope`, and `setVersionedCssModulePrefix` are defined before later tasks reference them.
