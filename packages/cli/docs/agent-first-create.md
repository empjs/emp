# Agent-first 创建流程（v4）

本文档说明 EMP CLI 的 Agent-first `create` 最小可交付场景（P0）用法。

## 适用范围（P0）

- 固定支持命令：
  - `emp create "React 主应用 + Vue 子应用"`
- 固定拓扑：
  - 1 个 React Host
  - 1 个 Vue Remote
- 不支持场景：
  - 旧项目迁移
  - 已有仓库改造/并入
  - 部署、发布、上架流程
  - 覆写非空目录（会直接失败）

## 结果文件与目录

执行后会生成以下内容：

- `emp.intent.yaml`
- `package.json`（根）
- `pnpm-workspace.yaml`
- `apps/host`
- `apps/user`
- `emp-report.json`

`emp.intent.yaml`、`apps/host/emp.config.ts`、`apps/user/emp.config.ts` 为主执行配置，`pnpm-workspace.yaml` 与根 `package.json` 统一到 EMP 默认脚手架栈。

## 标准命令

```bash
emp create "React 主应用 + Vue 子应用"
```

默认行为会自动做：

- 创建项目骨架（包含上面列举文件）
- 自动检测可用端口并写入 Host/Remote 配置
- 自动安装依赖、构建验证、尝试启动开发环境
- 生成并写入 `emp-report.json`

## 推荐的 Agent 使用姿势

### 0. Agent 自检

```bash
emp --json doctor
```

- 本地自检，不需要账号、token 或网络请求
- JSON 输出用于 Agent 判断 Node、pnpm、当前目录和下一步命令
- 推荐在创建或写入项目前先运行

### 1. 指定输出目录

```bash
emp create "React 主应用 + Vue 子应用" --dir <目标目录>
```

### 2. 干运行（不落盘）

```bash
emp create "React 主应用 + Vue 子应用" --dry-run --json
```

- 不写入文件
- 仍返回执行计划和 JSON 结果，适合 Agent 做预检或变更审批

### 3. 跳过步骤（快速校验）

```bash
emp create "React 主应用 + Vue 子应用" --skip-install --skip-dev --json
```

- `--skip-install`：跳过依赖安装
- `--skip-dev`：跳过自动启动
- 仍执行静态校验（`emp-report.json` 会反映静态校验和命令状态）

### 4. 结构化输出

```bash
emp create "React 主应用 + Vue 子应用" --json
```

- 用于 Agent 与流水线消费
- 默认输出包含 plan、file 列表、执行报告、report 路径

## `emp-report.json` 语义

报告包含：

- `apps`：每个应用名称、角色、框架、最终 URL（以自动端口为准）
- `checks`：静态校验结果
  - 必选项包括：
    - `root-package`（根 `package.json`）
    - `workspace`（`pnpm-workspace.yaml`）
    - `intent`（`emp.intent.yaml` 里的 host/remote 意图）
    - `host-config`（Host 远端指向）
    - `remote-config`（Remote 暴露 `./App`）
- `commands`：命令执行结果（`install` / `build` / `dev`）

整体 `status` 为 `passed` 表示“没有失败的已执行步骤”；`skipped` 命令和空 `checks` / `commands` 不代表对应检查或命令已经执行通过。出现失败时为 `failed`，并在对应 `checks` 或 `commands` 项中保留原因。

## 失败处理

- 非空目录：直接失败，避免误写；如果可以新建失败报告，`emp-report.json` 会记录失败原因，已有 `emp-report.json` 不会被覆盖。
- 命令失败会在 `commands` 中保留 `failed` 状态与退出码、stdout/stderr，便于问题定位。
- 静态校验失败会在 `checks` 中返回对应项并令报告状态为 `failed`。
