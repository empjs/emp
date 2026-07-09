# 发布门禁

推荐本地门禁：

```bash
corepack pnpm workflow:check
corepack pnpm ci:verify
corepack pnpm empbuild
corepack pnpm apps:acceptance
corepack pnpm release:publish:dry -- --skip-build
```

发布凭证可以使用：

```bash
corepack pnpm release:acceptance
corepack pnpm release:acceptance -- --include-browser
```

`release:acceptance` 会生成 `.release/acceptance/index.html`，用于保留每次发版的验收状态和命令证据。
