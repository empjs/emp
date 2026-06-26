# Rspack 2.1 Beta 发布实施计划

> Superseded by `.superpowers/plans/2026-06-26-rspack-2-1-ts7-unified-tsconfig.md`.
> 用户已明确要求 Rspack 2.1 与 TS7 同步更新，并统一最小化 tsconfig 体系；后续执行以新计划为准。

> **给执行 Agent：** 必须使用子技能 `superpowers:subagent-driven-development`（推荐）或 `superpowers:executing-plans`，按任务逐项执行本计划。步骤使用 checkbox（`- [ ]`）语法，执行时需要持续更新状态。

**Goal：** 将 EMP v4 从当前锁定的 Rspack 2.0 依赖树升级到 Rspack 2.1.0，并发布新的 EMP beta 版本。

**Architecture：** 升级范围收敛在 EMP 现有 Rspack 集成边界内：`@empjs/cli` 负责 Rspack core/dev-server 依赖与通用配置生成，`@empjs/plugin-react` 负责 React Runtime、React Refresh、SVGR 和 React Compiler 这类 React 专属能力，`@empjs/share` 负责 Module Federation 行为。把 Rspack 2.1 作为一次工具链升级加小范围配置面扩展处理，再通过现有 CLI、packages、apps、Module Federation、release、publish dry-run gate 证明可发布。

**Tech Stack：** Node `^20.19.0 || >=22.12.0`、`corepack pnpm@10.33.0`、Rspack `2.1.0`、Module Federation `2.6.0`、Rslib、Rstest、npm beta dist-tag。

## Global Constraints

- 沟通、进度同步和最终交付默认使用中文。
- 保留当前用户改动；live checkout 当前已有 `docs/v4-progress-roadmap.html` 修改，不纳入本计划改动。
- 计划和执行记录统一放在 `.superpowers/plans/`；不要创建或继续使用 `docs/superpowers/`。
- 跨文件代码发现先使用 CodeGraph：执行 `codegraph sync .`，再执行 `codegraph status .`。
- 统一使用 `corepack pnpm ...`；当前 checkout 的裸 `pnpm` 是 `11.7.0`，会触发仓库 `pnpm 10.x` engine guard。
- 发布范围限定为 `corepack pnpm release:check` 报告的 19 个内部 `@empjs/*` 包；不得发布 `apps/**`、`website`、`@empjs/cdn-*`、`@empjs/lib-*`。
- `@rspack/plugin-react-refresh` 保持在 `2.0.2`，除非 npm 发布了新的兼容版本；当前 npm 没有 `@rspack/plugin-react-refresh@2.1.0`。
- Rspack release 来源：https://github.com/web-infra-dev/rspack/releases/tag/v2.1.0。
- 当前 npm 源检查结果：`@rspack/core@2.1.0`、`@rspack/cli@2.1.0`、`@rspack/dev-server@2.1.0`、`@rspack/binding@2.1.0`、`@module-federation/rspack@2.6.0`、`@empjs/cli` beta tag 为 `4.0.0-beta.0`。
- Rspack 2.1 需要覆盖的重点：`@empjs/plugin-react` 基于 `builtin:swc-loader` 支持 React Compiler、生产环境 `pureFunctions` 默认行为、persistent cache 清理参数、`experiments.runtimeMode`、Module Federation manifest/shared 修复。
- 真实 publish 前必须通过：`corepack pnpm workflow:check`、`corepack pnpm ci:verify`、`corepack pnpm empbuild`、`corepack pnpm apps:acceptance`、`corepack pnpm release:publish:dry -- --force-all`、`git diff --check`。

---

## File Structure

- 修改 `packages/cli/package.json`：提高 EMP CLI 直接依赖的 Rspack runtime 版本下限。
- 条件修改 `packages/plugin-react/package.json`：只有 npm 发布了新的兼容 `@rspack/plugin-react-refresh` 时才修改；按当前 registry 状态，此文件保持不变。
- 修改 `pnpm-lock.yaml`：将直接 Rspack 2 依赖线解析到 `@rspack/core@2.1.0`、`@rspack/binding@2.1.0` 和匹配的 dev-server peer graph。
- 修改 `packages/cli/src/types/config.ts`：在现有 `build.rspack` 命名空间下暴露 Rspack 2.1 通用配置入口，例如 `experiments.runtimeMode`。
- 修改 `packages/cli/test/rspack2-features-shape.test.mjs`：锁定 `runtimeMode`、pure-functions pass-through、persistent cache 清理参数的生成配置形态。
- 修改 `packages/plugin-react/src/types.ts`：给 `pluginReact` 增加 React Compiler 配置类型。
- 修改 `packages/plugin-react/src/index.ts`：把 `pluginReact({reactCompiler})` 合并到 JS/TS 两条 `builtin:swc-loader` rule 的 `jsc.transform.reactCompiler`。
- 修改 `packages/plugin-react/test/react-refresh-plugin.test.mjs`：增加 React Compiler 真实配置断言，证明插件会写入 JS/TS 两条 SWC rule。
- 修改 `CHANGELOG.md`：在顶部新增 beta release 记录，说明 Rspack 2.1 集成内容和验证命令。
- 通过 `corepack pnpm release:version 4.0.0-beta.1` 修改根目录和 19 个内部包的 `package.json` 版本。
- 不修改 `apps/**`，除非 acceptance 失败证明必须做 Rspack 2.1 兼容修复。

---

### Task 1: 锁定 Rspack 2.1 依赖图

**Files:**
- Modify: `packages/cli/package.json`
- Conditional Modify: `packages/plugin-react/package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes: 根 `package.json` 的包管理约束：`pnpm@10.33.0`。
- Produces: `@empjs/cli` 直接依赖解析到 `@rspack/core@2.1.0`、`@rspack/dev-server@2.1.0`、`@swc/helpers@^0.5.23`。

- [ ] **Step 1: 重新确认 live registry 状态**

Run:

```bash
npm view @rspack/core@2.1.0 version peerDependencies dependencies dist-tags --json
npm view @rspack/dev-server@2.1.0 version peerDependencies dependencies dist-tags --json
npm view @rspack/plugin-react-refresh version dist-tags peerDependencies --json
npm view @empjs/cli dist-tags versions --json
```

Expected:

```text
@rspack/core version is 2.1.0 and depends on @rspack/binding 2.1.0.
@rspack/dev-server version is 2.1.0 and peers on @rspack/core ^2.0.0.
@rspack/plugin-react-refresh latest remains 2.0.2 with @rspack/core ^2.0.0 peer.
@empjs/cli beta dist-tag is 4.0.0-beta.0, so this release target is 4.0.0-beta.1.
```

- [ ] **Step 2: 更新 CLI 直接依赖**

Run:

```bash
corepack pnpm --filter @empjs/cli add @rspack/core@^2.1.0 @rspack/dev-server@^2.1.0 @swc/helpers@^0.5.23
```

`packages/cli/package.json` 预期片段：

```json
{
  "dependencies": {
    "@rspack/core": "^2.1.0",
    "@rspack/dev-server": "^2.1.0",
    "@swc/helpers": "^0.5.23"
  }
}
```

- [ ] **Step 3: React Refresh 插件保持当前兼容 latest 线**

Run:

```bash
npm view @rspack/plugin-react-refresh version peerDependencies --json
```

Expected:

```json
{
  "version": "2.0.2",
  "peerDependencies": {
    "@rspack/core": "^2.0.0",
    "react-refresh": ">=0.10.0 <1.0.0"
  }
}
```

如果 registry 返回仍符合预期，不修改 `packages/plugin-react/package.json`。现有 `@rspack/plugin-react-refresh: ^2.0.0` range 会解析到 `2.0.2`，并通过 `^2.0.0` peer range 兼容 Rspack 2.1。

- [ ] **Step 4: 验证 lockfile 解析结果**

Run:

```bash
corepack pnpm --filter @empjs/cli list @rspack/core @rspack/dev-server @swc/helpers --depth 1
corepack pnpm --filter @empjs/plugin-react list @rspack/plugin-react-refresh react-refresh --depth 1
rg -n "'@rspack/(core|binding|dev-server)@2\\.1\\.0|@rspack/core':|@rspack/dev-server:" pnpm-lock.yaml
```

Expected:

```text
@empjs/cli lists @rspack/core 2.1.0, @rspack/dev-server 2.1.0, and @swc/helpers 0.5.23 or newer in the 0.5 line.
@empjs/plugin-react lists @rspack/plugin-react-refresh 2.0.2 and react-refresh 0.18.0.
pnpm-lock.yaml contains @rspack/core@2.1.0, @rspack/binding@2.1.0, and @rspack/dev-server@2.1.0 entries for the EMP CLI peer graph.
```

- [ ] **Step 5: 提交依赖图变更**

Run:

```bash
git add packages/cli/package.json pnpm-lock.yaml
git commit -m "chore: upgrade rspack to 2.1"
```

Expected:

```text
提交成功；本任务只 stage packages/cli/package.json 和 pnpm-lock.yaml。
```

---

### Task 2: 暴露 Rspack 2.1 通用配置面

**Files:**
- Modify: `packages/cli/src/types/config.ts`
- Modify: `packages/cli/test/rspack2-features-shape.test.mjs`

**Interfaces:**
- Consumes: `packages/cli/src/types/config.ts` 中的 `EmpOptions.build.rspack`。
- Produces: 生成的 Rspack config 字段：
  - `experiments.runtimeMode`
  - `cache.maxAge`
  - `cache.maxGenerations`

- [ ] **Step 1: 先补 config-shape 覆盖**

在 `packages/cli/test/rspack2-features-shape.test.mjs` 现有 Rspack 2 options block 后追加：

```javascript
{
  const config = await loadConfigForFixture(
    await createFixture('rspack21-options', {
      appSrc: 'src',
      appEntry: 'index.ts',
      cache: {
        type: 'persistent',
        maxAge: 1000 * 60 * 60,
        maxGenerations: 2,
      },
      build: {
        rspack: {
          experiments: {
            runtimeMode: 'single',
          },
        },
      },
    }),
  )

  assert.equal(config.experiments.runtimeMode, 'single')
  assert.equal(config.cache.type, 'persistent')
  assert.equal(config.cache.maxAge, 1000 * 60 * 60)
  assert.equal(config.cache.maxGenerations, 2)
}
```

Run:

```bash
corepack pnpm --filter @empjs/cli run build
node packages/cli/test/rspack2-features-shape.test.mjs
```

Expected before implementation:

```text
如果 runtimeMode 已因 CLI 的 experiments 透传而通过，继续 Step 2 补齐类型出口；如果失败，失败点必须明确指向 experiments.runtimeMode 或 persistent cache 清理参数没有进入生成配置。
```

- [ ] **Step 2: 扩展配置类型**

更新 `packages/cli/src/types/config.ts`，让 `Rspack2BuildOptions.experiments` 包含 Rspack 2.1 的 `runtimeMode`：

```typescript
export type Rspack2BuildOptions = {
  /**
   * Rspack 2 experiments 显式开关。实验能力不默认关闭，未传入时交给 Rspack 自身默认值。
   */
  experiments?: Pick<NonNullable<RsConfig['experiments']>, 'pureFunctions' | 'deferImport' | 'runtimeMode'>
  /**
   * Rspack splitChunks 透传配置，用于接入 enforceSizeThreshold 等 Rspack 2 分包能力。
   */
  splitChunks?: Exclude<NonNullable<NonNullable<RsConfig['optimization']>['splitChunks']>, false>
  /**
   * Rspack parser 透传配置。
   */
  parser?: {
    javascript?: {
      pureFunctions?: string[]
    }
    css?: {
      resolveImport?: CssResolveImportType
    }
  }
  /**
   * builtin:swc-loader 的 Rspack 扩展配置。
   */
  swc?: Pick<SwcLoaderOptions, 'detectSyntax' | 'transformImport'>
}
```

- [ ] **Step 3: 验证新增 shape test 通过**

Run:

```bash
corepack pnpm --filter @empjs/cli run build
node packages/cli/test/rspack2-features-shape.test.mjs
```

Expected:

```text
命令退出码为 0；新增 rspack21-options block 确认 runtimeMode 和 persistent cache 清理参数均已进入生成配置。
```

- [ ] **Step 4: 运行 CLI 受影响测试**

Run:

```bash
corepack pnpm --filter @empjs/cli test
```

Expected:

```text
命令退出码为 0。
```

- [ ] **Step 5: 提交 CLI 通用配置面变更**

Run:

```bash
git add packages/cli/src/types/config.ts packages/cli/test/rspack2-features-shape.test.mjs
git commit -m "feat: expose rspack 2.1 options"
```

Expected:

```text
提交成功；本任务只 stage CLI 类型和测试文件。
```

---

### Task 3: 在 plugin-react 接入 React Compiler

**Files:**
- Modify: `packages/plugin-react/src/types.ts`
- Modify: `packages/plugin-react/src/index.ts`
- Modify: `packages/plugin-react/test/react-refresh-plugin.test.mjs`

**Interfaces:**
- Consumes: `pluginReact(options?: PluginReactType)`。
- Produces: `pluginReact({reactCompiler})` 会把 React Compiler 配置写入 JS/TS 两条 `builtin:swc-loader` rule 的 `options.jsc.transform.reactCompiler`。

- [ ] **Step 1: 先补失败的 plugin-react 配置测试**

更新 `packages/plugin-react/test/react-refresh-plugin.test.mjs`，把现有 `await pluginReact().rsConfig(store)` 改为：

```javascript
await pluginReact({reactCompiler: true}).rsConfig(store)
```

并在 React Refresh 断言后追加：

```javascript
const config = chain.toConfig()
const swcUses = (config.module?.rules ?? [])
  .flatMap(rule => {
    const use = rule.use
    if (!use) return []
    return Array.isArray(use) ? use : Object.values(use)
  })
  .filter(use => use?.options?.jsc?.transform)

assert.ok(swcUses.length >= 2, 'expected plugin-react to update javascript and typescript swc rules')
assert.ok(
  swcUses.every(use => use.options.jsc.transform.reactCompiler === true),
  'expected pluginReact({reactCompiler: true}) to enable SWC React Compiler on every React swc rule',
)
```

Run:

```bash
corepack pnpm --filter @empjs/chain build
corepack pnpm --filter @empjs/plugin-react run build
node packages/plugin-react/test/react-refresh-plugin.test.mjs
```

Expected before implementation:

```text
测试失败，原因是 PluginReactType 还没有 reactCompiler，且 plugin-react 没有把 reactCompiler 写入 jsc.transform。
```

- [ ] **Step 2: 给 plugin-react 增加 React Compiler 类型**

在 `packages/plugin-react/src/types.ts` 顶部新增：

```typescript
export type ReactCompilerOptions =
  | boolean
  | {
      compilationMode?: 'infer' | 'syntax' | 'annotation' | 'all'
      panicThreshold?: 'none' | 'critical_errors' | 'all_errors'
      target?: '17' | '18' | '19'
      noEmit?: boolean
      outputMode?: 'client' | 'ssr' | 'lint'
      ignoreUseNoForget?: boolean
      flowSuppressions?: boolean
      enableReanimated?: boolean
      isDev?: boolean
      eslintSuppressionRules?: string[]
      customOptOutDirectives?: string[]
      gating?: {
        source: string
        importSpecifierName: string
      }
      dynamicGating?: {
        source: string
      }
    }
```

并在 `PluginReactType` 中新增：

```typescript
  /**
   * 启用 Rspack 2.1 builtin:swc-loader 的 React Compiler。
   * 这是 React 专属能力，入口放在 pluginReact，而不是 build.rspack.swc。
   */
  reactCompiler?: ReactCompilerOptions
```

- [ ] **Step 3: 在 plugin-react 中合并 React Compiler 配置**

更新 `packages/plugin-react/src/index.ts` 的 `transform` 构建逻辑。保持现有 `react` 配置不变，在 `transform` 定义后追加：

```typescript
      if (o.reactCompiler !== undefined) {
        transform.reactCompiler = o.reactCompiler
      }
```

预期上下文：

```typescript
      const transform = {
        react: {
          runtime: reactRuntime,
          development: store.isDev,
          refresh: store.isDev && o.hmr,
        },
      }
      if (o.reactCompiler !== undefined) {
        transform.reactCompiler = o.reactCompiler
      }
      const resetTransform = (op: any) => {
        op.jsc.transform = deepAssign(op.jsc.transform, transform)
        return op
      }
```

- [ ] **Step 4: 验证 plugin-react 测试通过**

Run:

```bash
corepack pnpm --filter @empjs/chain build
corepack pnpm --filter @empjs/plugin-react test
```

Expected:

```text
命令退出码为 0；测试确认 React Refresh 仍注册，并且 pluginReact({reactCompiler: true}) 会写入 JS/TS SWC rule。
```

- [ ] **Step 5: 运行包级受影响测试**

Run:

```bash
corepack pnpm test:packages
```

Expected:

```text
命令退出码为 0，确认 @empjs/plugin-react、@empjs/chain、@empjs/share 的包级测试全部通过。
```

- [ ] **Step 6: 提交 plugin-react React Compiler 变更**

Run:

```bash
git add packages/plugin-react/src/types.ts packages/plugin-react/src/index.ts packages/plugin-react/test/react-refresh-plugin.test.mjs
git commit -m "feat: enable react compiler in plugin-react"
```

Expected:

```text
提交成功；本任务只 stage plugin-react 类型、实现和测试文件。
```

---

### Task 4: 运行 Rspack 2.1 真实回归 gate

**Files:**
- 只有当 gate 暴露真实兼容问题时才修改：`packages/cli/**`、`packages/emp-share/**`、`packages/plugin-react/**` 或最小受影响的 `apps/**` fixture。

**Interfaces:**
- Consumes: Task 1、Task 2 和 Task 3 的依赖与配置变更。
- Produces: EMP CLI build、Rspack config generation、Module Federation runtime/type flow、acceptance apps 在 Rspack 2.1 上可用的证据。

- [ ] **Step 1: 实现变更后刷新 CodeGraph**

Run:

```bash
codegraph sync .
codegraph status .
```

Expected:

```text
CodeGraph 报告索引为 up to date。
```

- [ ] **Step 2: 运行仓库 sanity 和 release-scope gate**

Run:

```bash
corepack pnpm workflow:check
corepack pnpm release:check
```

Expected:

```text
EMP workflow check passed.
Task 5 前 release:check 报告 Root version 4.0.0-beta.0，Internal packages: 19。
```

- [ ] **Step 3: 运行完整本地 CI 验证**

Run:

```bash
corepack pnpm ci:verify
```

Expected:

```text
workflow:check、test:cli、test:packages、test:rules、release:check、check:rslib-presets 全部退出码为 0。
```

- [ ] **Step 4: 运行构建和 app acceptance gate**

Run:

```bash
corepack pnpm empbuild
corepack pnpm apps:acceptance
```

Expected:

```text
两个命令均退出码为 0。若出现 Rspack 或 Module Federation warning，记录准确 app/package 名称；任何非 0 退出都必须先修复再发布。
```

- [ ] **Step 5: 运行聚焦 Module Federation browser 回归**

Run:

```bash
corepack pnpm test:apps:mf
corepack pnpm --filter @empjs/share test
```

Expected:

```text
两个命令均退出码为 0，证明 Rspack 2.1 的 Module Federation manifest/shared 修复不会回归 EMP share 行为。
```

- [ ] **Step 6: 只有出现兼容修复时才提交**

如果 Step 3、Step 4 或 Step 5 需要修复，执行：

```bash
git add <fixed-files>
git commit -m "fix: align emp with rspack 2.1"
```

Expected:

```text
如果所有 gate 无需兼容修复，不创建提交。如果创建提交，只包含与失败 gate 直接相关的文件。
```

---

### Task 5: 版本、Changelog、Publish Dry Run 和 Beta 发布

**Files:**
- Modify: `package.json`
- Modify: `scripts/release.mjs` 选中的 19 个内部包对应的 `packages/*/package.json`
- Modify: `CHANGELOG.md`
- Do not modify: `packages/cdn-*`、`packages/lib-*`、`apps/**`、`website`

**Interfaces:**
- Consumes: Task 4 通过的 gate 和 npm registry 状态。
- Produces: 19 个内部 EMP 包发布到 npm beta dist-tag，版本为 `4.0.0-beta.1`；如果执行时 npm 已存在该版本，则使用下一个未发布 beta 版本。

- [ ] **Step 1: 版本变更前立即确认 beta 目标版本**

Run:

```bash
npm view @empjs/cli dist-tags versions --json
```

Expected:

```text
如果 beta dist-tag 仍是 4.0.0-beta.0，且 versions 不包含 4.0.0-beta.1，则使用 4.0.0-beta.1。
如果 4.0.0-beta.1 已存在，则使用下一个未发布的 4.0.0-beta.N，并替换下面所有命令中的版本号。
```

- [ ] **Step 2: 应用新的内部版本**

Run:

```bash
corepack pnpm release:version 4.0.0-beta.1
corepack pnpm release:check
```

Expected:

```text
release:version 输出 Internal release version updated to 4.0.0-beta.1。
release:check 报告 Root version 4.0.0-beta.1，Internal packages: 19。
```

- [ ] **Step 3: 生成并编辑 changelog 记录**

Run:

```bash
corepack pnpm release:changelog -- --version 4.0.0-beta.1 --date 2026-06-26 --tag beta
```

然后编辑 `CHANGELOG.md` 顶部记录，确保包含以下要点：

```markdown
- Upgrade EMP's direct Rspack toolchain to `@rspack/core@2.1.0`, `@rspack/dev-server@2.1.0`, and `@rspack/binding@2.1.0`.
- Expose Rspack 2.1 generic options through `build.rspack`, including `experiments.runtimeMode` and persistent cache cleanup knobs.
- Enable Rspack 2.1 SWC React Compiler through `pluginReact({reactCompiler})`, keeping React-only compiler behavior inside `@empjs/plugin-react`.
- Keep `@rspack/plugin-react-refresh` on `2.0.2` because npm has no `2.1.0` release and its peer range accepts Rspack 2.
- Validate CLI, packages, app acceptance, Module Federation browser behavior, release scope, and publish dry-run before beta publish.
```

Expected:

```text
CHANGELOG.md 顶部记录为 2026-06-26 的 4.0.0-beta.1，dist-tag 为 beta，并写入本任务实际执行的验证命令。
```

- [ ] **Step 4: 重新运行 release 和格式 guard**

Run:

```bash
corepack pnpm workflow:check
corepack pnpm ci:verify
corepack pnpm empbuild
corepack pnpm apps:acceptance
corepack pnpm release:publish:dry -- --force-all
git diff --check
```

Expected:

```text
所有命令退出码为 0。
release:publish:dry 打印 19 个选中的内部包，以及带 --dry-run 和 --tag beta 的 npm publish 命令。
git diff --check 不输出 whitespace error。
```

- [ ] **Step 5: 提交 release metadata**

Run:

```bash
git add package.json packages/*/package.json CHANGELOG.md
git diff --cached --check
git commit -m "chore: release emp 4.0.0-beta.1"
```

Expected:

```text
提交成功；staged 文件限定为 package 版本文件和 CHANGELOG.md。
```

- [ ] **Step 6: 使用显式确认发布 beta**

Run:

```bash
corepack pnpm release:publish -- --yes --tag beta --force-all
```

Expected:

```text
命令退出码为 0；完成构建并将 19 个内部包发布到 npm，dist-tag 为 beta。
```

- [ ] **Step 7: 验证 npm beta dist-tag**

Run:

```bash
npm view @empjs/cli dist-tags version --json
npm view @empjs/share dist-tags version --json
npm view @empjs/plugin-react dist-tags version --json
```

Expected:

```text
每个包都报告 beta: 4.0.0-beta.1。除非发布策略明确变化，latest tag 继续保持在现有稳定或 legacy 线。
```

- [ ] **Step 8: Push 并确认 CI**

Run:

```bash
git status --short --branch
git push origin v4
```

随后确认 pushed `v4` commit 的 GitHub Actions：

```bash
gh run list --branch v4 --limit 5
gh run view <new-run-id> --json conclusion,status,headSha,name
```

Expected:

```text
git status 显示 v4 clean；若仍有本计划开始前就存在的无关用户改动，需要明确保留并说明。
pushed commit 的 CI run 最终 conclusion 为 success，verify、build、apps jobs 均通过。
```

---

## Self-Review

- Spec coverage：计划覆盖 Rspack 2.1 release 重点、EMP 依赖升级、CLI 通用配置集成、plugin-react React Compiler 接入、测试/验收矩阵、changelog、dry-run、真实 beta publish 和发布后 npm 验证。
- Placeholder scan：计划没有空占位；条件分支均给出明确命令和预期结果。
- Type consistency：`build.rspack.experiments.runtimeMode` 在 `Rspack2BuildOptions` 中定义，并通过 `rspack2-features-shape.test.mjs` 的生成配置断言验证；`pluginReact({reactCompiler})` 在 `PluginReactType` 中定义，由 `packages/plugin-react/src/index.ts` 合并到 `jsc.transform.reactCompiler`，并通过 `react-refresh-plugin.test.mjs` 断言验证。
