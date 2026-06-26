# EMP Agent Workflow

## 沟通与输出

- 默认使用中文沟通；说明、进度同步、评审意见与问题反馈均优先中文。
- 先给结果，再给必要依据；避免长篇铺垫。
- 任何发布、包管理、配置、脚本类任务，都必须说明真实验证结果和未覆盖边界。

## 仓库状态优先

- 开始任务前先确认 live checkout，不沿用历史 workflow 假设。
- 需要先检查：当前分支、`git status --short --branch`、`AGENTS.md`、`.codex/config.toml` 是否存在、`codex mcp list` 当前状态、`command -v codegraph`、`codegraph status .`。
- 不要覆盖用户已有改动。遇到无关改动时保留；遇到相关改动时基于现状继续。

## CodeGraph 优先级

- 当前项目默认使用 CodeGraph 做代码发现、调用链和影响面判断。
- 开始跨文件或跨包分析前先运行 `codegraph sync .`，再用 `codegraph status .` 确认索引是最新状态。
- 代码发现优先顺序：
  1. `codegraph query <symbol-or-topic>`：查符号、文件、入口和相似主题。
  2. `codegraph node <symbol-or-file>`：读源码、调用方和被调用方。
  3. `codegraph callers <symbol>` / `codegraph callees <symbol>`：确认调用链。
  4. `codegraph affected <files...>`：根据改动文件找受影响测试。
  5. `codegraph explore <topic>`：做模块级探索和 blast radius 梳理。
- 如果 CodeGraph 结果不足，或要查字符串、配置、脚本、文档，再退回 `rg`、`find`、`sed` 等本地工具。
- 使用 fallback 时要在进度或最终结果中说明原因。

## Superpowers 强制流程

- 只要任务有 1% 可能匹配某个 Superpowers skill，先读取并遵循对应 skill，再行动。
- 非平凡功能、脚本、发布、包管理、配置变更，默认遵循：
  1. `superpowers:writing-plans`：先写计划，保存到 `.superpowers/plans/YYYY-MM-DD-<topic>.md`。
  2. `superpowers:test-driven-development`：新增行为先写失败的真实验收/集成测试，再实现；不要用零散纯单测替代真实链路验证。
  3. `superpowers:executing-plans` 或 `superpowers:subagent-driven-development`：按计划执行并维护任务状态。
  4. `superpowers:verification-before-completion`：完成前做独立验证，不用“应该可以”代替结果。
- 简单文档或规范变更可以不创建完整计划，但仍要遵守读现状、最小改动、真实验证。

## 项目级 Skill 约定

- EMP 项目级 Skill 统一放在 `skills/<skill-name>/`，每个 Skill 必须包含 `SKILL.md`；不要放到 `.superpowers/`、`docs/superpowers/` 或全局 `~/.codex/skills/` 里。
- 新建或更新项目级 Skill 时，必须先加载并遵循 `skill-creator`；新建 Skill 默认使用 `skill-creator` 提供的 `init_skill.py` 初始化到 `skills/`，不要手写完整模板。
- Skill 名称必须使用小写字母、数字和连字符，目录名与 `SKILL.md` frontmatter 的 `name` 保持一致。
- `SKILL.md` frontmatter 只保留 `name` 和 `description`；`description` 必须写清能力和触发场景。正文保持精简，详细资料拆到 `references/`，确定性脚本放 `scripts/`，输出模板或资源放 `assets/`。
- 推荐生成并维护 `agents/openai.yaml`；除 `SKILL.md`、`agents/openai.yaml` 和必要的 `scripts/`、`references/`、`assets/` 外，不新增 README、安装指南、变更日志等额外说明文件。
- Skill 完成或更新后必须运行 `skill-creator` 的 `quick_validate.py <skill-dir>`；如果包含脚本，还必须至少运行代表性脚本验证，并在最终回复中说明验证结果。

## 目录边界

- 默认可修改范围只限于当前任务直接相关文件；所有改动都必须能在最终回复中解释目的和验证结果。
- `apps/**` 和 `website` 默认是示例、验收项目或站点，不参与发布包范围；除非任务明确要求示例/站点/验收矩阵，否则不要修改。
- `packages/cdn-*` 和 `packages/lib-*` 默认保持独立版本线；除非用户明确要求纳入统一版本或迁移范围，否则不要改版本、发布配置或依赖线。
- `.github/workflows/publish.yml` 只在发布流程任务中修改；普通 CI、PR、review 自动化优先修改 `.github/workflows/ci.yml`、`.github/pull_request_template.md` 和 `.github/CODEOWNERS`。
- `pnpm-lock.yaml` 只在依赖、package 范围或安装结果确实变化时修改；不要为了格式化或无关任务重写 lockfile。
- 禁止新建或继续使用 `docs/superpowers/`；Superpowers 长期计划和规格放 `.superpowers/plans/`、`.superpowers/specs/`，执行记录放 `.superpowers/sdd/`。
- 禁止提交生成物、缓存或本地索引，包括 `node_modules/`、`dist/`、`output/`、`coverage/`、`.codegraph/`、`.turbo/`、`.rslib/`、`.rspack-cache/`。

## Git / PR / Review 闭环

- 开始改动前确认分支、远端关系和未提交改动；当前分支如果有用户改动，必须保留并基于现状继续。
- 不做未授权的 force push、reset、checkout 覆盖或大范围 clean；需要破坏性操作时先取得明确授权。
- 每个 PR 必须使用 `.github/pull_request_template.md`，写清改动范围、未触碰的保护目录、验证命令、跳过项和风险。
- `.github/CODEOWNERS` 是默认 review 路由；workflow、Skill、脚本、package 和 lockfile 变更必须请求 CODEOWNERS review。
- 实现型任务完成后要形成 review package：核心 diff、验证输出、目录边界确认和剩余风险；不能只用“已完成”替代证据。
- push / PR 前至少确认 `pnpm workflow:check`、`git diff --check` 和与改动类型匹配的测试命令；涉及构建链路时还必须运行或说明未运行 `pnpm empbuild` 的风险。

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
- `packages/**` 是发布包主范围；`apps/**` 和 `website` 默认视为示例、验收项目或站点，不进入自动发布。
- 内部统一版本优先覆盖 v4 核心包：`@empjs/cli`、`@empjs/chain`、`@empjs/share`、`@empjs/plugin-*`、`@empjs/bridge-*`、`@empjs/adapter-*`、`@empjs/polyfill`、配置包。
- `@empjs/cdn-*`、`@empjs/lib-*` 这类 CDN / legacy runtime 包默认保持独立版本线，除非用户明确要求纳入统一版本。
- 发布脚本必须支持 dry-run，并且真实 publish 必须有显式确认参数。
- changelog 需要说明版本、发布时间、发布范围、主要变更和验证命令。
- GitHub Release / changelog / release 提交说明默认参考 Rspack Releases 格式：https://github.com/web-infra-dev/rspack/releases。
- Release 正文结构优先使用 `## What's Changed`，按实际变更分组：`New Features`、`Performance`、`Bug Fixes`、`Refactor`、`Document`、`Other Changes`；没有内容的分组不要空挂。
- Release 条目保持 conventional commit 风格前缀，例如 `feat`、`perf`、`fix`、`refactor`、`docs`、`chore`、`test`、`ci`；如果来自 GitHub PR，保留 `by @author in #PR` 或等价链接。
- Release 末尾优先补 `Full Changelog` compare 链接和 `Contributors`；如果当前仓库无法准确生成贡献者或 compare 链接，不要编造，说明缺失原因。
- 如果版本存在废弃、回滚、错误产物或兼容风险，必须在 `What's Changed` 前增加醒目的 `Warning` / `Known Issues` 段落，并写清推荐升级或规避路径。

## 验证与交付

- 完成前至少运行与改动相关的最小验证命令。
- 发布自动化变更至少验证：
  - package 范围不会包含 `apps/**`、`website`
  - dry-run publish 命令不会真实发包
  - changelog 生成或更新结果可复现
- 最终回复要包含：改动文件、验证命令与结果、遗留风险或未执行项。
