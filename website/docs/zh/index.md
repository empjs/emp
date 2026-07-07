# EMP v4

EMP v4 是面向微前端工程的构建工具。它把 Rspack 2、Module Federation 2、TypeScript 能力和常用框架插件收在一套 EMP 配置模型里，让 host、remote、shared、manifest、类型声明和运行时适配由工具链统一处理。

v4 的目标不是重新发明业务工程规范，而是在保留 EMP 使用习惯的前提下，把底层构建、联邦运行时和插件生态迁到更现代的 Rspack / Module Federation 基线。

## 核心价值

- **微前端联邦**：封装 host、remote、shared、runtime、manifest 和类型声明生成。
- **Rspack 2 构建**：覆盖开发服务、生产构建、本地预览和构建分析。
- **框架插件生态**：提供 React、Vue 2、Vue 3、Tailwind CSS 4、Lightning CSS、PostCSS、Stylus 等接入能力。
- **共享依赖治理**：统一处理单例依赖、版本协商和运行时加载。
- **迁移友好**：保留 `pluginRspackEmpShare(...)` 等常见用户侧 API，降低 v3 到 v4 的迁移成本。

## 推荐入口

| 场景 | 入口 |
| --- | --- |
| 第一次接入 EMP v4 | 快速开始 |
| 了解联邦运行时 | 核心能力 |
| 查找 React / Vue / CSS 插件 | 插件生态 |
| 核对构建和服务配置 | 配置参考 |
| 验证示例覆盖面 | 示例与验收 |
| 准备升级或发布 | 迁移发布 |

## 当前基线

- Node.js：`^20.19.0 || >=22.12.0`
- pnpm：`10.x`，仓库固定为 `pnpm@10.33.0`
- 构建底座：Rspack 2
- 联邦底座：Module Federation 2
- 当前 v4 版本以 npm `@empjs/cli@rc` dist-tag 为准
