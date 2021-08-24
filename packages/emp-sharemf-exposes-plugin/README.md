# @efox/emp-sharemf-exposes-plugin

> 将ModuleFederation中exposes的值提供外部使用


## 🔗 安装
`yarn add @efox/emp-sharemf-exposes-plugin`

## 使用
```
(async () => {
  // 初始化共享作用域（shared scope）用提供的已知此构建和所有远程的模块填充它
  await __webpack_init_sharing__('default');
  const container = window.someContainer; // 或从其他地方获取容器
  // 初始化容器 它可能提供共享模块
  await container.init(__webpack_share_scopes__.default);
  const module = await container.get('./module');
  // 
  module.moduleMap
  // 增加package.json version版本号
  module.v 
})();
```

## 参数
/**
 * filename: emp.js
 * unpkg: true, false, default false
 * urlMap: get projectconfig value
 * unpkgUrlMap: { prod: String, test: String, dev: String} // eg: prod: https://unpkg.yy.com/@webbase/chameleonapp@beta/chameleon_share_emp.js
 */

| name | descripe | 默认值 |
| - | - | - |
| filename | 文件名,empconfig/project-config.js中filename | emp.js |
| unpkg | 是否按照版本号生成unpkg | 默认false, 需要则增加true |
| unpkgUrlMap | 自行传入unpkg链接 | {prod: string, test: string, dev:string} |
| urlMap | 自行传入url链接，默认按照empconfig/project-config.js中配置的prod,test,dev,contet,filename生成链接 | {prod: string, test: string, dev:string} `eg: prod/context/filename` |


