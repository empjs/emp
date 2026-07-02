# Goal

补齐 EMP 插件包真实测试覆盖，把缺少包内测试的插件纳入根级 Rstest 验证链路，并让 `ci:verify` 通过 `test:packages` 自动执行插件配置回归。

# Architecture

新增一个根级 `plugins` Rstest target，集中运行真实插件 `rsConfig`，使用真实 `@empjs/chain` 配置对象断言最终 Rspack 配置形态。测试入口由 `scripts/root-test-targets.mjs` 管理，根 `package.json` 增加 `test:plugins`，并接入 `test:packages`，避免各插件散落独立 runner。

# Tech Stack

- `rstest`：统一测试执行入口。
- `@empjs/chain`：构造真实 chain 配置对象。
- `pnpm@10.33.0`：根脚本编排。
- 插件 dist 包：测试前先构建 `@empjs/chain` 和 `@empjs/plugin-*`，再导入产物执行。

# Global Constraints

- 默认中文沟通，最终说明真实验证结果和未覆盖边界。
- 不修改 `apps/**`、`website`、`packages/cdn-*`、`packages/lib-*`。
- 不引入 Vitest/Jest/Mocha/Ava，不新增 `node:test` 风格用例。
- 只修改本任务直接相关的测试、脚本和计划文件。
- 不提交、不 push，除非用户后续明确要求。

# Task 1 - Root Plugin Test Entry

Files:

- `package.json`
- `scripts/root-test-targets.mjs`
- `test/toolchain.rules.test.ts`

Steps:

1. 增加 `test:plugins` 根脚本，先构建 `@empjs/chain` 和 `@empjs/plugin-*`，再运行 `node scripts/run-root-test.mjs plugins`。
2. 把 `plugins` target 加入 `ROOT_TEST_TARGETS`，让根测试文件登记规则能覆盖新用例。
3. 把 `test:plugins` 接入 `test:packages`，确保 `ci:verify` 间接执行。
4. 更新工具链规则测试中的根脚本顺序断言。

Validation:

- `corepack pnpm test:toolchain`
- `corepack pnpm workflow:check`

# Task 2 - Plugin Config Shape Coverage

Files:

- `test/plugin-config-shape.test.ts`

Steps:

1. 创建最小真实 store fixture：真实 `Chain`、css/sass/less/js/ts/svg 等规则、`definePlugin`、项目 root 和 build 配置。
2. 覆盖 `plugin-lightningcss` 的 transform、PostCSS 保留/删除和 minify 注册。
3. 覆盖 `plugin-postcss` 的 css/sass/less loader 注入和 options 传递。
4. 覆盖 `plugin-stylus` 的 `.styl` 规则、loader 顺序和 stylus options。
5. 覆盖 `plugin-tailwindcss` 的 css rule、`@tailwindcss/webpack` loader 和 base/optimize options。
6. 覆盖 `plugin-vue2`、`plugin-vue3` 的 `.vue`、tsx/jsx、svg 和核心 plugin/alias/define 配置形态。

Validation:

- `corepack pnpm test:plugins`

# Task 3 - Full Verification

Files:

- All changed files from Task 1 and Task 2.

Steps:

1. 运行相关局部验证。
2. 运行 `corepack pnpm test:packages`，确认插件测试被包测试入口包含。
3. 运行 `corepack pnpm ci:verify`，确认 CI 主入口仍通过。
4. 运行 `git diff --check`，确认无空白错误。

Validation:

- `corepack pnpm test:plugins`
- `corepack pnpm test:packages`
- `corepack pnpm ci:verify`
- `git diff --check`
