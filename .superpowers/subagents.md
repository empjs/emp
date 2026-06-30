# Superpowers Subagent 调用规则

本文是本仓库的 Superpowers 项目级 subagent 调用规则。它用于约束所有 `.superpowers/plans/` 下的执行计划；具体任务的业务约束仍以对应 plan/spec 为准。

## 调用入口

- 多步骤计划执行默认使用 `superpowers:subagent-driven-development`。
- 只有任务可以拆成互不共享写入状态、互不依赖顺序的独立问题域时，才并行派发 subagent。
- 探索性调试、跨包架构判断、公共 API 取舍和最终执行取舍由 Codex 主控制器保留。
- 如果当前执行者本身是被派发的 subagent，只执行 brief 指定任务，不再递归启动全局 Superpowers 流程。

## 模型分工

- Codex 主控制器：任务拆分、上下文裁剪、冲突裁决、review gate、最终合并判断。
- `gpt-5.4-mini`：边界明确但需要代码理解的小型实现、局部 bugfix、任务级审阅。
- `gpt-5.3-codex-spark`：机械修改、检索、命令执行、文档同步、重复性验证。
- 轻量 subagent 不负责迁移方向、依赖入口选择、ESM-only / CJS 兼容取舍、跨包 API 取舍和最终整体验收。

## Brief 要求

- 每个 subagent 必须拿到独立 brief，不继承主会话历史。
- brief 必须写清模型、目标、修改范围、禁止项、输入文件、输出文件、验证命令和预期结果。
- brief 必须包含绑定该任务的 global constraints；这些约束从对应 plan/spec 复制，不从会话总结推断。
- 遇到 API 选型、范围扩大、约束冲突或无法验证的情况，subagent 必须返回 `NEEDS_CONTEXT` 或 `BLOCKED`，不能自行扩大任务。

## Review Gate

- 每个实现任务完成后必须生成 review package，再派 task reviewer。
- Reviewer 输入包括 brief、implementer report、review package，以及绑定该任务的 global constraints。
- Reviewer 同时检查 spec compliance、代码质量、越界修改和测试证据。
- 主控制器必须复核 reviewer 结论和关键 diff，不能只信 subagent 报告。

## 执行产物

- 长期计划放在 `.superpowers/plans/`。
- 长期设计和约束依据放在 `.superpowers/specs/`。
- 执行期 brief、report、review diff、progress ledger 放在 `.superpowers/sdd/`。
