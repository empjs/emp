# EMP Agent Contract

## 完成标准

- 完成用户明确要求的结果，提供足以支持结论的当前证据、验证结果和剩余风险；证据充分即停止。
- 默认中文、先给结果。配置、依赖、构建、发布和外部状态必须真实核验，不用推断冒充结果。

## 不变量

- 涉及仓库读取或修改时，从 `git status --short --branch` 开始，保留用户已有改动；只修改、验证、stage 和提交本任务文件。
- 未明确授权不得 force push、reset、破坏性 clean、发布、写外部系统或扩大目录范围。
- `apps/**`、`website`、`packages/cdn-*`、`packages/lib-*` 和 `.github/workflows/publish.yml` 需要任务明确授权；`pnpm-lock.yaml` 只随依赖图变化。
- 不提交 `node_modules/`、`dist/`、`output/`、`coverage/`、`.codegraph/`、`.turbo/`、`.rslib/`、`.rspack-cache/`、`.worktrees/`；不得创建仓库内历史工作流目录。

## 路由

- 简单、确定性或共享状态任务由主控制器完成。任务涉及 workflow/config、CI、依赖、构建、发布、Git/PR、worktree 或跨包验证时，按需使用 `skills/emp-workflow`。
- `.codex/config.toml` 与 `.codex/agents/emp-*.toml` 是模型配置真相源。选择最低充分 lane；先补成功条件、依赖、工具路由或验证闭环，再提高 reasoning effort。
- 只有独立任务域或中高风险验收/审阅才派子 Agent；默认一个、最多两个独立域、`max_depth = 1`。同一文件和共享状态只有一个写入者。

## 验证与交付

- 文本和配置用 `rg`/结构化解析；调用链、跨包影响、运行时路径和受影响测试才使用 CodeGraph；外部能力只在任务需要时加载。
- 从 `skills/emp-workflow/references/change-matrix.md` 选择最小充分验证。`corepack pnpm workflow:check` 是 workflow 入口；包源码、构建链或 workspace 依赖变更还需 `corepack pnpm ci:verify` 与 `corepack pnpm empbuild`。
- 仅在用户要求提交、push、发布或 PR 收口时进入 Git 闭环；stage 精确文件并运行 `git diff --cached --check`。外部写入完成后必须回读。
- 最终交付列出改动文件、命令与结果、未执行项和风险；不以子 Agent 输出替代实际文件或外部状态。

## 按需参考

- 预检、CodeGraph、模型路由、委派和日志：`skills/emp-workflow/references/routing-and-context.md`
- 验证命令与保护范围：`skills/emp-workflow/references/change-matrix.md`
- Skill、Git/PR、worktree、测试和发布：`skills/emp-workflow/references/repository-operations.md`
