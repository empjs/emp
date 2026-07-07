# Apps 验收矩阵

仓库当前的 apps 验收入口：

```bash
corepack pnpm apps:acceptance
corepack pnpm test:apps:single
corepack pnpm test:apps:browser
```

`apps:acceptance` 覆盖 TypeScript 配置、包构建、apps 清单、关键 app 构建和 library output。浏览器 E2E 独立放在 `test:apps:browser`，避免端口和浏览器环境影响基础验收。

## 重点边界

- remote provider：manifest、remote entry、exposes、浏览器可加载。
- remote consumer：remotes URL、真实组件消费、共享依赖行为。
- 路由刷新：React Router 和 Vue Router 深链直达。
- proxy 诊断：目标不可达时页面应显示可理解错误。
- Tailwind：当前只守护 Tailwind CSS 4，不恢复 Tailwind 3 示例。
