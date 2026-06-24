# Rslib Config Conventions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 收敛 EMP v4 中 Node ESM rslib 包配置，减少插件、CLI、chain 包的重复配置，并用脚本约束后续新增包遵循同一约定。

**Architecture:** 在根 `scripts/` 下新增一个 rslib preset 工厂，包级 `rslib.config.ts` 只声明 entry、syntax、define、externals 等差异。新增一个约定检查脚本，校验已纳入 preset 的包不再复制 `node22Syntax` / `esmShims` 模板，并确保配置入口统一。

**Tech Stack:** Node.js ESM, `@rslib/core`, pnpm workspace, EMP package build scripts, shell verification.

## Global Constraints

- 默认使用中文沟通和交付说明。
- 仓库包管理使用 `pnpm@10.33.0`，遵守根 `packageManager` 与 `engines`。
- 不修改 `projects/**` 示例运行逻辑。
- 不改变发布范围：`packages/**` 是发布包主范围，`projects/**` 和 `website` 不进入自动发布。
- 不改变现有包的 runtime 产物入口、文件名和 package exports。
- 配置重构必须是等价重构；验收以目标包 build、release check、release dry-run 通过为准。

---

### Task 1: Add Rslib Node ESM Preset And Failing Convention Check

**Files:**
- Create: `scripts/rslib-presets.mjs`
- Create: `scripts/check-rslib-presets.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `defineNodeEsmConfig(options)` from `scripts/rslib-presets.mjs`
- Produces: root script `check:rslib-presets`

- [x] **Step 1: Create `scripts/rslib-presets.mjs` with the shared preset**

```js
import {defineConfig} from '@rslib/core'

const defaultNodeSyntax = ['node >= 22.12.0']
const esmShims = {
  __filename: true,
  __dirname: true,
  require: true,
}

export function defineNodeEsmConfig(options = {}) {
  const {
    entry = {index: 'src/index.ts'},
    syntax = defaultNodeSyntax,
    define,
    externals,
  } = options

  return defineConfig(({envMode}) => {
    const isDev = envMode === 'development'
    const source = {
      tsconfigPath: './tsconfig.json',
      entry,
    }

    if (define) {
      source.define = typeof define === 'function' ? define({envMode, isDev}) : define
    }

    const output = {
      target: 'node',
      sourceMap: isDev,
      minify: !isDev,
    }

    if (externals) {
      output.externals = externals
    }

    return {
      lib: [
        {
          id: 'node-esm',
          bundle: true,
          format: 'esm',
          syntax,
          shims: {
            esm: esmShims,
          },
          dts: true,
        },
      ],
      source,
      output,
    }
  })
}
```

- [x] **Step 2: Create `scripts/check-rslib-presets.mjs`**

```js
import {readFileSync} from 'node:fs'

const nodeEsmPackages = [
  'packages/cli/rslib.config.ts',
  'packages/emp-chain/rslib.config.ts',
  'packages/plugin-lightningcss/rslib.config.ts',
  'packages/plugin-postcss/rslib.config.ts',
  'packages/plugin-react/rslib.config.ts',
  'packages/plugin-stylus/rslib.config.ts',
  'packages/plugin-tailwindcss/rslib.config.ts',
  'packages/plugin-tailwindcss2/rslib.config.ts',
  'packages/plugin-tailwindcss3/rslib.config.ts',
  'packages/plugin-vue2/rslib.config.ts',
  'packages/plugin-vue3/rslib.config.ts',
]

let failed = false

for (const file of nodeEsmPackages) {
  const content = readFileSync(file, 'utf8')
  if (!content.includes("from '../../scripts/rslib-presets.mjs'")) {
    console.error(`${file}: missing shared rslib preset import`)
    failed = true
  }
  for (const duplicate of ['node22Syntax', 'nodeSyntax', 'esmShims']) {
    if (content.includes(`const ${duplicate}`)) {
      console.error(`${file}: duplicate ${duplicate} should live in scripts/rslib-presets.mjs`)
      failed = true
    }
  }
}

if (failed) {
  process.exit(1)
}

console.log(`rslib preset check passed for ${nodeEsmPackages.length} packages`)
```

- [x] **Step 3: Add root script**

In `package.json` scripts add:

```json
"check:rslib-presets": "node scripts/check-rslib-presets.mjs"
```

- [x] **Step 4: Run the convention check and confirm it fails before package configs are migrated**

Run: `pnpm check:rslib-presets`

Expected: FAIL with messages such as:

```text
packages/cli/rslib.config.ts: missing shared rslib preset import
```

### Task 2: Migrate Node ESM Rslib Configs To The Preset

**Files:**
- Modify: `packages/cli/rslib.config.ts`
- Modify: `packages/emp-chain/rslib.config.ts`
- Modify: `packages/plugin-lightningcss/rslib.config.ts`
- Modify: `packages/plugin-postcss/rslib.config.ts`
- Modify: `packages/plugin-react/rslib.config.ts`
- Modify: `packages/plugin-stylus/rslib.config.ts`
- Modify: `packages/plugin-tailwindcss/rslib.config.ts`
- Modify: `packages/plugin-tailwindcss2/rslib.config.ts`
- Modify: `packages/plugin-tailwindcss3/rslib.config.ts`
- Modify: `packages/plugin-vue2/rslib.config.ts`
- Modify: `packages/plugin-vue3/rslib.config.ts`

**Interfaces:**
- Consumes: `defineNodeEsmConfig(options)` from Task 1
- Produces: equivalent rslib configs with package-specific entries and externals

- [x] **Step 1: Replace default plugin configs**

Use this form for packages whose only entry is `src/index.ts`:

```ts
import {defineNodeEsmConfig} from '../../scripts/rslib-presets.mjs'

export default defineNodeEsmConfig()
```

Apply to:
- `packages/plugin-react/rslib.config.ts`
- `packages/plugin-stylus/rslib.config.ts`
- `packages/plugin-tailwindcss2/rslib.config.ts`
- `packages/plugin-tailwindcss3/rslib.config.ts`
- `packages/plugin-vue2/rslib.config.ts`
- `packages/plugin-vue3/rslib.config.ts`

- [x] **Step 2: Replace plugin configs with extra entries**

Use exact entry maps:

```ts
import {defineNodeEsmConfig} from '../../scripts/rslib-presets.mjs'

export default defineNodeEsmConfig({
  entry: {
    index: 'src/index.ts',
    tailwindcss: 'src/tailwindcss.ts',
  },
})
```

For `packages/plugin-tailwindcss/rslib.config.ts`.

```ts
import {defineNodeEsmConfig} from '../../scripts/rslib-presets.mjs'

export default defineNodeEsmConfig({
  entry: {
    index: 'src/index.ts',
    pxtovw: 'src/pxtovw.ts',
  },
})
```

For `packages/plugin-postcss/rslib.config.ts`.

```ts
import {defineNodeEsmConfig} from '../../scripts/rslib-presets.mjs'

export default defineNodeEsmConfig({
  entry: {
    index: 'src/index.ts',
    loader: 'src/loader.ts',
  },
})
```

For `packages/plugin-lightningcss/rslib.config.ts`.

- [x] **Step 3: Replace special Node configs**

Use exact special options:

```ts
import {defineNodeEsmConfig} from '../../scripts/rslib-presets.mjs'

export default defineNodeEsmConfig({
  syntax: ['node >= 20.19.0'],
  define: ({isDev}) => ({
    'process.env.ENV': JSON.stringify(isDev ? 'dev' : 'prod'),
  }),
  externals: {
    '@rsdoctor/rspack-plugin': 'commonjs @rsdoctor/rspack-plugin',
  },
})
```

For `packages/cli/rslib.config.ts`.

```ts
import {defineNodeEsmConfig} from '../../scripts/rslib-presets.mjs'

export default defineNodeEsmConfig({
  externals: {
    'javascript-stringify': 'commonjs javascript-stringify',
  },
})
```

For `packages/emp-chain/rslib.config.ts`.

- [x] **Step 4: Run the convention check and confirm it passes**

Run: `pnpm check:rslib-presets`

Expected:

```text
rslib preset check passed for 11 packages
```

### Task 3: Build Verification And Release Guardrails

**Files:**
- No source files expected beyond Tasks 1 and 2

**Interfaces:**
- Consumes: root scripts and package build scripts
- Produces: verified equivalent build behavior

- [x] **Step 1: Run targeted Node package builds**

Run:

```bash
pnpm --filter @empjs/cli --filter @empjs/chain --filter '@empjs/plugin-*' build
```

Expected: all selected package builds exit `0`.

- [x] **Step 2: Run targeted existing tests**

Run:

```bash
pnpm --filter @empjs/cli test
pnpm --filter @empjs/plugin-react test
```

Expected: both commands exit `0`.

- [x] **Step 3: Run release checks**

Run:

```bash
pnpm release:check
pnpm release:publish:dry -- --skip-build
```

Expected:
- `release:check` reports the internal package set without including `projects/**` or `website`.
- `release:publish:dry` uses `--dry-run` and does not publish packages.

- [x] **Step 4: Run formatting and diff safety checks**

Run:

```bash
git diff --check
git status --short --branch
```

Expected:
- `git diff --check` exits `0`.
- `git status` only shows files touched by this plan.

## Self-Review

- Spec coverage: The plan covers shared rslib preset, package migration, convention enforcement, and release/build verification.
- Placeholder scan: No `TBD`, `TODO`, or unresolved implementation placeholders are present.
- Type consistency: `defineNodeEsmConfig(options)` is used consistently by all migrated configs; special options are `entry`, `syntax`, `define`, and `externals`.
