# EMP Share 共享模式
## empshare 介绍
* 实现3重共享模型
  - [基础库] -> [基站] -> [引用]
* `empshare` 与 `moduleFederation` 配置可以 `config.empShare` 里面进行配置
* shareLib 基于库共享模式
  - 可以进行 cdn 加载
  - ES import [DEMO](https://github.com/efoxTeam/emp/blob/f54a9a2475c197ef935cde8cb8dcb2458f963d1e/projects/demo/emp-config.js#L24)
  - DLL方式构建共享 [需自行实现]

* shareLib 代替了MF里面的 shared 可以更好实现重型项目，大型团队的共享灵活性问题

* 注意!!! 在 `moduleFederation` 配置中,如果项目需要导出模块供其它项目使用,除了在 empShare.exposes 中配置外,还需要在项目根目录中添加 `bootstrap.js` 或 `bootstrap.ts` 文件作为 webpack 导出模块的引导文件 [为什么?](https://webpack.docschina.org/concepts/module-federation/#troubleshooting) [如何配置?](https://github.com/efoxTeam/emp/blob/next/projects/vue-2-base/src/main.js)
## empshare 配置
```js
module.exports={
   empShare: {
   name: 'microApp',
   remotes: {
     '@microHost': `microHost@http://localhost:8001/emp.js`,
   },
   exposes: {
     './App': './src/App',
   },
   // 实现 Module Feration 与 shareLib 只能保留一个
   shared: {
     react: {requiredVersion: '^17.0.1'},
     'react-dom': {requiredVersion: '^17.0.1'},
   },
   // 实现 emp share 的 三级共享模式 与 shared 只能保留一个,地址可以自行判断
   shareLib: {
     react: 'React@https://cdn.jsdelivr.net/npm/react@17.0.2/umd/react.development.js',
     'react-dom': 'ReactDOM@https://cdn.jsdelivr.net/npm/react-dom@17.0.2/umd/react-dom.development.js',
   }
   },
}
```
