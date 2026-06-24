# EMP Agent Workflow

## 沟通与输出

- 默认使用中文沟通；说明、进度同步、评审意见与问题反馈均优先中文。
- 先给结果，再给必要依据；避免长篇铺垫。
- 任何发布、包管理、配置、脚本类任务，都必须说明真实验证结果和未覆盖边界。

## 仓库状态优先

- 开始任务前先确认 live checkout，不沿用历史 workflow 假设。
- 需要先检查：当前分支、`git status --short --branch`、`AGENTS.md`、`.codex/config.toml`、`codex mcp list` 中 `codebase-memory-mcp` 是否启用、`codebase-memory-mcp` 项目索引状态。
- 不要覆盖用户已有改动。遇到无关改动时保留；遇到相关改动时基于现状继续。

## codebase-memory-mcp 优先级

- 代码发现优先使用 codebase-memory-mcp：
  1. `search_graph`
  2. `trace_path`
  3. `get_code_snippet`
  4. `query_graph`
  5. `get_architecture`
- 项目未索引时，先通过 `codebase-memory-mcp cli index_repository '{"repo_path":"<repo-path>"}'` 建立索引，再继续代码发现。
- 如果 MCP 结果不足，或要查字符串、配置、脚本、文档，再退回 `rg`、`find`、`sed` 等本地工具。
- 使用 fallback 时要在进度或最终结果中说明原因。

## Superpowers 强制流程

- 只要任务有 1% 可能匹配某个 Superpowers skill，先读取并遵循对应 skill，再行动。
- 非平凡功能、脚本、发布、包管理、配置变更，默认遵循：
  1. `superpowers:writing-plans`：先写计划，保存到 `.superpowers/plans/YYYY-MM-DD-<topic>.md`。
  2. `superpowers:test-driven-development`：新增行为先写失败的真实验收/集成测试，再实现；不要用零散纯单测替代真实链路验证。
  3. `superpowers:executing-plans` 或 `superpowers:subagent-driven-development`：按计划执行并维护任务状态。
  4. `superpowers:verification-before-completion`：完成前做独立验证，不用“应该可以”代替结果。
- 简单文档或规范变更可以不创建完整计划，但仍要遵守读现状、最小改动、真实验证。

## 统一真实测试策略

- EMP 测试默认以真实验收/集成测试为主，覆盖真实 CLI、Rspack/Rslib 构建、Module Federation、运行时、示例 app、产物文件、HTTP 服务和浏览器行为；不要为了覆盖率新增只验证内部函数的纯单测。
- 新增或重构测试时优先使用 `rstest` 作为测试组织和执行入口；不要再引入 Vitest、Jest、Mocha、Ava 等第二套 runner。
- 历史 `node:test` / `node *.test.mjs` 用例只能作为待迁移遗留存在；除迁移旧用例外，不要继续扩展新的 `node:test` 风格测试文件。
- 需要浏览器能力时，在统一测试体系内接入 Playwright 或 Rstest browser 能力；不要单独散落一套不可复用的浏览器脚本。
- 边界问题必须转化为可重复的真实场景：最少包含输入项目或 fixture、实际运行命令、产物/页面/接口断言和失败时的错误输出；不能只断言 helper 函数返回值。
- 测试命令应统一收敛到根脚本，例如 `test:cli`、`test:packages`、`test:rules`、`ci:verify`；包内脚本可以存在，但必须被根入口编排，不要形成各自独立的测试体系。
- 新增测试依赖、脚本或目录前，先检查是否能纳入现有真实测试矩阵；如果必须新增能力，需要在计划或 PR 说明中写清楚为什么不能复用现有入口。
- 发布和回归验证优先跑真实测试矩阵；只有脚本规则、release metadata、package 范围这类不依赖运行时的检查，才允许保留轻量规则测试作为补充。

## 自动化运行规则

- 根脚本 `pnpm ci:verify` 是默认本地和 CI 验证入口，必须串联现有 CLI、package、rules、release 和 Rslib preset 检查。
- PR / push CI 必须至少运行 `pnpm ci:verify` 和 `pnpm empbuild`；CI workflow 只做验证，不配置 npm publish 权限或 token。
- 修改测试、测试配置、测试目录或 package 测试脚本时，至少运行相关测试脚本和 `pnpm ci:verify`。
- 修改 release 自动化、发布 workflow、package 范围或版本规则时，至少运行 `pnpm test:rules`、`pnpm release:check` 和 `pnpm ci:verify`。
- 修改构建链路、包源码、Rslib/Rspack 配置或 workspace 依赖时，至少运行 `pnpm empbuild`；如果未运行，最终回复必须说明原因和风险。
- 修改 GitHub Actions、AGENTS 或自动化脚本时，至少运行 `git diff --check`，并确认 CI workflow 没有误引入 `NODE_AUTH_TOKEN`、`npm publish` 或 `release:publish`。

## 计划文档格式

- Superpowers 相关计划、执行记录、评审记录等工作产物统一放在 `.superpowers/` 下。
- 禁止新建或继续使用 `docs/superpowers/`；历史文档如果需要迁移，必须移动到 `.superpowers/` 对应子目录。
- 计划文件必须包含：
  - `Goal`
  - `Architecture`
  - `Tech Stack`
  - `Global Constraints`
  - 按 Task 拆分的文件清单、接口、步骤和验证命令
- 每个 Task 应是可独立验证的交付物。
- 不写 `TBD`、`TODO`、`后续补充` 这类占位内容。

## EMP 发布与包管理约束

- 包管理默认使用 `pnpm@10.33.0`，遵守根 `packageManager` 与 `engines`。
- `packages/**` 是发布包主范围；`projects/**` 和 `website` 默认视为示例或站点，不进入自动发布。
- 内部统一版本优先覆盖 v4 核心包：`@empjs/cli`、`@empjs/chain`、`@empjs/share`、`@empjs/plugin-*`、`@empjs/bridge-*`、`@empjs/adapter-*`、`@empjs/polyfill`、配置包。
- `@empjs/cdn-*`、`@empjs/lib-*` 这类 CDN / legacy runtime 包默认保持独立版本线，除非用户明确要求纳入统一版本。
- 发布脚本必须支持 dry-run，并且真实 publish 必须有显式确认参数。
- changelog 需要说明版本、发布时间、发布范围、主要变更和验证命令。

## 验证与交付

- 完成前至少运行与改动相关的最小验证命令。
- 发布自动化变更至少验证：
  - package 范围不会包含 `projects/**`、`website`
  - dry-run publish 命令不会真实发包
  - changelog 生成或更新结果可复现
- 最终回复要包含：改动文件、验证命令与结果、遗留风险或未执行项。
