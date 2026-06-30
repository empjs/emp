# Rspack 2.1.1 And Rsdoctor Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 EMP v4 的 CLI Rspack 运行时收敛到 `@rspack/core@2.1.1`，将 Rsdoctor 插件升级到 `@rsdoctor/rspack-plugin@1.5.17`，并用真实构建/验收判断 Rspack v2.1.1 release 中的能力是否需要在 EMP 侧追加优化。

**Architecture:** 本次升级只触碰 EMP 的 Rspack 集成边界：`@empjs/cli` 负责直接依赖、Rspack 配置生成、Rsdoctor 插件注入和 CLI 级测试；`apps/**`、`website` 继续作为验收面，不进入发布包范围。先用 npm/GitHub release 元数据锁定版本事实，再用 CLI shape test、Rsdoctor 插件加载 smoke、apps/library 真实构建验证补丁升级没有改变 EMP 默认行为。

**Tech Stack:** Node `^20.19.0 || >=22.12.0`、`corepack pnpm@10.33.0`、Rspack `2.1.1`、`@rspack/dev-server@2.1.0`、`@rsdoctor/rspack-plugin@1.5.17`、Rslib、Rstest、Module Federation `2.6.x`。

## Global Constraints

- 默认中文沟通和交付；最终必须说明真实验证结果和未覆盖边界。
- 当前 live checkout：`v4...origin/v4 [ahead 1]`，开始执行前必须再次运行 `git status --short --branch`，并保留用户已有改动。
- 当前 CodeGraph 已同步且 up to date：`394 files / 3,268 nodes / 7,057 edges`；执行跨文件判断前再次运行 `codegraph sync . && codegraph status .`。
- 统一使用 `corepack pnpm`；当前仓库 `packageManager` 为 `pnpm@10.33.0`，不要使用裸 `pnpm` 做结论。
- 本计划不修改 `apps/**`、`website`、`packages/cdn-*`、`packages/lib-*` 版本线；它们只作为验收面。
- `@rspack/dev-server` 当前 npm latest 是 `2.1.0`，不存在 `2.1.1`；不要把 dev-server 强行写成不存在的版本。
- `@rspack/core@2.1.1` npm latest 于 2026-06-27 发布，peer 仍是 `@module-federation/runtime-tools ^0.24.1 || ^2.0.0` 和 `@swc/helpers ^0.5.23`。
- `@rsdoctor/rspack-plugin@1.5.17` npm latest 于 2026-06-29 发布，peer 为 `@rspack/core: *`，依赖 `@rsdoctor/core/sdk/graph/types/utils@1.5.17`。
- Rspack v2.1.1 release 来源：https://github.com/web-infra-dev/rspack/releases/tag/v2.1.1。
- Rspack v2.1.1 release 需要判断的 EMP 影响点：Rsdoctor export usage edge 元数据、SourceMapDevToolPlugin persistent cache、CSS runtime `link.parentNode` guard、CJS export assignment side-effect 优化回滚、Module Federation runtime-tools `2.6.0` 依赖更新。
- 新增测试优先落到现有 CLI/package/root 入口，不引入 Vitest/Jest/Mocha/Ava 等第二套 runner。
- 完整执行通过前不 push、不发布；用户明确要求提交或发布时，才进入 commit/push/release 闭环。

---

## File Structure

- Modify: `packages/cli/package.json`
  - 把 `@rspack/core` 固定到 `2.1.1`。
  - 把 `@rsdoctor/rspack-plugin` 固定到 `1.5.17`。
  - 在 `test` 脚本中接入新增的 Rsdoctor smoke test。
- Modify: `pnpm-lock.yaml`
  - 收敛 `@empjs/cli` 直接依赖和 Rsdoctor peer graph 到 `@rspack/core@2.1.1`。
  - 移除 Rsdoctor `1.5.0` 相关解析，保留其他工具链真实需要的 Rspack 版本。
- Modify: `packages/cli/test/rspack2-features-shape.test.mjs`
  - 增加 `@empjs/cli` 导出的 `rspack.rspackVersion === "2.1.1"` 断言。
- Create: `packages/cli/test/rsdoctor-plugin-shape.test.mjs`
  - 用真实 `store.setup("build", {doctor: true})` 验证 Rsdoctor 插件可加载并进入 Rspack plugins。
- Modify: `CHANGELOG.md`
  - 记录 Rspack `2.1.1`、Rsdoctor `1.5.17`、release note 优化判断和验证命令。
- No Change Expected: `packages/cli/src/store/rspack/plugin.ts`
  - 当前 `debug.rsdoctor` / `--doctor` 已经动态 require `@rsdoctor/rspack-plugin` 并注入 `RsdoctorRspackPlugin`；只有新增 smoke test 失败时才修改这里。
- No Change Expected: `packages/cli/src/types/config.ts`
  - 当前 `Rspack2BuildOptions.experiments.runtimeMode`、persistent cache 相关配置已经存在；本次不新增公开配置面。

---

### Task 1: 收敛 Rspack 和 Rsdoctor 依赖图

**Files:**
- Modify: `packages/cli/package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes: `packages/cli` 的 direct dependencies。
- Produces: `@empjs/cli` 安装树中 `@rspack/core` 解析为 `2.1.1`，`@rsdoctor/rspack-plugin` 解析为 `1.5.17`，`@rspack/dev-server` 保持 `2.1.0` 并绑定 `@rspack/core@2.1.1` peer graph。

- [ ] **Step 1: 重新确认 npm 版本事实**

Run:

```bash
npm view @rspack/core@2.1.1 version peerDependencies dependencies dist-tags --json
npm view @rspack/dev-server@2.1.0 version peerDependencies dependencies dist-tags --json
npm view @rsdoctor/rspack-plugin@1.5.17 version peerDependencies dependencies --json
```

Expected:

```text
@rspack/core version is 2.1.1 and depends on @rspack/binding 2.1.1.
@rspack/dev-server latest is 2.1.0 and peers on @rspack/core ^2.0.0.
@rsdoctor/rspack-plugin version is 1.5.17 and peers on @rspack/core *.
```

- [ ] **Step 2: 更新 CLI 直接依赖**

Run:

```bash
corepack pnpm --filter @empjs/cli add @rspack/core@2.1.1 @rsdoctor/rspack-plugin@1.5.17 --save-exact
```

Expected `packages/cli/package.json` dependency fragment:

```json
{
  "dependencies": {
    "@rsdoctor/rspack-plugin": "1.5.17",
    "@rspack/core": "2.1.1",
    "@rspack/dev-server": "^2.1.0"
  }
}
```

- [ ] **Step 3: 验证安装树没有停留在 CLI 旧版本**

Run:

```bash
corepack pnpm --filter @empjs/cli why @rspack/core
corepack pnpm --filter @empjs/cli why @rsdoctor/rspack-plugin
corepack pnpm --filter @empjs/cli exec node --input-type=module --eval "import rspack from '@rspack/core'; console.log(rspack.rspackVersion)"
```

Expected:

```text
@empjs/cli direct dependency resolves @rspack/core@2.1.1.
@empjs/cli direct dependency resolves @rsdoctor/rspack-plugin@1.5.17.
The node command prints exactly 2.1.1.
```

- [ ] **Step 4: 检查 lockfile 中 Rsdoctor 旧图是否已退出 CLI 路径**

Run:

```bash
rg -n "'@rsdoctor/(rspack-plugin|core|sdk|graph|types|utils)@1\\.5\\.0|@rsdoctor/rspack-plugin@1\\.5\\.0" pnpm-lock.yaml
rg -n "'@rsdoctor/(rspack-plugin|core|sdk|graph|types|utils)@1\\.5\\.17|@rsdoctor/rspack-plugin@1\\.5\\.17" pnpm-lock.yaml
```

Expected:

```text
The first command prints no matches.
The second command prints @rsdoctor/* 1.5.17 package and snapshot entries.
```

- [ ] **Step 5: 提交依赖图变更**

Run:

```bash
git add packages/cli/package.json pnpm-lock.yaml
git diff --cached --check
git commit -m "chore: upgrade rspack and rsdoctor"
```

Expected:

```text
git diff --cached --check exits 0.
Commit includes only packages/cli/package.json and pnpm-lock.yaml.
```

---

### Task 2: 补齐 CLI 真实 smoke 测试

**Files:**
- Modify: `packages/cli/package.json`
- Modify: `packages/cli/test/rspack2-features-shape.test.mjs`
- Create: `packages/cli/test/rsdoctor-plugin-shape.test.mjs`

**Interfaces:**
- Consumes: Task 1 生成的 `@rspack/core@2.1.1` 和 `@rsdoctor/rspack-plugin@1.5.17`。
- Produces:
  - `packages/cli/test/rspack2-features-shape.test.mjs` 直接断言 CLI 导出的 Rspack 版本。
  - `packages/cli/test/rsdoctor-plugin-shape.test.mjs` 证明 `--doctor` 路径能真实加载 Rsdoctor plugin。
  - `packages/cli/package.json` 的 `test` 脚本覆盖新增 smoke。

- [ ] **Step 1: 先写 Rspack version 断言**

在 `packages/cli/test/rspack2-features-shape.test.mjs` 的 `loadConfigForFixture` 定义后追加：

```javascript
{
  const {rspack} = await import(`file://${path.join(repoRoot, 'packages/cli/dist/index.js')}`)
  assert.equal(rspack.rspackVersion, '2.1.1')
}
```

Run:

```bash
corepack pnpm --filter @empjs/cli run build
node packages/cli/test/rspack2-features-shape.test.mjs
```

Expected before Task 1:

```text
The new assertion fails with actual version 2.1.0.
```

Expected after Task 1:

```text
The script exits 0.
```

- [ ] **Step 2: 新增 Rsdoctor 插件 smoke**

Create `packages/cli/test/rsdoctor-plugin-shape.test.mjs`:

```javascript
import assert from 'node:assert/strict'
import {execFile as execFileCallback} from 'node:child_process'
import {mkdir, writeFile} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import path from 'node:path'
import {promisify} from 'node:util'

const repoRoot = path.resolve(import.meta.dirname, '../../..')
const execFile = promisify(execFileCallback)

const createFixture = async name => {
  const root = path.join(tmpdir(), `emp-rsdoctor-${name}-${process.pid}`)
  await mkdir(path.join(root, 'src'), {recursive: true})
  await writeFile(path.join(root, 'package.json'), JSON.stringify({name, private: true, version: '0.0.0'}, null, 2))
  await writeFile(path.join(root, 'src/index.ts'), "export const fixtureValue = 'ok'\n")
  await writeFile(
    path.join(root, 'emp.config.ts'),
    `export default ${JSON.stringify({appSrc: 'src', appEntry: 'index.ts'}, null, 2)}\n`,
  )
  return root
}

const loadRsdoctorShape = async fixtureRoot => {
  const script = `
    process.chdir(${JSON.stringify(fixtureRoot)})
    process.env.NODE_ENV = ''
    process.env.ENV = ''
    const {store} = await import(${JSON.stringify(`file://${path.join(repoRoot, 'packages/cli/dist/index.js')}`)})
    await store.setup('build', {doctor: true})
    const pluginNames = (store.rsConfig.plugins ?? []).map(plugin => plugin?.constructor?.name ?? plugin?.name ?? '')
    console.log('__EMP_JSON__' + JSON.stringify({pluginNames}))
  `
  const {stdout} = await execFile(process.execPath, ['--input-type=module', '--eval', script], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024 * 10,
  })
  const jsonStart = stdout.indexOf('__EMP_JSON__')
  assert.notEqual(jsonStart, -1, stdout)
  return JSON.parse(stdout.slice(jsonStart + '__EMP_JSON__'.length).trim())
}

const shape = await loadRsdoctorShape(await createFixture('plugin-shape'))
assert.ok(
  shape.pluginNames.some(name => name.toLowerCase().includes('doctor')),
  `expected Rsdoctor plugin in Rspack plugins, got: ${shape.pluginNames.join(', ')}`,
)
```

Run:

```bash
corepack pnpm --filter @empjs/cli run build
node packages/cli/test/rsdoctor-plugin-shape.test.mjs
```

Expected:

```text
The script exits 0 and confirms a plugin name containing doctor.
If it fails with ERR_REQUIRE_ESM or missing export, update packages/cli/src/store/rspack/plugin.ts to load @rsdoctor/rspack-plugin through a compatible dynamic import path, then rerun this step.
```

- [ ] **Step 3: 接入 CLI package test**

Update `packages/cli/package.json` `scripts.test` so the end includes the new smoke:

```json
{
  "scripts": {
    "test": "node test/rslib-node-target.test.mjs && node test/cli-options.test.mjs && node test/config-file-discovery.test.mjs && node test/build-watch-shape.test.mjs && node test/lifecycle-order.test.mjs && pnpm run build && node test/cli-help.test.mjs && node test/rspack2-features-shape.test.mjs && node test/rspack-config-shape.test.mjs && node test/rsdoctor-plugin-shape.test.mjs"
  }
}
```

Run:

```bash
corepack pnpm --filter @empjs/cli test
```

Expected:

```text
@empjs/cli test exits 0.
```

- [ ] **Step 4: 提交测试变更**

Run:

```bash
git add packages/cli/package.json packages/cli/test/rspack2-features-shape.test.mjs packages/cli/test/rsdoctor-plugin-shape.test.mjs
git diff --cached --check
git commit -m "test: cover rspack 2.1.1 rsdoctor integration"
```

Expected:

```text
git diff --cached --check exits 0.
Commit includes only the CLI package manifest and CLI test files.
```

---

### Task 3: 判断 Rspack v2.1.1 Release 是否需要 EMP 侧优化

**Files:**
- Modify: `CHANGELOG.md`
- Conditional Modify: `packages/cli/src/store/rspack/plugin.ts`
- Conditional Modify: `packages/cli/src/types/config.ts`
- Conditional Modify: `packages/cli/test/rspack2-features-shape.test.mjs`

**Interfaces:**
- Consumes: Rspack v2.1.1 release 影响点。
- Produces: `CHANGELOG.md` 中明确的优化结论；只有验证失败或发现 EMP 默认行为缺口时才产生源码修改。

- [ ] **Step 1: 记录 release 影响点和初始判断**

在 `CHANGELOG.md` 顶部新增本次升级记录：

```markdown
## 4.0.0-beta.2

### Bug Fixes

- fix: upgrade `@rspack/core` to `2.1.1` to pick up the CSS runtime guard and the CJS export assignment side-effect rollback from Rspack v2.1.1.

### Other Changes

- chore: upgrade `@rsdoctor/rspack-plugin` to `1.5.17`; EMP keeps `debug.rsdoctor` and `--doctor` as opt-in diagnostics.
- test: add CLI smoke coverage for the exported Rspack version and Rsdoctor plugin injection.

### Optimization Review

- Rsdoctor export usage edge metadata is provided by upstream Rspack/Rsdoctor and does not require a new EMP public option.
- SourceMapDevToolPlugin persistent cache works through the existing `build.sourcemap.devToolPluginOptions` path; EMP does not enable that plugin by default.
- CSS runtime and CJS side-effect changes are upstream runtime fixes; EMP keeps risky tree-shaking knobs opt-in through `build.rspack.experiments`.
```

Run:

```bash
git diff -- CHANGELOG.md
```

Expected:

```text
CHANGELOG.md mentions Rspack 2.1.1, Rsdoctor 1.5.17, and the three optimization conclusions.
```

- [ ] **Step 2: 验证 SourceMapDevToolPlugin 现有路径**

Run:

```bash
corepack pnpm --filter @empjs/cli run build
node packages/cli/test/rspack2-features-shape.test.mjs
```

Expected:

```text
Existing build.sourcemap.devToolPluginOptions path still passes.
No new EMP config is needed for SourceMapDevToolPlugin persistent cache unless this script fails or a real app build exposes a regression.
```

- [ ] **Step 3: 验证 CSS runtime guard 和 CJS side-effect 回滚覆盖面**

Run:

```bash
corepack pnpm test:apps:single
corepack pnpm test:library-output
```

Expected:

```text
Both commands exit 0.
If test:apps:single fails in CSS runtime, inspect apps/rspack2-optimization and vue/tailwind acceptance output before modifying CLI defaults.
If test:library-output fails in CJS or side-effect assertions, inspect @empjs/share and library fixture output before changing pureFunctions or treeshaking defaults.
```

- [ ] **Step 4: 保持高风险优化为显式 opt-in**

Run:

```bash
rg -n "pureFunctions|newTreeshaking|runtimeMode|SourceMapDevToolPlugin|rsdoctor" packages/cli/src packages/cli/test apps/rspack2-optimization
```

Expected:

```text
pureFunctions is only passed through when user config explicitly sets build.rspack.experiments.pureFunctions or parser.javascript.pureFunctions.
newTreeshaking remains an EMP debug flag and is not newly enabled by this upgrade.
SourceMapDevToolPlugin is only injected when build.sourcemap.devToolPluginOptions exists.
rsdoctor remains opt-in through --doctor or debug.rsdoctor.
```

- [ ] **Step 5: 提交优化判断文档和必要源码修复**

Run:

```bash
git add CHANGELOG.md
git add packages/cli/src/store/rspack/plugin.ts packages/cli/src/types/config.ts packages/cli/test/rspack2-features-shape.test.mjs
git diff --cached --check
git commit -m "docs: document rspack 2.1.1 optimization review"
```

Expected:

```text
If Step 2-4 do not require code changes, the commit contains only CHANGELOG.md.
If a compatibility fix was required, the commit also contains the smallest related source/test files.
```

---

### Task 4: 完整验证和发布准备

**Files:**
- Read: `package.json`
- Read: `scripts/release.mjs`
- Read: `scripts/release-core.mjs`
- Read: `.github/workflows/ci.yml`
- Read: `.github/workflows/publish.yml`

**Interfaces:**
- Consumes: Task 1-3 的依赖、测试、文档提交。
- Produces: 可交给用户确认的 release package：核心 diff、验证输出、目录边界、剩余风险。

- [ ] **Step 1: 重新检查工作区和 package 范围**

Run:

```bash
git status --short --branch
corepack pnpm release:check
```

Expected:

```text
git status only shows expected branch/ahead state and no unexpected unstaged files.
release:check reports internal @empjs/* packages under packages/** and does not select apps/** or website.
```

- [ ] **Step 2: 跑根验证入口**

Run:

```bash
corepack pnpm workflow:check
corepack pnpm ci:verify
```

Expected:

```text
Both commands exit 0.
workflow:check does not report forbidden docs/superpowers paths, workflow drift, or package boundary drift.
```

- [ ] **Step 3: 跑构建和验收入口**

Run:

```bash
corepack pnpm empbuild
corepack pnpm apps:acceptance
```

Expected:

```text
Both commands exit 0.
Existing CDN DefinePlugin warnings may appear only if they match prior known warnings and do not make the command fail.
```

- [ ] **Step 4: 跑 dry-run publish，不真实发包**

Run:

```bash
corepack pnpm release:publish:dry -- --skip-build --force-all
```

Expected:

```text
Dry run exits 0.
Selected packages are the internal release set only.
The command does not publish to npm and does not require NODE_AUTH_TOKEN.
```

- [ ] **Step 5: 最终 diff 检查**

Run:

```bash
git diff --check
git diff --stat origin/v4...HEAD
git status --short --branch
```

Expected:

```text
git diff --check exits 0.
diff stat contains only dependency, CLI test, optional minimal CLI fix, and CHANGELOG files.
status is clean after commits, or only shows user-owned files that were present before implementation.
```

- [ ] **Step 6: 输出 go/no-go 结论**

Final report must include:

```text
改动文件：
- packages/cli/package.json
- pnpm-lock.yaml
- packages/cli/test/rspack2-features-shape.test.mjs
- packages/cli/test/rsdoctor-plugin-shape.test.mjs
- CHANGELOG.md
- packages/cli/src/store/rspack/plugin.ts only if Rsdoctor smoke required a compatibility fix

验证：
- codegraph sync . && codegraph status .
- npm view version checks
- corepack pnpm --filter @empjs/cli test
- corepack pnpm test:apps:single
- corepack pnpm test:library-output
- corepack pnpm workflow:check
- corepack pnpm ci:verify
- corepack pnpm empbuild
- corepack pnpm apps:acceptance
- corepack pnpm release:publish:dry -- --skip-build --force-all
- git diff --check

优化结论：
- Required: dependency upgrade and smoke coverage.
- Not required by default: new public config for Rsdoctor export usage metadata.
- Not required by default: automatic SourceMapDevToolPlugin enablement.
- Not required by default: enabling pureFunctions or new tree-shaking behavior outside explicit user config.
```
