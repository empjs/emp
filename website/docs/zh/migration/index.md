# 迁移指南

EMP v4 的迁移重点是底层构建和联邦运行时升级，同时保留用户熟悉的 EMP 配置模型。

## 迁移重点

- Node.js 基线升级到 `^20.19.0 || >=22.12.0`。
- 包管理使用 pnpm 10。
- Rspack 升级到 2.x 能力线。
- `@empjs/share` 使用官方 Module Federation 2.x 包。
- CDN / legacy runtime 包保持独立版本线，不随 v4 核心包统一升级。

迁移时应先跑构建，再跑真实 host / remote 消费链路。
