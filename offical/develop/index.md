# 安装
## 全局安装
> 支持 emp init 等初始化项目的指令
```
npm i -g @efox/emp
yarn add -g @efox/emp
pnpm add -g @efox/emp
```

## 项目安装依赖
```
npm i @efox/emp --dev
yarn add @efox/emp -D
pnpm add @efox/emp -D
```


## Browser 兼容
### IE浏览器
+ babel-polyfill

如果在编译产物时没有做额外的兼容处理，又想要在`IE`上运行时。
需要在核心代码执行前加载额外的`polyfill`
```html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <script src="//yourhost/babel-polyfill.min.js"></script>
    </head>

    <body>
      <div id="emp-root"></div>
    </body>
  </html>
```
某些特性，如Proxy。babel-polyfill并不会兼容，需要业务侧自己做处理。
babel-polyfill 兼容特性见 <a href="https://kangax.github.io/compat-table/es6/#ie11">[文档]</a>


+ import EMP模块链接出错
	+ EMP沿用了webpack的打包机制
	+ 当你没有指定打包 `publicPath ` 时, 会根据`import.meta.url`,`currentScript`等规则拼接子js的url
	+ 由于在IE上不支持`currentScript`，所以需要打进兼容js，否则有可能会出现子js url错误问题
	+ 参考链接：<a href="https://webpack.docschina.org/guides/public-path/#Automatic-publicPath-automaticpublicPath">[介绍]</a>

## Q&A
### window 相关
> 使用 Windows 开发，编译过程中报错提示 "Access is denied"
  + A: 右键“以管理员身份打开”，重新执行命令即可。
