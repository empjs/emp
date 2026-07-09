# 共享依赖与运行时

`@empjs/share` 封装 Module Federation 配置和浏览器运行时能力，减少业务项目直接拼装 runtime plugin、externals 和类型包列表的成本。

## 推荐入口

| 入口 | 用途 |
| --- | --- |
| `@empjs/share/rspack` | Rspack 场景下的 Module Federation 插件入口 |
| `@empjs/share/sdk` | 业务代码调用联邦 runtime SDK |
| `@empjs/share/runtime` | 浏览器运行时辅助能力 |
| `@empjs/share/forceRemote` | 运行时替换或重写 remote 地址 |

## 版本隔离

开启 `empRuntime.version: true` 后，EMP 会基于当前 package `name` 和 `version` 派生联邦 scope，并同步影响 `output.uniqueName` 和默认 CSS Modules 前缀。

该选项是 boolean，不接受自定义字符串版本。
