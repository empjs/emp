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
  2. `superpowers:test-driven-development`：新增行为先写失败测试，再实现。
  3. `superpowers:executing-plans` 或 `superpowers:subagent-driven-development`：按计划执行并维护任务状态。
  4. `superpowers:verification-before-completion`：完成前做独立验证，不用“应该可以”代替结果。
- 简单文档或规范变更可以不创建完整计划，但仍要遵守读现状、最小改动、真实验证。

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
