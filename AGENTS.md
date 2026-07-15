# EMP Agent Workflow

## 核心约束

- 默认中文；先给结果，再给最少必要依据。配置、发布、包管理和脚本任务必须说明真实验证结果与未覆盖边界。
- 从当前 checkout 开始：先看 `git status --short --branch`，保留用户已有改动，不沿用历史 workflow 假设。
- 只修改任务直接相关文件；禁止覆盖、回退或提交无关改动，禁止未经授权的 force push、reset、破坏性 clean 和外部写入。
- 默认最小充分检查、精确检索、短输出；不要重复读取规则、复制完整会话或向子 Agent 注入完整 Skill。

## 分级预检

- 问答/文案：不做仓库预检，除非答案依赖 live state。
- 单文件文档/配置/脚本：`git status` + 目标文件；使用 `rg`/直接读取，不要求 CodeGraph 或 `codex mcp list`。
- 跨文件/跨包代码：`codegraph sync . && codegraph status .` 后使用精确 query/node/callers/callees/affected；结果不足再用 `rg`。
- CI、依赖、构建、发布：增加 package、lockfile、workflow 和相关验证入口检查。
- MCP、浏览器或外部系统：仅在任务确实需要时检查和调用对应能力。
- 完整预检、CodeGraph 命令和日志压缩规则见 `skills/emp-workflow/references/routing-and-context.md`。

## 计划与编排

- 非平凡实现、发布、自动化、测试体系和跨目录改动先在当前任务回复中写计划；只有用户明确要求才落盘，且不得写入仓库内历史工作流目录。
- 简单问答、单文件轻改、单条确定性命令和共享状态阻塞任务由主控制器直接完成。
- 仅当独立 sidecar 能减少主上下文，或中高风险改动需要独立验收/审阅时派 subagent；派发前只读相关 `.codex/agents/emp-*.toml`。
- 默认 1 个子 Agent，独立任务域最多并行 2 个、直接子 Agent 最多 3 个；`max_depth = 1`，同一文件或共享状态只有一个写入者。
- 依赖、锁文件、迁移、快照、端口、发布状态和外部系统写入串行执行。

## 模型路由

- 控制器：`.codex/config.toml` 的 `gpt-5.5` + low + no summary。
- `emp-spark`：`gpt-5.3-codex-spark`，仅处理 brief 已提供的纯文本，不读仓库、不调用工具。
- `emp-fast`：`gpt-5.4` + low，处理检索、单文件和低风险修改。
- `emp-impl`：`gpt-5.5` + medium，处理边界明确的多文件实现和测试。
- `emp-deep`：只读 `gpt-5.6-sol` + high，仅处理架构、公共 API、依赖/发布风险和复杂审阅。
- 中高风险行为、依赖、构建、发布或跨模块改动完成后，使用 `gpt-5.6-terra` verifier；低风险任务不为验收额外升级。
- 禁止使用通用 `gpt-5.6` model id；详细门槛和 brief 合同见 `skills/emp-workflow/references/routing-and-context.md`。

## 目录与 Git

- `apps/**`、`website` 默认是示例/站点；`packages/cdn-*`、`packages/lib-*` 默认保持独立版本线；未明确授权不要扩展到这些范围。
- `pnpm-lock.yaml` 只在依赖或安装结果变化时修改；`.github/workflows/publish.yml` 仅用于发布任务。
- 禁止提交生成物、缓存和隔离 checkout：`node_modules/`、`dist/`、`output/`、`coverage/`、`.codegraph/`、`.turbo/`、`.rslib/`、`.rspack-cache/`、`.worktrees/`。
- Worktree 清理必须先盘点，不能直接 `rm -rf .worktrees`；完整流程见 `skills/emp-workflow/references/repository-operations.md`。
- 用户明确要求 `提交`、`push`、发布或 PR 收口时才进入提交闭环：重查状态，只 stage 本任务文件，运行 `git diff --cached --check` 和对应验证。
- PR 使用模板并遵循 CODEOWNERS；workflow、Skill、脚本、package 和 lockfile 变更需要对应 review。

## 发现与验证

- 代码符号、调用链、跨包边界、运行时路径和受影响测试使用 CodeGraph；文本、Markdown、JSON/TOML/YAML、脚本和 workflow 使用 `rg`/结构化解析。
- 修改前从 `skills/emp-workflow/references/change-matrix.md` 选择最小验证，不默认运行所有高成本命令。
- 成功命令只回传命令、退出码和摘要；完整日志写临时文件。失败时读取失败段及相邻上下文，不把全量构建日志注入会话。
- `corepack pnpm workflow:check` 是工作流规则入口；构建链路、包源码或 workspace 依赖变更还需 `corepack pnpm ci:verify` 和 `corepack pnpm empbuild`。
- 最终回复包含：改动文件、验证命令与结果、未执行项/风险；不把子 Agent 结论直接当作最终证据。

## 按需参考

- 路由、分级预检、CodeGraph、子 Agent、日志控制：`skills/emp-workflow/references/routing-and-context.md`
- 验证命令、目录边界、Token 模型门槛：`skills/emp-workflow/references/change-matrix.md`
- Skill、Git/PR、Worktree、测试与发布操作：`skills/emp-workflow/references/repository-operations.md`
