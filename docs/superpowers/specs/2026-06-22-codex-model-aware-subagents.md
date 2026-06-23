# Codex 模型感知子 agent 分工

## 适用范围

本文用于执行 `2026-06-22-rspack-2-v4-upgrade-design.md` 中的 EMP v4 / Rspack 2 升级计划。它定义 Codex 主控制器、`gpt-5.4-mini`、`gpt-5.3-codex-spark` 在同一会话内的子 agent 分工，不替代升级设计本身。

执行边界：

- 以 Codex 主控制器做任务拆分、上下文裁剪、冲突裁决、review gate 和最终合并判断。
- `gpt-5.4-mini` 用于边界明确但需要代码理解的小型实现和任务级审阅。
- `gpt-5.3-codex-spark` 用于机械修改、检索、测试执行、文档同步和重复性验证。
- 不把架构裁决、跨包 API 取舍、最终整体验收下放给轻量子 agent。

## 模型特征与角色

| 角色 | 推荐模型 | 适合任务 | 不适合任务 |
| --- | --- | --- | --- |
| Codex 主控制器 | 当前主会话模型 | 规划、拆任务、生成 brief、裁决 review 分歧、确认 fallback、最终合并判断 | 长时间机械检索、重复运行验证矩阵 |
| 任务 implementer | `gpt-5.4-mini` | 2-5 个文件内的局部实现、已有模式迁移、清晰 adapter、局部 bugfix | 未决 API 选型、跨包架构重排、最终整体验收 |
| 机械 implementer | `gpt-5.3-codex-spark` | package manifest 字段更新、文档同步、命令执行、检索列表、固定格式改动 | 需要推断设计意图的实现、复杂失败诊断、公共 API 兼容判断 |
| 任务 reviewer | `gpt-5.4-mini` | 小到中等 diff 的 spec 合规和代码质量审阅 | 全分支设计审阅、迁移方向裁决 |
| 验证 runner | `gpt-5.3-codex-spark` | 按 brief 运行 `pnpm list`、build、兼容性命令并记录原始结果 | 根据失败结果重设迁移策略 |
| fix agent | 按问题复杂度选择 | 机械遗漏用 spark；局部逻辑缺陷用 mini | 同时修多个互相耦合的架构问题 |

## EMP v4 迁移阶段派工

### 1. 预检与事实采集

- 派给 `gpt-5.3-codex-spark`：读取 package 声明、lockfile、实际安装树，输出 Node、pnpm、Rspack、Module Federation 当前状态。
- 主控制器保留：判断声明、lockfile、`node_modules` 不一致时以哪个事实为准，以及是否需要先同步依赖。
- 任务输出必须包含可复跑命令和原始摘要，不能只写结论。

### 2. Node 22 / pnpm 10 / v4 package 元数据

- 派给 `gpt-5.3-codex-spark`：按 brief 修改 `engines`、`packageManager`、明显的版本字段和相关文档。
- 派给 `gpt-5.4-mini` 审阅：确认没有误改非发布包、没有把 v4 写进不该发布的示例项目。
- 主控制器保留：确认哪些包属于 v4 发布面。

### 3. `@empjs/cli` Rspack 2 依赖迁移

- 派给 `gpt-5.4-mini`：更新 `@rspack/core`、`@rspack/dev-server`、React refresh 相关依赖，并根据现有 CLI 代码做最小兼容修正。
- 派给 `gpt-5.3-codex-spark`：运行 `pnpm list` 和 CLI 相关 build 命令，收集失败输出。
- 主控制器保留：判断 peer warning 是否可接受，以及是否扩大依赖更新范围。

### 4. `@empjs/share` Module Federation 2.x 迁移

- 派给 `gpt-5.4-mini`：在主控制器明确选定 `@module-federation/rspack` 后，实现最小 adapter 或导入替换。
- 派给 `gpt-5.3-codex-spark`：检索旧 fork 包引用、运行 `@empjs/share` build、记录 manifest / dts / runtime plugin 验证结果。
- 主控制器保留：是否从 `@module-federation/rspack` 切换到 `@module-federation/enhanced/rspack`，以及用户侧 `pluginRspackEmpShare(...)` API 是否保持不变。

### 5. Runtime plugin 路径解析

- 派给 `gpt-5.4-mini`：实现集中式 `resolvePackageExport(...)` 或等价 helper，处理 `import.meta.resolve(...)` 与 `file://` 到文件路径的归一。
- 派给 `gpt-5.3-codex-spark`：定位散落的 `require.resolve(...)` 热点并生成清单。
- 主控制器保留：决定哪些 `require.resolve(...)` 在 v4 可保留，避免把 ESM-first 误推成 ESM-only。

### 6. ESM-first / CJS 兼容面保护

- 派给 `gpt-5.4-mini`：局部修复 ESM 输出和 CJS require 入口的兼容问题。
- 派给 `gpt-5.3-codex-spark`：运行 ESM import 与 CJS require 兼容性命令，记录结果。
- 主控制器保留：任何删除 `exports.require`、`.cjs`、`.d.cts` 或 `@empjs/chain` require 机制的提议都必须拦截。

### 7. 示例矩阵与文档同步

- 派给 `gpt-5.3-codex-spark`：运行 `mf-host`、`mf-app`、`rtHost`、`rtProvider` 构建矩阵，更新命令结果类文档。
- 派给 `gpt-5.4-mini`：处理单个示例的局部兼容修复。
- 主控制器保留：判断失败是迁移缺陷、示例陈旧，还是环境问题。

## SDD 执行规则

- 每个实现任务都先生成单独 brief；brief 只包含该任务的要求、写入范围、验证命令和禁止项。
- 子 agent 不继承主会话历史，除非任务明确需要；优先通过文件路径交接上下文。
- 实现 agent 必须写 report，返回状态、变更文件、测试命令和结果。
- 每个任务完成后必须生成 diff package，再派 task reviewer。
- task reviewer 同时给出 spec compliance 和 quality verdict；两者任一不通过，都不能进入下一任务。
- final whole-branch review 不使用 `gpt-5.3-codex-spark`；如只在主控制器和两个轻量模型中选择，由主控制器自己完成最终裁决。

## Review Gate

| Gate | 主责 | 进入条件 | 退出条件 |
| --- | --- | --- | --- |
| Gate-0 计划门禁 | Codex 主控制器 | 任务 brief 已生成，目标、非目标、回滚边界明确 | Node 22、pnpm 10、Rspack 2、MF 2.x、ESM-first not ESM-only 的约束全部写入 brief |
| Gate-1 依赖门禁 | `gpt-5.3-codex-spark` 执行，主控制器判定 | package manifest、lockfile、实际安装树完成核对 | `@rspack/*` 与 `@module-federation/*` 处于目标版本线，且 `@empjs/module-federation-rspack` 移除事实被验证 |
| Gate-2 兼容门禁 | `gpt-5.4-mini` 修复，`gpt-5.3-codex-spark` 验证 | 核心包和示例构建命令已明确 | `@empjs/chain`、`@empjs/cli`、`@empjs/share`、`@empjs/plugin-react` 构建通过，示例矩阵通过，ESM import 与 CJS require 均可用 |
| Gate-3 风险门禁 | Codex 主控制器 | reviewer 无 Critical / Important 未解决项 | 变更可回滚到 manifest、lockfile、最小 adapter 范围内，残留风险有明确结论 |
| Go / No-Go | Codex 主控制器 | Gate-0 到 Gate-3 证据齐全 | 只有主控制器能给最终合并或暂停结论；spark 和 mini 只提交证据包 |

## 禁止下放的任务

- Rspack 2 与 Module Federation 2.x 的最终依赖入口选择。
- `@module-federation/rspack` 与 `@module-federation/enhanced/rspack` 的切换判断。
- 把 EMP v4 定义为 ESM-only 的任何改动。
- 删除 CJS exports、CJS 构建产物或 `@empjs/chain` 基于 `require` 的插件序列化机制。
- 扩大迁移范围到整个 monorepo 重构。
- 在 package 声明、lockfile、实际安装树不一致时直接提交依赖结论。

## 推荐派工模板

实现类：

```text
Model: gpt-5.4-mini 或 gpt-5.3-codex-spark
Scope: 只修改 brief 指定文件，不能回滚他人改动。
Input: 读取 brief、相关接口文件、上一轮 reviewer findings。
Output: 写 report，列出状态、变更文件、测试命令、测试结果、疑问。
Stop: 遇到 API 选型或范围扩大，返回 NEEDS_CONTEXT。
```

审阅类：

```text
Model: gpt-5.4-mini
Input: brief、implementer report、review package。
Check: spec compliance、代码质量、是否越界、是否缺测试证据。
Output: Approved / Critical / Important / Minor，必须说明文件和原因。
```

验证类：

```text
Model: gpt-5.3-codex-spark
Input: 验证命令清单。
Action: 原样运行命令，记录退出码和关键输出。
Output: 不做架构结论，只给事实和失败定位线索。
```

## 默认模型选择

- 完整代码已在 brief 中给出，或只是字段替换：`gpt-5.3-codex-spark`。
- 需要读现有实现并做局部迁移：`gpt-5.4-mini`。
- 需要判断迁移方向、公共 API、兼容策略、review 分歧：Codex 主控制器。
- diff 小且机械：`gpt-5.4-mini` 审阅即可。
- diff 涉及 `@empjs/share`、`@empjs/cli`、CJS/ESM 兼容和验证矩阵：主控制器复核 reviewer 结论。
