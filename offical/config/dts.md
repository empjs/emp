# Dts 生成与同步
## build.typesOutDir
+ 类型 `string`
+ 默认 `dist/empShareTypes`

当前项目声明文件输出目录

## build.typesEmpName
+ 类型 `string`
+ 默认 `index.d.ts` 生成 与 同步相同

生成EMP基站类型文件 默认为 `index.d.ts`
## build.typesLibName
+ 类型 `string`
+ 默认 `lib.d.ts`

生成库 类型文件 默认为 `lib.d.ts` 可以在package.json types 设置 `./dist/lib.d.ts`

## build.createTs
+ 类型 `boolean`
+ 默认 `false`

是否生成 d.ts

## build.jsToJsx
+ 类型 `boolean`
+ 默认 `false`

是否支持在 js 中使用 jsx

## dtsPath
+ 类型 `{[key: string]: string}`
+ 默认 `<remoteHost>/empShareTypes/index.d.ts`
+ 配置例子:
```js
   dtsPath: {
    //  '对应 remotes 里的项目名' : '.dts 文件的远程路径'
      '@microHost': 'http://127.0.0.1:8001/types/index.d.ts',
    },
```
