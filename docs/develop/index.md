# 开发 
## 指令 
```json
"scripts": {
  "dev": "emp dev --env dev",
  "build": "emp build --env prod",
  "start": "emp serve",
  "analyze": "emp build --analyze"
},
```
### emp dev
+ -e, --env 部署环境 dev、test、prod 默认为 dev
+ -a, --analyze 生成分析报告 默认为 false
+ -ps, --progress  显示进度 默认为 true
+ -pr, --profile 统计模块消耗
+ -cl, --clearLog  清空日志 默认为 true
+ -wl, --wplogger  打印webpack配置 默认为 false,filename 为 输出webpack配置文件

### emp build
+ -e, --env 部署环境 dev、test、prod 默认为 dev
+ -h, --hot 是否使用热更新 默认启动
+ -o, --open 是否打开调试页面 默认不打开
+ -ps, --progress  显示进度 默认为 true
+ -pr, --profile 统计模块消耗
+ -cl, --clearLog  清空日志 默认为 true
+ -wl, --wplogger  打印webpack配置 默认为 false,filename 为 输出webpack配置文件

### emp serve
+ -cl, --clearLog  清空日志 默认为 true 

### dotenv 
+ 根目录创建 `.env.[env]` 即可 根据以上的 `--env` 定制自己的配置环境 如: 
```
DOTENV='dev'
```
+ 使用配置 内容 `process.env.env` or esnext `import.meta.env.env` 如: 
```js
console.log(process.env.env.DOTENV)
```

## 共享模式 
### empshare 配置 
* 实现3重共享模型
* empshare 与 module federation 只能选择一个配置
* shareLib 基于库共享模式
  - 可以进行 cdn 加载
  - ES import [开发中]
  - DLL方式构建共享 [需自行实现]

* shareLib 代替了MF里面的 shared 可以更好实现重型项目，大型团队的共享灵活性问题

## 多入口模式 
### 配置
多入口模式配置 `emp-config.js` 如下: 
```js
module.exports={
  // favicion 需要在 html里面配置 
  html: {favicon: 'src/favicon.ico'},
  // entries 会继承 Html配置
  entries: {
    'index.ts': {title: '首页'},
    //可自定义htmlOptions参数 覆盖html
    'work/index.ts': {title: '作品', template: 'src/work/index.html'},
    'info.tsx': {title: '介绍'},
  },
}
```
### 共享 
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

## 库模式 

