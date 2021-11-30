---
home: true
# heroImage: /logo.svg
actionText: 开始使用
actionLink: /develop/

# altActionText: Learn More
# altActionLink: /guide/why

features:
  - title: 💡 微组件化
    details: 结合webpack5、Module Federation的丰富项目实战、建立三层共享模型
  - title: ⚡️ 快速构建重载
    details: 结合SWC进行bundle编译构建、提升整体构建速度.
  - title: 🛠️ 多功能模块支持
    details: 对 TypeScript、JSX、CSS、Less、Sass 等支持开箱即用。
  - title: 📦 优化的构建
    details: 可选 “多页应用” 或 “库” 模式的预配置 webpack 构建.
  - title: 🔩 通用的插件
    details: 在开发和构建之间共享 webpack chain 插件接口.
  - title: 🔑 TS重构项目
    details: 提供灵活的api、Plugin以及完整的类型提示.
footer: MIT Licensed | Copyright © 2021 Ken Xu
---

<div class="contact">
  <img src="./img/contact_me_qr.png" />
  <div class="footer">参与讨论</div>
</div>

<script setup>
import fetchReleaseTag from './.vitepress/theme/fetchReleaseTag.js'
fetchReleaseTag()
</script>

