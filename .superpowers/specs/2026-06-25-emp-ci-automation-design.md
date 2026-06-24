# EMP CI 自动化设计

## 目标

把 EMP 当前的真实测试约束从“文档要求”升级为“本地脚本 + GitHub Actions 硬闸 + AGENTS 规则矩阵”的三层自动化。自动化默认验证现有 CLI、package、rules、release 元数据和包构建，不引入第二套测试 runner，也不改变 publish workflow 的发包职责。

## 当前事实

- 根脚本已经提供 `test:cli` 和 `test:real:cli`，包内已有 CLI Rstest 与若干历史 Node 测试。
- `scripts/release.test.mjs`、`scripts/apps.test.mjs`、`packages/emp-share/test/**`、`packages/emp-chain/test/**`、`packages/plugin-react/test/**` 仍是当前 live checkout 的遗留验证面，需要先被根入口编排，再在后续迁移到统一 Rstest。
- `.github/workflows/publish.yml` 只负责发布和发布前验证，触发面是 `workflow_dispatch` 和 `empjs-*-v*` tag。
- `AGENTS.md` 已要求真实测试、发布自动化 dry-run 和最小真实验证；本次补充自动化矩阵和 Rstest 迁移方向。
- 当前仓库没有独立 PR / push CI workflow，也没有稳定的 repo-local Codex hook 配置。

## 自动化分层

1. `AGENTS.md`
   - 负责协作约束和人工/代理执行规则。
   - 明确不同改动类型对应的最小命令矩阵。
   - 明确发布 workflow 和 CI workflow 的边界，避免 CI 误发包。

2. `package.json`
   - 增加根脚本 `ci:verify`。
   - `ci:verify` 串联现有 CLI 测试、package 测试、规则测试、`pnpm release:check`、`pnpm check:rslib-presets`。
   - 所有 CI 和本地回归默认调用根脚本，不在 workflow 中散落重复命令。

3. `.github/workflows/ci.yml`
   - 在 `pull_request`、`push` 到 `main` / `v4`、`workflow_dispatch` 时运行。
   - 使用 Node 24 和 `pnpm@10.33.0`，与 publish workflow 保持一致。
   - 分两个 job：
     - `verify`：安装依赖后运行 `pnpm ci:verify`。
     - `build`：安装依赖后运行 `pnpm empbuild`。
   - workflow 只读仓库内容，不配置 npm publish 权限，不接触 `NODE_AUTH_TOKEN`。

## 非目标

- 不新增 Vitest、Jest、Mocha、Ava、Playwright 独立 runner 或新的本地 `node:test` 入口；当前已有 Node 测试仅作为待迁移遗留被根入口编排。
- 不改 `.github/workflows/publish.yml` 的发包触发和 npm 发布逻辑。
- 不新增强制本地 hook；后续如果需要 pre-push，再基于 CI 稳定结果单独设计。
- 不做 path-filter 优化；第一版保持简单可解释，避免漏跑真实验证。

## 失败处理

- `pnpm ci:verify` 失败时，先按失败 scope 运行对应命令，例如 `pnpm test:real:cli`、`pnpm test:packages` 或 `pnpm test:rules`。
- `pnpm empbuild` 失败时，不用 CI workflow 内的 workaround 掩盖；应回到对应包或构建配置修复。
- 如果 CI 时间过长，下一轮优化只能拆分 job 或引入缓存，不能跳过真实测试矩阵。

## 验收标准

- `.github/workflows/ci.yml` 存在并包含 `verify` 与 `build` 两个 job。
- `package.json` 提供 `ci:verify` 根脚本。
- `AGENTS.md` 包含自动化运行规则和最小验证命令矩阵。
- `pnpm ci:verify` 通过。
- `pnpm empbuild` 通过，或如果环境导致失败，最终回复必须给出具体失败命令和错误边界。
- `git diff --check` 通过。
