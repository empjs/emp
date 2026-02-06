# EMP React 19 Startkit 说明

## 脚本用法

```bash
node skills/empjs/scripts/create-emp-react19.js <项目名> [目标目录]
```

从 EMP 仓库根目录执行。目标目录默认为当前目录。

## 生成文件结构

```
<项目名>/
├── package.json       # React 19、@empjs/cli、@empjs/plugin-react
├── emp.config.ts      # 最少配置，含 resolve alias
├── tsconfig.json      # extends @empjs/cli/tsconfig/react
├── src/
│   ├── index.html    # 含 <div id="emp-root">
│   ├── index.tsx     # 入口，import bootstrap
│   ├── bootstrap.tsx # createRoot + render App
│   ├── App.tsx       # 示例组件
│   ├── style.css     # 可选 Tailwind 入口
│   └── global.d.ts   # EMP 类型引用
```

## 生成后步骤

```bash
cd <项目名>
pnpm install
pnpm dev
```

## 可选扩展

- **Tailwind v4**：`pnpm add @empjs/plugin-tailwindcss tailwindcss`，在 emp.config 添加 `pluginTailwindcss()`，在 style.css 添加 `@import "tailwindcss"`
- **状态管理**：`pnpm add @empjs/valtio`
- **微前端**：`pnpm add @empjs/share`，配置 `pluginRspackEmpShare`
