# Rspack 2 新特征接入实施计划

> **执行代理要求：** 必须使用 `superpowers:subagent-driven-development`（推荐）或 `superpowers:executing-plans` 按任务推进；步骤使用 checkbox（`- [ ]`）语法跟踪状态。

**Goal:** 在不破坏 EMP 现有构建默认行为的前提下，把 Rspack 2 的低风险新配置能力接入 `@empjs/cli`，并明确每一项能力的作用、默认策略、测试点和风险边界。

**Architecture:** 继续沿用 `EmpOptions -> EmpConfig -> RspackCommon/RspackModule/RspackPlugin -> rspack config` 的现有链路。新增能力优先放到 `build.rspack` 这一窄口，避免污染已有 `build` 顶层字段；只对确定替代废弃路径的 ESM library 输出做默认修正。

**Tech Stack:** TypeScript, Rspack 2.0.8, `@rspack/dev-server` 2.1.0, Node.js `assert`, `pnpm@10.33.0`.

## Global Constraints（硬性约束）

- 全部计划、执行记录、README 说明、验证结论和最终交付总结必须使用中文。
- 代码标识符、配置字段、包名、命令和官方 API 名称保持英文原样。
- 不修改 `projects/**`、`website` 或非 CLI / share 相关示例。
- 不默认开启高风险实验能力；只开放显式配置入口。
- 不引入新测试框架；继续使用 `packages/cli/test/*.mjs`。
- 每个行为变更必须先写失败测试，再写实现。
- 每次实现后至少运行相关单测；最终运行 `pnpm --filter @empjs/cli test` 和 `pnpm --filter @empjs/share test`。
- 禁止无授权 force push；本计划不要求自动提交或推送。

---

## 每一项 Rspack 2 能力的作用

1. `output.library.type = 'modern-module'`
   - 作用：替代旧的 `rspack.experiments.EsmLibraryPlugin`，用于 ESM library 输出；支持更适合库发布的 tree-shaking、scope hoisting、code splitting 和 `preserveModules`。
   - 默认策略：当 `build.useESM = true` 时自动配置 `output.library.type = 'modern-module'` 和 `output.library.preserveModules = src`。
   - 风险边界：`modern-module` 不应与其他 `library.type` 混用；如果用户显式配置 `output.library`，只补缺省字段，不覆盖用户配置。

2. `optimization.moduleIds = 'hashed'`
   - 作用：使用模块路径短哈希作为 module id，提升 id 稳定性并可能缩短大型应用产物中的 id 体积。
   - 默认策略：只扩展类型和透传配置，不改变生产默认 `deterministic`。
   - 风险边界：不自动替换默认值，避免影响已有缓存命中和产物 diff。

3. `optimization.splitChunks.enforceSizeThreshold`
   - 作用：当候选 chunk 达到阈值时忽略请求数限制，继续拆分过大 chunk。
   - 默认策略：通过 `build.rspack.splitChunks` 透传，不默认开启。
   - 风险边界：splitChunks 会影响首屏请求数量和 HTML 注入顺序，必须由业务显式配置。

4. `experiments.pureFunctions`
   - 作用：启用函数级无副作用分析，支持 `#__NO_SIDE_EFFECTS__` 注解和 parser 级 `pureFunctions` 配置，提高 tree-shaking 精度。
   - 默认策略：通过 `build.rspack.experiments.pureFunctions` 显式开启；不改变 dev 默认。
   - 风险边界：错误标记 pure function 会删除实际有副作用调用，只开放显式入口。

5. `module.parser.javascript.pureFunctions`
   - 作用：为无法改源码的第三方库手动声明纯函数名称。
   - 默认策略：通过 `build.rspack.parser.javascript.pureFunctions` 透传。
   - 风险边界：必须由业务维护函数名列表，EMP 不内置默认名单。

6. `builtin:swc-loader detectSyntax = 'auto'`
   - 作用：让一个 loader 规则可根据扩展名推断 JS/TS/JSX/TSX parser，减少手写 parser 偏差。
   - 默认策略：通过 `build.rspack.swc.detectSyntax` 显式开启；不合并 JS/TS 两条规则。
   - 风险边界：当前 EMP 已有 JS/TS 分离规则，默认翻转收益有限且有兼容风险。

7. CSS parser `resolveImport`
   - 作用：控制 CSS `@import` 是否由 Rspack 解析并内联；设为 `false` 时保留原始 `@import` 给浏览器或下游工具处理。
   - 默认策略：通过 `build.rspack.parser.css.resolveImport` 同步到 `css`、`css/auto`、`css/module` parser。
   - 风险边界：可能改变 CSS 依赖打包方式，不默认关闭。

8. `experiments.deferImport`
   - 作用：支持 `import defer` / `import.defer()` 相关延迟求值能力。
   - 默认策略：只开放 `build.rspack.experiments.deferImport` 显式开关，不默认开启。
   - 风险边界：属于语义型实验能力，业务代码和 TypeScript 版本需要同步支持。

9. React Server Components 低层支持
   - 作用：配合 SWC loader 的 RSC 支持处理 server/client component 边界。
   - 默认策略：本阶段不接入。
   - 风险边界：EMP 当前没有 RSC 框架层约束，直接开放容易形成半能力。

## File Structure

- 修改：`packages/cli/src/types/config.ts`
  - 增加 `build.rspack` 配置类型，扩展 `moduleIds` 支持 `hashed`。
- 修改：`packages/cli/src/store/empConfig.ts`
  - 增加 `build.rspack` 默认值。
  - 当 `build.useESM = true` 时用 `modern-module` library 配置替代旧插件路径。
- 修改：`packages/cli/src/store/rspack/common.ts`
  - 合并 `build.rspack.experiments`。
  - 透传 `build.rspack.splitChunks`。
- 修改：`packages/cli/src/store/rspack/module.ts`
  - 透传 JS parser `pureFunctions`、CSS parser `resolveImport`、SWC `detectSyntax`。
- 修改：`packages/cli/src/store/rspack/plugin.ts`
  - 移除 `EsmLibraryPlugin` 注册路径，避免 Rspack 2 下 no-op 或废弃 API。
- 新增：`packages/cli/test/rspack2-features-shape.test.mjs`
  - 验证 `modern-module`、`hashed`、`splitChunks`、`pureFunctions`、`detectSyntax`、`resolveImport` 都能进入最终 Rspack 配置。
- 修改：`packages/cli/package.json`
  - 将新测试接入 `test` script。

## Task 1：接入 `modern-module` 并替换 `EsmLibraryPlugin`

**Files:**
- Modify: `packages/cli/src/store/empConfig.ts`
- Modify: `packages/cli/src/store/rspack/plugin.ts`
- Create: `packages/cli/test/rspack2-features-shape.test.mjs`
- Modify: `packages/cli/package.json`

**Interfaces:**
- Consumes: `build.useESM`, `output.library`, `output.module`
- Produces: `output.library.type = 'modern-module'`, `output.library.preserveModules = '<root>/src'`

- [ ] **Step 1: Write the failing test**

新增测试 fixture，配置 `build.useESM = true`，断言最终 `rsConfig.output.library.type` 为 `modern-module`，`preserveModules` 指向 fixture 的 `src`。

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
pnpm --filter @empjs/cli build
node packages/cli/test/rspack2-features-shape.test.mjs
```

Expected: FAIL，因为当前只尝试注册 `EsmLibraryPlugin`，没有在 `output.library` 写入 `modern-module`。

- [ ] **Step 3: Implement minimal code**

在 `EmpConfig.output` 中，当 `this.store.empConfig.isESM` 为真时，补充：

```ts
output.module = true
output.library = this.assign({type: 'modern-module', preserveModules: this.store.resolve('src')}, output.library)
```

并移除 `RspackPlugin.esmLibraryPlugin()` 的实际插件注册。

- [ ] **Step 4: Run verification**

Run:

```bash
node packages/cli/test/rspack2-features-shape.test.mjs
pnpm --filter @empjs/cli test
```

Expected: PASS。

## Task 2：开放 Rspack 2 优化和实验配置

**Files:**
- Modify: `packages/cli/src/types/config.ts`
- Modify: `packages/cli/src/store/empConfig.ts`
- Modify: `packages/cli/src/store/rspack/common.ts`
- Modify: `packages/cli/test/rspack2-features-shape.test.mjs`

**Interfaces:**
- Consumes: `build.moduleIds`, `build.rspack.splitChunks`, `build.rspack.experiments`
- Produces: `optimization.moduleIds`, `optimization.splitChunks`, `experiments.pureFunctions`, `experiments.deferImport`

- [ ] **Step 1: Write the failing test**

在新测试中配置：

```js
build: {
  moduleIds: 'hashed',
  rspack: {
    splitChunks: {chunks: 'all', enforceSizeThreshold: 80000},
    experiments: {pureFunctions: true, deferImport: true}
  }
}
```

断言最终配置包含这些字段。

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node packages/cli/test/rspack2-features-shape.test.mjs
```

Expected: FAIL，因为类型和配置合并尚未接入。

- [ ] **Step 3: Implement minimal code**

扩展 `BuildType.moduleIds` 支持 `hashed`，新增 `BuildType.rspack`，并在 `RspackCommon.common()` / `optimization()` 中透传。

- [ ] **Step 4: Run verification**

Run:

```bash
node packages/cli/test/rspack2-features-shape.test.mjs
pnpm --filter @empjs/cli test
```

Expected: PASS。

## Task 3：开放 parser 和 SWC loader 透传入口

**Files:**
- Modify: `packages/cli/src/types/config.ts`
- Modify: `packages/cli/src/store/rspack/module.ts`
- Modify: `packages/cli/test/rspack2-features-shape.test.mjs`

**Interfaces:**
- Consumes: `build.rspack.parser.javascript.pureFunctions`, `build.rspack.parser.css.resolveImport`, `build.rspack.swc.detectSyntax`
- Produces: `module.parser.javascript.pureFunctions`, CSS parser `resolveImport`, SWC loader `detectSyntax`

- [ ] **Step 1: Write the failing test**

在新测试中配置：

```js
build: {
  rspack: {
    parser: {
      javascript: {pureFunctions: ['createPureValue']},
      css: {resolveImport: false}
    },
    swc: {detectSyntax: 'auto'}
  }
}
```

断言最终配置中 JS parser、CSS parser 和 SWC loader options 已包含对应字段。

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node packages/cli/test/rspack2-features-shape.test.mjs
```

Expected: FAIL，因为当前未透传这些字段。

- [ ] **Step 3: Implement minimal code**

在 `RspackModule.rspackParser()` 合并 parser 配置，在 `swcOptions()` 合并 `detectSyntax`。

- [ ] **Step 4: Run verification**

Run:

```bash
node packages/cli/test/rspack2-features-shape.test.mjs
pnpm --filter @empjs/cli test
pnpm --filter @empjs/share test
git diff --check
```

Expected: PASS。

## 最终验证

必须执行：

```bash
pnpm --filter @empjs/cli test
pnpm --filter @empjs/share test
pnpm --filter @empjs/cli build
git diff --check
git status --short --branch
```

## 未接入项说明

- RSC 本阶段不接入，因为 EMP 当前没有框架层 server/client component 约束。
- `deferImport` 只开放显式开关，不默认开启。
- `detectSyntax` 只开放显式开关，不合并现有 JS/TS 分离规则。
