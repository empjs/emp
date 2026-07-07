# FAQ

## v4 是否必须重写配置？

不需要。v4 尽量保留 EMP 的配置形态，重点是底层构建和联邦运行时升级。

## Tailwind 3 还在当前验收范围吗？

不在。当前 v4 apps 主覆盖是 Tailwind CSS 4，旧 Tailwind 2 / 3 示例已经退出当前验收目标。

## website 是否会被发布到 npm？

不会。`website` 是 workspace 文档站，不属于内部发布包范围。

## 构建成功是否等于联邦链路可用？

不等于。Module Federation 项目还需要检查 manifest、remote entry、共享依赖、类型声明和浏览器真实消费链路。
