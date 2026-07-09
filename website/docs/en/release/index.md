# 发布治理

EMP 发布流程要求 package 范围、版本、构建和验收结果都可复现。

内部统一版本优先覆盖 v4 核心包：

- `@empjs/cli`
- `@empjs/chain`
- `@empjs/share`
- `@empjs/plugin-*`
- `@empjs/bridge-*`
- `@empjs/adapter-*`
- `@empjs/polyfill`
- 配置包

`apps/**` 和 `website` 不进入发布包范围。
