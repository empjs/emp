# emp-tune-dts-plugin 定制 ts 类型

> 自动生成定制的 d.ts 文件

## 安装

`npm i @efox/emp-tune-dts-plugin` or `yarn global add @efox/emp-tune-dts-plugin`

## 在 Webpack 上使用插件

```js
const { TuneDtsPlugin } = require('@efox/emp-tune-dts-plugin')
```

方式(1)(推荐)

```js
const createName = 'index.d.ts'
const createPath = './dist'
function operationDemo(fileData) {
  console.log(fileData)
  return fileData;
}
plugin.tunedts = {
  plugin: TuneDtsPlugin,
  args: [
      {
          output: path.join(createPath, createName),
          path: createPath,
          name: createName,
          isDefault:true,
          // 传入函数自定义操作
          operation: operationDemo
        },
  ],
};
```

方式(2)

```js
function operationDemo(fileData) {
  console.log(fileData)
  return fileData;
}
plugins: [
    new TuneDtsPlugin({
          output: path.join(createPath, createName),
          path: createPath,
          name: createName,
          isDefault:true,
          // 传入函数自定义操作
          operation: operationDemo
        })
```

参数解释：
| 参数名 | 类型 | 解释 |
| ---- | ---- | --- |
| output| string (必填)| d.ts 文件输出目录|
| path| string (必填)| d.ts 文件夹路径|
| name| string (必填)| d.ts 文件名|
| isDefault | boolean(必填) | 是否执行默认 replace 操作 |
| operation| Function (选填)| 自定义操作 d.ts 文件函数（isDefault 为 true 时，operation 会继承 默认 Replace 后的内容）。入参为 d.ts 文件内容，操作完成后必须返回 d.ts 数据。 operationDemo 为例子|

## 单独引用 d.ts 定制模块（不含生成 d.ts 文件）

```ts
const { tuneType } = require('@efox/emp-tune-dts-plugin')
const createName = 'index.d.ts'
const createPath = './dist'
tuneType(createPath, createName, true)
```

参数解释：
| 参数名 | 类型 | 解释 |
| ---- | ---- | --- |
|path|string (必填)| d.ts 文件夹路径|
|name|string (必填)| d.ts 文件名|
| isDefault | boolean(必填) | 是否执行默认 replace 操作 |
| operation| Function (选填)| 自定义操作 d.ts 文件函数（isDefault 为 true 时，operation 会继承 默认 Replace 后的内容）。入参为 d.ts 文件内容，操作完成后必须返回 d.ts 数据。 operationDemo 为例子|
