# 多入口 解决方案 
> 自动化多入口解决方案
## emp-config.js 配置 
```js
/**
 * @type {import('@efox/emp-cli').EMPConfig}
 */
module.exports = {
  // pages: true, //开启多入口 默认为 
  // 自定义配置化 
  pages: {
    root:'src/pages',
    router: {
      about: {
        title: '关于我们',
      },
    },
  },
}
``` 
## 配置详情 
+ [类型文件](https://github.com/efoxTeam/emp/blob/75aeb8aadc51c87eb00b63be63764e31341135e0/packages/emp-cli/types/emp-config.d.ts#L69) 
+ 默认支持多入口引用MF方案