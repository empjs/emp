# 核心能力

EMP v4 的核心能力由三层组成：

1. `@empjs/cli` 负责读取 EMP 配置、驱动 Rspack 构建和开发服务。
2. `@empjs/share` 负责 Module Federation 接入、运行时共享和类型声明协作。
3. `@empjs/plugin-*` 负责 React、Vue、CSS 和工程能力的可插拔接入。

这三层共同保持一个目标：业务项目继续围绕 EMP 配置组织工程能力，而不是直接维护大量底层 Rspack / Module Federation 细节。
