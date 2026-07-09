# 常用命令

| 命令 | 用途 |
| --- | --- |
| `emp dev` | 启动开发服务 |
| `emp build` | 执行生产构建 |
| `emp build --doctor` | 构建时打开 Rsdoctor 分析 |
| `emp create "<需求>"` | 根据自然语言需求生成项目 |
| `emp doctor --json` | 输出机器可读诊断信息 |

## 仓库级验证命令

EMP 仓库自身使用这些门禁守护 v4：

```bash
corepack pnpm workflow:check
corepack pnpm ci:verify
corepack pnpm empbuild
corepack pnpm apps:acceptance
corepack pnpm release:acceptance
```

应用接入时不需要全部照搬，但发布前至少应保留构建、manifest 和真实页面消费验证。
