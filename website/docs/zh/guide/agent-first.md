# Agent-First 仓库手册

EMP v4 的完整 Agent-First 使用方法维护在仓库根目录 `skills/emp-v4-agent-first/`。官网只保留入口，实际创建、插件、联邦和验收细节以仓库 Skill 为准。

仓库入口：

- [skills/emp-v4-agent-first](https://github.com/empjs/emp/tree/main/skills/emp-v4-agent-first)
- [skills/emp-v4-agent-first/SKILL.md](https://github.com/empjs/emp/blob/main/skills/emp-v4-agent-first/SKILL.md)

在 Codex 或其他 Agent 中使用：

```text
Use $emp-v4-agent-first to configure an EMP v4 project with plugins, federation, and validation gates.
```

## 分册

| 仓库文件 | 内容 |
| --- | --- |
| [`references/project-setup.md`](https://github.com/empjs/emp/blob/main/skills/emp-v4-agent-first/references/project-setup.md) | 环境基线、安装、`emp create`、`emp doctor --json`、生成报告 |
| [`references/module-federation.md`](https://github.com/empjs/emp/blob/main/skills/emp-v4-agent-first/references/module-federation.md) | host、remote、shared、manifest、DTS、运行时 scope |
| [`references/plugins.md`](https://github.com/empjs/emp/blob/main/skills/emp-v4-agent-first/references/plugins.md) | React、Vue、Tailwind CSS 4、PostCSS、Lightning CSS、Stylus、质量包 |
| [`references/validation-release.md`](https://github.com/empjs/emp/blob/main/skills/emp-v4-agent-first/references/validation-release.md) | 应用验收、仓库门禁、发版 dry-run、验收凭证 |

## 使用原则

- 官网用于发现入口，完整步骤回到仓库读取。
- Agent 执行前先选择对应分册，不一次性加载全部内容。
- 配置变更必须配套真实构建、manifest、类型或浏览器验证。
