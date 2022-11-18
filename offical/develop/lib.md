
# 库模式 <sup>Beta</sup>
> 已支持 各种模块 export 支持 IE兼容，worker模式下 需要手动复制worker，inline方式需要支持
## build.lib 配置
```js
type FileNameType = (format: string) => string
export type LibModeType = {
  /**
   * 全局变量 用作 amd umd var window 等共享
   */
  name?: string
  /**
   *  入口文件 基于 AppSrc 目录 如 `src/index.js` 填写 `index.js` 即可
   * @default `index.js`
   */
  entry: webpack entry
  /**
   * fileName
   * @default [format]/[name].js 建议 format 为目录 避免不同格式代码混淆
   */
  fileName?: FileNameType | string
  /**
   * 输出格式 如 [umd,esm]
   * @default [umd]
   */
  formats: buildLibType[]
  /**
   * 提供额外的 全局变量 具体参考 https://webpack.js.org/configuration/externals/#root
   */
  external?: Configuration['externals']
}

```
## build.lib.entry
+ 类型 [webpack.entry](https://webpack.js.org/configuration/entry-context/#entry)

## build.lib.formats
+ 类型 `buildLibType[]`
+ 默认值 `[umd,esm]`

## package.json 配置

## package.json.单入口
```json
{
  "name": "emp-lib", // 没设置 build.lib.name 的情况下 默认生成类型名称 为 name
  "main": "dist/umd/emp-lib.js", // umd 入口
  "module": "dist/esm/emp-lib.js", // esm 入口
  "types": "dist/empShareTypes/lib.d.ts", // 类型文件入口
}

```
## package.json.多入口
`typescript` `package.json` 库模式多入口配置方案 利用 `exports` 代替 `main` `module`
```json
{
	"typesVersions": {
		"*": {
			".": [ "./dist/types/index.d.ts" ],
			"*": [ "./dist/types/*" ]
		}
	},
  "exports": {
    ".": {
      "import": "./dist/esm/index.js",
      "require": "./dist/umd/index.js"
    },
    "./": {
      "import": "./dist/esm/",
      "require": "./dist/umd/"
    }
  },
}
```
# ESM 模式 [Beta]
> 已支持 MF的 ESM共享，热更存在bug问题
+ [DEMO](https://github.com/efoxTeam/emp/tree/main/projects/demo)
