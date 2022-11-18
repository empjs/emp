# 多页面模式
## entries 配置
多页面模式配置 `emp-config.js` 如下:
```js
module.exports={
  // favicion 需要在 html里面配置
  html: {favicon: 'src/favicon.ico'},
  // entries 会继承 Html配置
  // key为入口文件 基于 appSrc 默认 `src/` 的相对路径
  entries: {
    'index.ts': {title: '首页'},
    //可自定义htmlOptions参数 覆盖html
    'work/index.ts': {title: '作品', template: 'src/work/index.html'},
    'info.tsx': {title: '介绍'},
  },
}
```
## 共享模板
多入口会继承 `empShare` 的所有共享 需要自定义的话可以增加自定义模板 如
```html
<!DOCTYPE html>
  <head>
  <!-- EMP inject css 可以屏蔽或者自定义这部分内容 -->
  <% for (let i in htmlWebpackPlugin.options.files.css) { %>
    <link rel="stylesheet" href="<%= htmlWebpackPlugin.options.files.css[i] %>" /><% } %>
    <!-- EMP inject js 可以屏蔽或者自定义这部分内容 -->
    <% for (let i in htmlWebpackPlugin.options.files.js) { %>
    <script src="<%= htmlWebpackPlugin.options.files.js[i] %>"></script><% } %>
  </head>

  <body>
    <div id="emp-root"></div>
  </body>
</html>
```
