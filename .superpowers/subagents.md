# Superpowers Subagent 调用规则

本文是本仓库的 Superpowers 项目级 subagent 调用规则。它用于约束所有 `.superpowers/plans/` 下的执行计划；具体任务的业务约束仍以对应 plan/spec 为准。

## 调用入口

- Codex 不会自动加载本文件；它必须通过 `AGENTS.md`、`skills/emp-workflow/SKILL.md`、`.codex/hooks.json` 或具体 plan 头部触发。
- 多步骤计划执行默认使用 `superpowers:subagent-driven-development`。
- 只有任务可以拆成互不共享写入状态、互不依赖顺序的独立问题域时，才并行派发 subagent。
- 探索性调试、跨包架构判断、公共 API 取舍和最终执行取舍由 Codex 主控制器保留。
- 如果当前执行者本身是被派发的 subagent，只执行 brief 指定任务，不再递归启动全局 Superpowers 流程。

## Codex 触发入口

- 启动或恢复会话时，由 `.codex/hooks.json` 提醒主控制器读取本文件。
- 用户提到 subagent、子代理、派发、计划执行或 `.superpowers/plans/` 时，先读取本文件和 `.codex/agents/emp-*.toml`，再选择 `superpowers:subagent-driven-development` 或 `superpowers:executing-plans`。
- 如果当前 Codex 会话没有 `spawn_agent` / `wait_agent` / `close_agent` 工具，使用 `tool_search` 加载 multi-agent 工具；仍不可用时回退到 inline execution，并在最终说明降级原因。

## 模型分工

- Codex 主控制器：任务拆分、上下文裁剪、冲突裁决、review gate、最终合并判断。
- `emp-fast` / `gpt-5.3-codex-spark`：CodeGraph 查询、检索、机械文档/配置同步、重复性验证。
- `emp-impl` / `gpt-5.4-mini`：边界明确但需要代码理解的小型实现、局部 bugfix、任务级审阅。
- `emp-deep` / `gpt-5.4`：架构判断、发布风险、依赖策略、跨包契约、最终 review。
- 轻量 subagent 不负责迁移方向、依赖入口选择、ESM-only / CJS 兼容取舍、跨包 API 取舍和最终整体验收。

## 实际派发方式

- `.codex/agents/emp-*.toml` 是本仓库语义 profile；如果当前运行时直接支持这些 profile，优先使用对应 profile。
- 如果 `spawn_agent` 只暴露通用 `agent_type`，在 brief 第一行写明 `Profile: emp-fast|emp-impl|emp-deep`，并按下列方式映射：
  - `emp-fast`：读代码用 `agent_type: explorer`；机械文档/配置同步用 `agent_type: documentation-engineer`；验证脚本用 `agent_type: test-automator`。
  - `emp-impl`：用 `agent_type: worker`，并显式设置 `model: gpt-5.4-mini`、`reasoning_effort: high`；必须给出不重叠的写入范围。
  - `emp-deep`：架构/发布/依赖/最终审阅用 `agent_type: code-reviewer` 或 `workflow-orchestrator`；保持只读，除非父任务明确给修复范围。
- 不能因为存在 profile 就派发 subagent；仍需满足“派发决策”的独立性和非阻塞条件。

## 派发决策

- 派发前先判断关键路径：主控制器保留当前被阻塞的下一步，subagent 只处理可并行、不共享写入状态的侧路任务。
- 同一文件或同一 package 的实现不要并行派发；先本地拆小或串行执行。
- 探索、实现、审阅可以分离派发，但实现和审阅不能由同一个 subagent 自审代替。
- 每次派发必须写清使用角色：`emp-fast`、`emp-impl` 或 `emp-deep`，并说明为什么不是更强模型。

## Brief 要求

- 每个 subagent 必须拿到独立 brief，不继承主会话历史。
- brief 必须写清模型、目标、修改范围、禁止项、输入文件、输出文件、验证命令和预期结果。
- brief 必须包含绑定该任务的 global constraints；这些约束从对应 plan/spec 复制，不从会话总结推断。
- 遇到 API 选型、范围扩大、约束冲突或无法验证的情况，subagent 必须返回 `NEEDS_CONTEXT` 或 `BLOCKED`，不能自行扩大任务。

### Brief Template

```text
Profile: emp-fast|emp-impl|emp-deep
Runtime: agent_type=<role>, model=<model if overridden>, reasoning_effort=<effort if overridden>
Goal: <one bounded outcome>
Scope: <owned files/directories>
Inputs: <files, commands, plan/spec sections>
Do Not Touch: <protected paths and unrelated dirty files>
Validation: <exact commands and expected result>
Return: <changed files, commands, evidence, NEEDS_CONTEXT/BLOCKED conditions>
```

## Review Gate

- 每个实现任务完成后必须生成 review package，再派 task reviewer。
- Reviewer 输入包括 brief、implementer report、review package，以及绑定该任务的 global constraints。
- Reviewer 同时检查 spec compliance、代码质量、越界修改和测试证据。
- 主控制器必须复核 reviewer 结论和关键 diff，不能只信 subagent 报告。

### Review Package Template

```text
Scope: <intended files and protected directories not touched>
Diff Summary: <behavioral changes>
Validation: <exact commands and outcomes>
Risk: <remaining uncertainty or skipped verification>
Reviewer Ask: <specific questions for reviewer>
```

## 执行产物

- 长期计划放在 `.superpowers/plans/`。
- 长期设计和约束依据放在 `.superpowers/specs/`。
- 执行期 brief、report、review diff、progress ledger 放在 `.superpowers/sdd/`。
