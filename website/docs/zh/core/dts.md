# 类型声明

Module Federation 项目除了要能运行，还需要让 host 在开发期拿到 remote 的类型声明。

EMP v4 中，`@empjs/share` 会协助联邦 DTS 生成和运行时类型包注入。消费侧生成的类型文件需要包含业务 expose 类型，也需要包含 `@empjs/share/sdk` 等运行时入口。

## 检查项

- remote 构建后是否生成 `@mf-types`。
- host 是否能解析 remote expose 的类型。
- 消费侧类型里是否包含 EMP runtime SDK 声明。
- 类型声明产物是否与当前 `@empjs/share` exports 保持一致。

如果只检查页面是否加载，很容易漏掉开发期类型回归。
