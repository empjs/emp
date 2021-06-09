# @efox/emp-sharemf-exposes-plugin

> 将ModuleFederation中exposes的值提供外部使用


## 🔗 Install
`yarn add @efox/emp-sharemf-exposes-plugin`

## Use
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
})();
```


