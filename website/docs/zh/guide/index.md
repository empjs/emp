# 快速开始

这一组文档面向第一次接入 EMP v4 的项目。优先阅读顺序是环境基线、安装命令、项目创建和日常命令。

## 接入前提

- 使用 Node.js `^20.19.0 || >=22.12.0`。
- 使用 pnpm 10，仓库内固定为 `pnpm@10.33.0`。
- v4 试用包优先使用 `@rc` dist-tag。
- 微前端项目需要明确 host、remote、shared 和 manifest 的边界。

## 典型接入步骤

1. 安装 CLI 与框架插件。
2. 创建或迁移 EMP 配置。
3. 配置 `pluginRspackEmpShare(...)`。
4. 运行开发服务或生产构建。
5. 检查 manifest、类型声明和页面消费链路。

## Agent-First 使用手册

如果由 Agent 负责创建、配置或验收项目，优先使用仓库根目录 `skills/emp-v4-agent-first/`。官网只提供入口，完整插件配置、Module Federation 配置和发布验收清单都维护在仓库 Skill 中。
