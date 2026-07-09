# Agent-First 创建项目

`@empjs/cli` 提供面向 Agent 的创建流程，用一句需求生成基础微前端拓扑。

```bash
emp create "React 主应用 + Vue 子应用"
```

常用自动化模式：

```bash
emp create "React 主应用 + Vue 子应用" --dry-run --json
emp create "React 主应用 + Vue 子应用" --dir <target-dir>
emp create "React 主应用 + Vue 子应用" --skip-install --skip-dev --json
```

默认 P0 拓扑是一组 React host 加 Vue remote。生成结果会包含 `emp.intent.yaml`、应用工作区和 `emp-report.json`，适合新项目启动，不等价于对已有项目做无损迁移。

## Doctor

CLI 也提供机器可读诊断入口：

```bash
emp --json doctor
emp doctor --json
```

这类输出适合接入自动化检查、脚手架验证或 Agent 闭环。
