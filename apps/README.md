# apps 新版验收项目

`apps/` 是 EMP v4 之后的新版验收项目目录。新增验收能力默认放在这里，`projects/` 保留为历史 demo、兼容性案例和迁移参考。

## 准入规则

- 每个 app 必须有 `package.json`、EMP 配置文件和 `src/`。
- 每个 app 必须提供 `dev`、`build`、`start`、`stat` 脚本。
- app 名称必须表达验收能力，不使用泛化名称。
- 每个 app 必须能通过 `node scripts/apps.mjs check`。
- 性能基线默认只跑 `apps/`，不自动扫描 `projects/`。

## 首批项目

- `rspack2-modern-module`：验收 `modern-module` ESM library 输出。
- `rspack2-optimization`：验收 Rspack 2 优化、parser 和 SWC loader 配置入口。

## 命令

```bash
pnpm apps:list
pnpm apps:check
pnpm apps:bench -- --apps rspack2-modern-module,rspack2-optimization
```

## projects 淘汰策略

`projects/` 不直接删除。后续按能力域迁移到 `apps/`，当新版 app 能覆盖旧 demo 的验收能力并连续通过验证后，再把旧 demo 标记为 legacy、archive 或从默认矩阵移除。
