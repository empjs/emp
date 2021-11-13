# E-TSC ⚡

<p>
  <a href="https://npmjs.com/package/@efox/etsc"><img src="https://img.shields.io/npm/v/@efox/etsc.svg" alt="npm package"></a>
  <a href="https://nodejs.org/en/about/releases/"><img src="https://img.shields.io/node/v/@efox/etsc.svg" alt="node compatibility"></a>
</p>

> 基于 esbuild 的 ts开发环境 
+ 📦 实例 [DEMO](https://github.com/efoxTeam/emp/tree/next/projects/etsc-demo)

## 安装 
`yarn add @efox/etsc -D` 

## 运行命令  
+ `yarn dev` 开发环境 
+ `yarn build` 生产环境 

## 命令选项 
 + `-s, --src <src>` 源码目录 默认为 src
 + `-o, --outdir <outdir>` 源码目录 默认为 dist
 + `-t, --target <target>` 生产环境 默认为 es2018
 + `-f, --format <format>` 模块格式 默认为 cjs
 + `-p, --platform <platform>` 平台模式 默认为 node
 + `-m, --minify` 是否压缩 默认为 false
 + `-b, --bundle` bundle 模式 默认为 false
 + `-log, --logLevel <logLevel>` 默认为 debug
 + `-de, --debug` 显示调试日志 默认为 false

## tsconfig.json
```json
{
    "include": [
        "src"
    ],
    "compilerOptions": {
        "experimentalDecorators":true,
        "emitDecoratorMetadata": true,
        "strict": true,
        "declaration": true,
        "sourceMap": true,
        "noUnusedLocals": true,
        "esModuleInterop": true
    }
}

```
