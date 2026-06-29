# Package Scripts Organization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 整理根 `package.json` 的 `scripts` 顺序，让入口脚本、构建脚本、示例脚本、测试脚本、工具脚本和发布脚本分组清晰，并用规则测试固定顺序。

**Architecture:** 不改变任何 script 的命令内容，只调整 `scripts` 对象 key 顺序。把顺序约束放进现有 `scripts/toolchain.rules.test.ts`，由根脚本 `test:toolchain` 和 `ci:verify` 复用。

**Tech Stack:** `package.json`、Rstest、Node JSON manifest 读取、`corepack pnpm`。

## Global Constraints

- 默认使用中文沟通，最终说明真实验证结果和未覆盖边界。
- 只修改根 `package.json`、`scripts/toolchain.rules.test.ts` 和本计划文件。
- 保留当前工作区已有未提交改动，不覆盖 `README.md`、`packages/plugin-tailwindcss/**`、`pnpm-lock.yaml`、`scripts/apps.acceptance.test.ts`。
- `pnpm-lock.yaml` 不因本次整理改动。
- 不修改 script 命令语义，不新增发布权限、npm publish token 或 release workflow。
- 验证至少运行 `corepack pnpm test:toolchain`、`corepack pnpm workflow:check`、`git diff --check -- package.json scripts/toolchain.rules.test.ts .superpowers/plans/2026-06-29-package-scripts-organization.md`。

---

### Task 1: 固定并应用根 scripts 分组顺序

**Files:**
- Modify: `scripts/toolchain.rules.test.ts`
- Modify: `package.json`
- Create: `.superpowers/plans/2026-06-29-package-scripts-organization.md`

**Interfaces:**
- Consumes: 根 `package.json` 的 `scripts` 对象。
- Produces: `toolchain.rules.test.ts` 中的 `root scripts are grouped by workflow area` 规则，以及重排后的根 `scripts` 顺序。

- [x] **Step 1: 写失败规则测试**

在 `scripts/toolchain.rules.test.ts` 的 `describe('toolchain version contract', () => {` 内新增测试：

```ts
  test('root scripts are grouped by workflow area', () => {
    const pkg = readJson('package.json')
    expect(Object.keys(pkg.scripts)).toEqual([
      'emp',
      'emp:build',
      'emp:prod',
      'empbuild',
      'empbuild:lib',
      'empbuild:plugin',
      'empbuild:bridge',
      'empbuild:cdn',
      'offical:dev',
      'offical:build',
      'offical:start',
      'adapter',
      'adapter:build',
      'adapter:deploy',
      'adapter:start',
      'mf',
      'mf:prod',
      'vue',
      'vue:prod',
      'vue2',
      'vue2:prod',
      'cloudflare:mf-cjs',
      'cloudflare:mf-react',
      'cloudflare:mf-vue2',
      'cloudflare:mf-vue3',
      'cloudflare:react-19-tanstack',
      'test:cli',
      'test:real:cli',
      'test:packages',
      'test:toolchain',
      'test:tsconfig',
      'test:ts7:prepare',
      'test:ts7',
      'test:ts7:packages',
      'test:tsgo',
      'test:rules',
      'test:apps:single',
      'test:apps:mf',
      'test:library-output',
      'workflow:check',
      'ci:verify',
      'apps:list',
      'apps:check',
      'apps:acceptance',
      'apps:bench',
      'static:list',
      'static:doctor',
      'static:start',
      'static:env',
      'cdn:serve',
      'lint',
      'check:rslib-presets',
      'release:check',
      'release:version',
      'release:changelog',
      'release:pack',
      'release:publish:dry',
      'release:publish',
      'agent:finish',
    ])
  })
```

- [x] **Step 2: 运行测试确认失败**

Run: `corepack pnpm test:toolchain`

Expected: FAIL，失败点是 `root scripts are grouped by workflow area` 中 `Object.keys(pkg.scripts)` 顺序与期望不一致。

- [x] **Step 3: 重排 package.json scripts**

只移动 `package.json` 的 `scripts` key 顺序，命令字符串保持现值不变。目标顺序为测试中的数组。

- [x] **Step 4: 运行相关验证确认通过**

Run:

```bash
corepack pnpm test:toolchain
corepack pnpm workflow:check
git diff --check -- package.json scripts/toolchain.rules.test.ts .superpowers/plans/2026-06-29-package-scripts-organization.md
```

Expected: 三条命令均 exit 0。

- [x] **Step 5: 复核 diff 边界**

Run:

```bash
git diff -- package.json scripts/toolchain.rules.test.ts .superpowers/plans/2026-06-29-package-scripts-organization.md
git status --short --branch
```

Expected: 本任务只新增计划文件、修改 `package.json` 和 `scripts/toolchain.rules.test.ts`；其他已有未提交改动保持原样。
