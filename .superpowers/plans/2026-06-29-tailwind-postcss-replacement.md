# Tailwind PostCSS Replacement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the default `@empjs/plugin-tailwindcss` Tailwind v4 PostCSS pipeline with the Tailwind webpack/Rspack loader, while keeping PostCSS only as an explicit standalone or legacy capability.

**Architecture:** `@empjs/plugin-tailwindcss` becomes a Tailwind v4 Rspack loader wrapper around `@tailwindcss/webpack`, matching the Rsbuild direction. `@empjs/plugin-postcss`, `@empjs/plugin-tailwindcss2`, and `@empjs/plugin-tailwindcss3` remain the explicit PostCSS/legacy surfaces. Acceptance tests assert both emitted Tailwind CSS and absence of the current `postcss-is-pseudo-class` warning.

**Tech Stack:** TypeScript, EMP plugin API `rsConfig(store)`, `@empjs/chain`, Rspack native CSS rules, `@tailwindcss/webpack@4.3.1`, `rstest`, `corepack pnpm@10.33.0`.

## Global Constraints

- 默认中文沟通，先给结果，再给必要依据。
- 当前工作区是 `/Users/Bigo/Desktop/develop/fontend-workspace/emp`，分支 `v4...origin/v4`。
- 包管理必须使用 `corepack pnpm`，目标版本为 `pnpm@10.33.0`。
- 代码发现优先使用当前 CodeGraph 流程；配置、脚本、文档和字符串搜索可回退 `rg` / 文件读取。
- 不修改 `apps/**` 示例源码，除非是验收测试读取它们的构建产物。
- 不修改 `packages/cdn-*`、`packages/lib-*`、`.github/workflows/publish.yml`。
- 不把 `apps/**` 或 `website` 纳入发布包范围。
- `pnpm-lock.yaml` 只在依赖变化时更新。
- Tailwind v4 默认链路不得再注册 `postcss-loader`、`@tailwindcss/postcss`、`postcss-import`、`postcss-preset-env` 或 `autoprefixer`。
- PostCSS 能力保留在 `@empjs/plugin-postcss`、`@empjs/plugin-tailwindcss2`、`@empjs/plugin-tailwindcss3`，以及用户显式注册的插件中。
- 验收最多循环 5 轮；每轮包含分析、改动、验证和下一轮决策。

---

### Task 1: Add Failing Acceptance For Tailwind Without Default PostCSS

**Files:**
- Modify: `scripts/apps.acceptance.test.ts`

**Interfaces:**
- Consumes: `DEFAULT_APP_ACCEPTANCE` from `scripts/apps.catalog.mjs`.
- Produces: acceptance assertions that later implementation must satisfy.

- [x] **Step 1: Add helpers to inspect emitted CSS and stderr**

Add `readDistCss(appDir: string): string` that reads all `dist/css/*.css` files and joins their content.

Add `assertNoDefaultTailwindPostcssWarning(stderr: string)` that rejects `postcss-is-pseudo-class`, `postcss-loader`, and `@tailwindcss/postcss` warning text for Tailwind v4 apps.

- [x] **Step 2: Strengthen `tailwind-4` assertions**

For `tailwind-4`, assert:

```ts
expect(result.stderr).not.toContain('postcss-is-pseudo-class')
expect(result.stderr).not.toContain('postcss-loader')
const css = readDistCss(appDir)
expect(css).toContain('--tw')
expect(css).toContain('.grid')
expect(css).toContain('.bg-')
```

- [x] **Step 3: Strengthen `react-19-tanstack` assertions**

For `react-19-tanstack`, assert:

```ts
expect(result.stderr).not.toContain('postcss-is-pseudo-class')
expect(result.stderr).not.toContain('postcss-loader')
const css = readDistCss(appDir)
expect(css).toContain('.tailwind-react-contaner')
expect(css).toContain('group-hover')
```

- [x] **Step 4: Verify RED**

Run:

```bash
corepack pnpm test:apps:single -- --runInBand
```

Expected before implementation: the `react-19-tanstack` case fails because current build emits the `postcss-is-pseudo-class` warning from `postcss-loader`.

---

### Task 2: Replace Tailwind v4 Default Pipeline With `@tailwindcss/webpack`

**Files:**
- Modify: `packages/plugin-tailwindcss/src/index.ts`
- Modify: `packages/plugin-tailwindcss/src/types.ts`
- Modify: `packages/plugin-tailwindcss/package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Produces: default export `pluginTailwindcss(options?: TailwindcssOptions)` with Rspack loader behavior.
- Produces: `TailwindcssOptions` with `base?: string`, `optimize?: boolean | { minify?: boolean }`.

- [x] **Step 1: Update dependency surface**

In `packages/plugin-tailwindcss/package.json`, add:

```json
"@tailwindcss/webpack": "4.3.1"
```

Remove:

```json
"@tailwindcss/postcss": "4.3.1",
"autoprefixer": "10.4.22",
"postcss": "8.5.6",
"postcss-import": "^16.1.1",
"postcss-loader": "8.2.0",
"postcss-preset-env": "10.4.0",
"postcss-pxtorem": "^6.1.0"
```

- [x] **Step 2: Update options type**

Replace the PostCSS-shaped type with:

```ts
export type TailwindcssOptimizeOptions = boolean | {
  minify?: boolean
}

export type TailwindcssOptions = {
  base?: string
  optimize?: TailwindcssOptimizeOptions
}
```

- [x] **Step 3: Implement loader wrapper**

In `packages/plugin-tailwindcss/src/index.ts`, use `createRequire(import.meta.url)` and register:

```ts
const rule = chain.module.rule(store.chainName.rule.css)
rule
  .set('type', 'css')
  .use('tailwindcss')
  .loader(require.resolve('@tailwindcss/webpack'))
  .options({
    base: tailwindcssOptions?.base ?? store.root,
    optimize: tailwindcssOptions?.optimize ?? !store.isDev,
  })
```

If `store.root` is not available in current types, use `store.cwd` or `process.cwd()` after checking the current `GlobalStore` shape.

- [x] **Step 4: Update lockfile**

Run:

```bash
corepack pnpm install --lockfile-only
```

- [x] **Step 5: Verify package build**

Run:

```bash
corepack pnpm --filter @empjs/plugin-tailwindcss build
```

Expected: build exits 0.

---

### Task 3: Update Documentation For New Default And PostCSS Boundary

**Files:**
- Modify: `website/docs/zh/plugin/tool/plugin-tailwindcss.mdx`
- Modify: `website/docs/zh/plugin/tool/plugin-postcss.mdx`
- Modify: `website/docs/zh/guide/basis/tailwind.mdx`

**Interfaces:**
- Consumes: implementation behavior from Task 2.
- Produces: reader-facing guidance that PostCSS is explicit, not Tailwind v4 default.

- [x] **Step 1: Tailwind plugin doc**

State that `@empjs/plugin-tailwindcss` uses Tailwind v4's webpack/Rspack loader by default and supports `base` / `optimize`.

- [x] **Step 2: PostCSS plugin doc**

State that `@empjs/plugin-postcss` is for explicit PostCSS transformations such as `autoprefixer`, `pxtorem`, and `pxtovw`, not required for Tailwind v4 default setup.

- [x] **Step 3: Tailwind guide**

Replace the old `postcss.config.cjs` default setup with:

```ts
import pluginTailwindcss from '@empjs/plugin-tailwindcss'

export default defineConfig(() => ({
  plugins: [pluginTailwindcss()],
}))
```

Keep Tailwind 2/3 and custom PostCSS as compatibility notes only.

---

### Task 4: Run Five-Round Verification Loop Or Stop On Complete Replacement

**Files:**
- Read: all changed files
- Read: generated build output under ignored `dist/`

**Interfaces:**
- Consumes: Tasks 1-3.
- Produces: final verification record.

- [x] **Round 1: targeted package and app verification**

Run:

```bash
corepack pnpm --filter @empjs/plugin-tailwindcss build
corepack pnpm --filter tailwind-demo build
corepack pnpm --filter react-19-tanstack build
```

Stop only if any command fails; otherwise continue.

- [x] **Round 2: acceptance verification**

Run:

```bash
corepack pnpm test:apps:single
```

Expected: all default acceptance app tests pass and Tailwind v4 tests show no PostCSS warning.

- [x] **Round 3: dependency boundary verification**

Run:

```bash
node -e "const p=require('./packages/plugin-tailwindcss/package.json'); const d=p.dependencies||{}; for (const name of ['@tailwindcss/postcss','postcss-loader','postcss-import','postcss-preset-env','autoprefixer','postcss-pxtorem']) { if (d[name]) throw new Error(name+' remains in @empjs/plugin-tailwindcss'); } if (!d['@tailwindcss/webpack']) throw new Error('@tailwindcss/webpack missing');"
```

Expected: exits 0.

- [x] **Round 4: repository guard verification**

Run:

```bash
corepack pnpm workflow:check
git diff --check
```

Expected: both exit 0.

- [x] **Round 5: affected-test and risk verification**

Run:

```bash
codegraph affected packages/plugin-tailwindcss/src/index.ts scripts/apps.acceptance.test.ts
```

Use the output to decide whether additional tests are required. If it points at only the already-run app/package checks, stop.

---

## Execution Record

- RED 验证：`corepack pnpm test:apps:single -- --runInBand` 在替换前因 `react-19-tanstack` stderr 命中 `postcss-is-pseudo-class` 失败。
- 定向构建：`corepack pnpm --filter @empjs/plugin-tailwindcss build`、`corepack pnpm --filter tailwind-demo build`、`corepack pnpm --filter react-19-tanstack build` 均通过。
- 验收测试：`corepack pnpm test:apps:single -- --runInBand` 通过，8/8 default apps acceptance 通过。
- 仓库构建：`corepack pnpm empbuild` 通过。
- 工作流检查：`corepack pnpm workflow:check` 通过；`git diff --check` 通过。
- 依赖边界：`packages/plugin-tailwindcss` 仅保留 `@tailwindcss/webpack` 与 `tailwindcss`，不再依赖 Tailwind 默认 PostCSS 链路。
- 继续阶段：`corepack pnpm ci:verify` 通过；PostCSS 剩余面确认只在 `@empjs/plugin-postcss`、`@empjs/plugin-tailwindcss2`、`@empjs/plugin-tailwindcss3` 和 LightningCSS 兼容 visitor 文档中。
- 文档收口：补充 PostCSS 支持矩阵，明确 Tailwind v4 默认由 `@tailwindcss/webpack` 接入，`@empjs/plugin-lightningcss` 是前缀、压缩、现代 CSS 转换和部分 px 转换的优先替代路径。
