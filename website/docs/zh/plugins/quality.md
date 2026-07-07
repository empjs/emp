# 代码规范插件

EMP v4 同时保留代码规范相关包：

| 包 | 用途 |
| --- | --- |
| `@empjs/biome-config` | 统一 Biome 配置和命令入口 |
| `@empjs/eslint-config-react` | React 项目 ESLint 配置 |

这类包属于 v4 内部统一版本范围，但不直接参与浏览器运行时。发布前仍需要通过 release 规则确认版本和范围没有漂移。
