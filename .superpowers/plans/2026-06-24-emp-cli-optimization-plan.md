# EMP CLI 整体优化计划

> 面向执行代理的要求：本计划必须按任务逐项推进。执行时优先使用 `superpowers:executing-plans`，涉及新增行为时遵循 `superpowers:test-driven-development`，完成前必须使用 `superpowers:verification-before-completion` 做独立验证。

## Goal

让 `@empjs/cli` v4 alpha 具备更稳定的发布基础和更低的维护成本，重点解决 Node 目标版本漂移、CLI 参数类型缺失、帮助信息冲突、配置文件发现和重载不完整、build 失败不可靠、生命周期顺序不清晰、SIGINT 清理分散、测试入口缺失、README 与当前行为不一致等问题。

## Architecture

- CLI 入口仍以 `packages/cli/src/script/index.ts` 为中心，保持 `BaseScript -> store.setup -> RspackStore -> command run()` 的既有调用链。
- 参数解析收敛到 `packages/cli/src/script/options.ts`，避免 `dev`、`build`、`serve` 重复注册通用参数。
- `CliOptionsType` 从 `any` 改为显式类型，减少调用方误用。
- 配置文件发现统一由 `packages/cli/src/helper/loadConfig.ts` 暴露，`getEmpConfigPath()` 和 `dev` watcher 共用同一组候选文件。
- build 命令把 rspack callback 包成 Promise，确保错误、空 stats、stats errors 都能传递到非零退出码。
- 生命周期保留错误拼写的 `afterBulid()` 兼容入口，同时新增正确拼写 `afterBuild()`。
- dev server 与配置 watcher 都挂到 `BaseScript` 的关闭钩子，SIGINT 和配置重载复用同一套清理机制。
- 测试使用 Node 内置 `assert` 和仓库已有构建能力，不引入新测试框架。

## Tech Stack

- TypeScript
- ESM
- `commander`
- `@rslib/core`
- `@rspack/core`
- `@rspack/dev-server`
- Node.js built-in `assert` / `child_process`
- `pnpm@10.33.0`

## Global Constraints（硬性约束）

- 语言是硬性要求：计划文档、执行记录、评审反馈、用户可见文档、README 修改、验证结论、最终交付总结默认必须使用中文。
- 工程标识符保持原样：代码标识符、包名、命令示例、文件路径、导出 API 名称、依赖名、环境变量和既有上游错误字符串不强行翻译。
- 包管理器基线必须遵守根 `packageManager` 和 `engines.pnpm`，当前为 `pnpm@10.33.0`、`10.x`。
- Node 运行时基线必须遵守根 `engines.node`：`^20.19.0 || >=22.12.0`。
- 代码发现优先使用 `codebase-memory-mcp`；字符串、配置、脚本、文档检索可退回 `rg`、`sed` 等本地工具。
- 不覆盖用户已有改动；遇到无关 dirty worktree 改动只保留，遇到相关改动必须基于当前内容继续。
- 发布包默认范围是 `packages/**`；`projects/**` 和 `website` 默认视为示例或站点，不进入自动发布范围。
- Superpowers 计划、执行记录、评审记录等产物统一放在 `.superpowers/` 下，禁止新建或继续使用 `docs/superpowers/`。
- 所有发布、包管理、配置、脚本类变更必须说明真实验证结果和未覆盖边界。
- 每个任务必须可以独立验证，且验证命令必须真实执行后再标记完成。

## 执行规则

- 先写失败测试，再改实现；如果只是文档或依赖分类调整，也必须先说明可验证的预期行为。
- 每个任务只修改与目标直接相关的文件，禁止顺手重构无关模块。
- `packages/cli/test/*.mjs` 只做轻量行为验证，不引入 Jest、Vitest 等新框架。
- 修改 CLI 帮助、错误、README、计划和最终总结时，面向人的说明使用中文；命令、参数名、包名保持原样。
- 对兼容性变更必须保留向后兼容入口；无法兼容时必须在计划和最终总结中明确说明。
- 构建、测试、CLI 实际命令至少各跑一次；不能用“应该可以”代替验证结果。
- 提交前必须运行 `git diff --check`，确认没有空白错误。
- 推送前必须确认当前分支和远端关系，禁止无明确授权的 force push。

## 当前证据快照

- 工作目录：`/Users/Bigo/Desktop/develop/fontend-workspace/emp`
- 当前分支：`v4...origin/v4`
- `.codex/config.toml`：当前 checkout 未发现。
- `codebase-memory-mcp` 项目：`Users-Bigo-Desktop-develop-fontend-workspace-emp`，状态为 `ready`。
- 既有 CLI 测试入口：`packages/cli/test/rspack-config-shape.test.mjs`。
- 本次新增计划文件：`.superpowers/plans/2026-06-24-emp-cli-optimization-plan.md`。

## Task 1：修正 Node 构建目标漂移

**状态：已完成**

**文件清单：**

- 修改：`packages/cli/rslib.config.ts`
- 修改：`packages/cli/package.json`
- 新增：`packages/cli/test/rslib-node-target.test.mjs`

**接口和行为：**

- 消费：根 `package.json` 的 `engines.node`。
- 产出：当 `packages/cli/rslib.config.ts` 的语法目标高于 Node 20.19.0 时，测试失败。

**实施步骤：**

1. 新增 `rslib-node-target.test.mjs`，断言根 Node engine 仍为 `^20.19.0 || >=22.12.0`。
2. 断言 Rslib 语法目标包含 `node >= 20.19.0`，且不再固定为 `node >= 22.12.0`。
3. 将 `node22Syntax` 调整为 `nodeSyntax`。
4. 把该测试接入 `@empjs/cli` 的 package-local `test` script。

**验证命令：**

```bash
node packages/cli/test/rslib-node-target.test.mjs
pnpm --filter @empjs/cli test
```

**结果：通过。**

## Task 2：收敛 CLI 参数类型和命令表面

**状态：已完成**

**文件清单：**

- 修改：`packages/cli/src/types/env.ts`
- 新增：`packages/cli/src/script/options.ts`
- 修改：`packages/cli/src/script/index.ts`
- 修改：`packages/cli/src/store/index.ts`
- 新增：`packages/cli/test/cli-options.test.mjs`
- 新增：`packages/cli/test/cli-help.test.mjs`
- 修改：`packages/cli/package.json`

**接口和行为：**

- 产出：`CliOptionsType`、`EnvVarsType`、`collectEnvVar()`、`parseBooleanOption()`、`normalizeCliOptions()`、`registerCommonOptions()`、`registerEnvOption()`、`registerUnsupportedCommand()`。
- `dev --hot` 的短参数从 `-h` 改为 `-H`，把 `-h` 还给 `--help`。
- `dts`、`init` 作为隐藏的未实现命令保留，执行时给出明确错误并返回非零退出码。
- `--env-vars` 支持重复传入 `key=value`，无效格式给出中文错误。

**实施步骤：**

1. 新增 `cli-options.test.mjs`，覆盖 env var 解析、布尔参数解析和 option normalize。
2. 新增 `cli-help.test.mjs`，覆盖 `-H, --hot`、`-h, --help` 和中文 help 文案。
3. 新增 `options.ts` 承载参数解析和 commander 注册逻辑。
4. `index.ts` 复用共享 helper，移除重复参数注册。
5. `store.cliOptions` 改为显式 `CliOptionsType`。

**验证命令：**

```bash
node packages/cli/test/cli-options.test.mjs
pnpm --filter @empjs/cli build
node packages/cli/test/cli-help.test.mjs
node packages/cli/bin/emp.js dev --help
```

**结果：通过。**

## Task 3：统一配置发现和 dev 重载范围

**状态：已完成**

**文件清单：**

- 修改：`packages/cli/src/helper/loadConfig.ts`
- 修改：`packages/cli/src/store/empConfig.ts`
- 修改：`packages/cli/src/script/dev.ts`
- 新增：`packages/cli/test/config-file-discovery.test.mjs`

**接口和行为：**

- 产出：`DEFAULT_CONFIG_FILES` 和 `getEmpConfigCandidatePaths(root)`。
- `getEmpConfigPath()` 和 `dev` watcher 共用同一组候选配置文件。
- 支持 `emp-config.*` 与 `emp.config.*` 的 ts/js/mjs/cjs/mts/cts 变体。
- `logger.timeEnd()` 进入 `finally`，避免异常路径计时不结束。
- 无配置文件时保持空配置行为。

**实施步骤：**

1. 新增 `config-file-discovery.test.mjs`，验证候选文件集合和路径解析。
2. 将配置文件列表提升为常量。
3. `getEmpConfigPath()` 改为并发 access 候选文件并在 `finally` 结束计时。
4. `EmpConfig.syncEmpOptions()` 对无配置和异常路径都保持可观测日志。
5. `dev` watcher 使用候选文件列表，不再只监听 `emp.config.ts`。

**验证命令：**

```bash
node packages/cli/test/config-file-discovery.test.mjs
pnpm --filter @empjs/cli test
```

**结果：通过。**

## Task 4：修复 build/watch 失败传播和 serve 等待

**状态：已完成**

**文件清单：**

- 修改：`packages/cli/src/script/build.ts`
- 修改：`packages/cli/src/store/lifeCycle.ts`
- 新增：`packages/cli/test/build-watch-shape.test.mjs`

**接口和行为：**

- watch 模式必须显式设置 `rspackConfig.watch = true`。
- watch 模式合并 `optimization`，不因原始配置为空而跳过 watch 设置。
- rspack callback 中的 `err`、空 `stats`、`stats.hasErrors()` 必须 reject，并设置 `process.exitCode = 1`。
- `--serve` 启动必须被 `await`。
- 构建完成后调用正确拼写的 `afterBuild()`，同时保留 `afterBulid()` 兼容入口。

**实施步骤：**

1. 新增 `build-watch-shape.test.mjs`，用源码结构保护 watch 和错误传播逻辑。
2. `BuildScript.run()` 用 Promise 包裹 rspack callback。
3. 修正 `afterBulid()` 调用为 `afterBuild()`。
4. 在 `LifeCycle` 中新增 `afterBuild()`，并保留 `afterBulid()` 调用路径。

**验证命令：**

```bash
node packages/cli/test/build-watch-shape.test.mjs
pnpm --filter @empjs/cli build
pnpm --filter @empjs/cli test
```

**结果：通过。**

## Task 5：整理生命周期顺序和关闭清理

**状态：已完成**

**文件清单：**

- 修改：`packages/cli/src/store/rspack/plugin.ts`
- 修改：`packages/cli/src/script/base.ts`
- 修改：`packages/cli/src/script/dev.ts`
- 新增：`packages/cli/test/lifecycle-order.test.mjs`

**接口和行为：**

- `beforePlugin()` 必须在内置插件 mutation 之前执行。
- 内置插件按顺序执行，避免提前构造 Promise 导致生命周期顺序不确定。
- `afterPlugin()` 在内置插件执行完之后执行。
- SIGINT 只注册一次。
- dev server compiler watcher 和配置 watcher 都进入统一 close hook。
- 配置变更重启时先清理旧 watcher，再启动 server 并重新注册配置 watcher。

**实施步骤：**

1. 新增 `lifecycle-order.test.mjs`，保护插件顺序、SIGINT 注册和 dev 清理结构。
2. `RspackPlugin.setup()` 改为顺序 `await` 内置插件方法。
3. `BaseScript` 增加 `addCloseHook()` 和 `executeCloseHooks()`。
4. `DevScript` 移除本地重复 close hook 实现，复用 `BaseScript`。
5. 配置 watcher 关闭后重新注册，避免只响应一次配置变更。

**验证命令：**

```bash
node packages/cli/test/lifecycle-order.test.mjs
pnpm --filter @empjs/cli test
```

**结果：通过。**

## Task 6：更新文档、根脚本和依赖分类

**状态：已完成**

**文件清单：**

- 修改：`packages/cli/README.md`
- 修改：`package.json`
- 修改：`packages/cli/package.json`
- 修改：`pnpm-lock.yaml`

**接口和行为：**

- README 的 pnpm 要求与仓库根 `packageManager` 对齐。
- README 补充 `dev --hot`、`dev --env-vars`、`build --watch`、`build --watch --serve` 示例。
- 根脚本新增 `test:cli`，用于一条命令验证 CLI。
- `@vue/tsconfig` 从 dependencies 移到 devDependencies。
- `typescript-plugin-css-modules` 保留在 dependencies，因为导出的 `tsconfig/base.json` 和 README 仍消费它。

**实施步骤：**

1. 更新 `packages/cli/README.md`。
2. 根 `package.json` 新增 `test:cli`。
3. 调整 `packages/cli/package.json` 依赖分类。
4. 执行 `pnpm install --lockfile-only` 更新 lockfile。

**验证命令：**

```bash
pnpm install --lockfile-only
pnpm test:cli
pnpm --filter @empjs/cli build
```

**结果：通过。**

## 最终验证清单

已执行并通过：

```bash
pnpm --filter @empjs/cli test
pnpm test:cli
pnpm --filter @empjs/cli build
node packages/cli/bin/emp.js --version
node packages/cli/bin/emp.js dev --help
node packages/cli/test/rspack-config-shape.test.mjs
git diff --check
```

实际输出要点：

- `node packages/cli/bin/emp.js --version` 输出 `4.0.0-alpha.2`。
- `node packages/cli/bin/emp.js dev --help` 输出 `-H, --hot` 和 `-h, --help                   显示帮助`。
- `pnpm install --lockfile-only` 成功，保留上游已有 deprecated / peer warning，不影响本次 CLI 验证。

## 未覆盖边界

- 未启动真实 `emp dev` 长驻服务做人工热更新联调；本次用源码结构测试和 CLI 构建验证覆盖 watcher 注册与重载路径。
- 未执行真实 npm publish；本次变更只覆盖 CLI 行为、文档和测试入口，不触发发布。
- 未修改 `projects/**`、`website` 或其他示例站点。

## 提交和推送规则

- 提交前必须确认 `git status --short --branch` 只包含本计划范围内文件。
- 提交信息使用中文或清晰英文均可，必须能表达 CLI 优化主题。
- 推送目标为当前分支 `v4`。
- 禁止 force push，除非用户后续明确授权。
