# Typescript
## tsconfig.json 配置
+ `@efox/emp` 集成了 `@efox/emp-tsconfig` 与 `Css Module 提示`
+ 集成了emp内置的资源 TS类型
+ 设置方式如下:

```json
{
  "extends": "@efox/emp/emp-tsconfig.json",
  "compilerOptions": {
    "types": ["@efox/emp/client"],
    "baseUrl": ".",
  },
  "include": [
    "src",
  ]
}
```
## 类型生成
在`emp build`下 如果是ts开发，会根据 `expose` <b>自动</b>生成相应的 `d.ts` 到 `dist/empShareTypes` 里面

## 类型同步
`emp dts` 会<b>自动</b>根据 `empShare.remote` 配置生成相应文件到 `src/empShareTypes` 如:

```js
empShare: {
  name: 'microApp',
  remotes: {
    // emp dts 会自动生成 @microHost.d.ts 到 `src/empShareTypes`
    '@microHost': `microHost@http://localhost:8001/emp.js`,
  },
  exposes: {
    // emp build 会自动生成类型到 dist/empShareTypes/index.d.ts
    './App': './src/App',
  },
}
```
