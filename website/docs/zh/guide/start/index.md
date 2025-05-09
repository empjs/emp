# 介绍
`EMP`是一个基于Rspack、Module Federation与Typescript，聚焦高性能与微前端的工程化解决方案。

## 为什么要做 EMP

我们创建`EMP`的原因是要解决在团队维护构建工具时遇到的各种性能问题。由于团队内部存在许多巨石应用，它们都具有复杂的构建配置，经过`EMP²`性能提升后，生产环境构建还需要耗费好几分钟；开发环境的耗时也超过一分钟以上。

我们在 Webpack 上尝试了多种方法来优化这些巨石应用，但是效果甚微。我们意识到在 Webpack 上的优化已经难以为继，必须要从底层改造，才能适应我们的需求。

相对应EMP之前的版本，`EMP`从webpack切换到rspack(基于Rust的高性能构建引擎)，来构建JS。通过新算法减少产物体积，node构建环境做了升级，目前使用nodejs 20lts，20以前的版本不再维护。

## EMP目前的状态

目前`EMP`已经处于发布状态，已经落地在团队线上项目之中，经过多个项目与EMP2比对，目前首次构建速度提升约28%，二次构建速度提升约45%，产物包体积缩小24%以上。

## EMP的未来
微组件共享适配更多业务场景，如老项目不需要改造情况下接入新项目。对于现代浏览器模块化方案进一步适配，浏览器按需加载与本地开发服务按需构建。

### 持续提升性能
探索更高性能的并发/多核友好的算法，探索更高性能的缓存方案，探索更高性能的插件通信方案等等。

### 和更多团队伙伴合作
在团队内部，`EMP`已经落地了多个项目，目前正在和更多团队伙伴合作，希望 `EMP` 能够成为更多团队的标配。