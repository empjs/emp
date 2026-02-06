# emp.config.ts 配置参考

## 配置文件命名

支持以下文件名（按优先级）：

- `emp-config.ts` / `emp-config.js`
- `emp.config.ts` / `emp.config.js`
- `emp-config.mjs` / `emp-config.cjs` / `emp-config.mts` / `emp-config.cts`
- `emp.config.mjs` / `emp.config.cjs` / `emp.config.mts` / `emp.config.cts`

## 顶层配置

| 字段 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `appSrc` | string | `'src'` | 源码目录 |
| `appEntry` | string | `'index.{ts,tsx,jsx,js}'` | 入口文件名，entries 设置后失效 |
| `base` | string | `undefined` | publicPath，业务模式默认 auto |
| `plugins` | Function[] | - | 插件数组，每项为 `(store) => rsConfig` |
| `server` | ServerType | - | 开发服务器配置 |
| `build` | BuildType | - | 构建配置 |
| `html` | HtmlType | - | HTML 模板配置 |
| `entries` | Record | - | 多入口配置 |
| `resolve` | Resolve | - | 模块解析（alias、extensions） |
| `define` | Record | - | 全局变量注入 |
| `chain` | (chain) => void | - | Rspack 链式配置 |
| `lifeCycle` | LifeCycleOptions | - | 生命周期钩子 |

## server

| 字段 | 默认 | 说明 |
|------|------|------|
| `host` | `'0.0.0.0'` | 访问 host |
| `port` | `8000` | 端口 |
| `open` | `false`(darwin 为 true) | 自动打开浏览器 |
| `hot` | `true` | 热更新 |
| `proxy` | - | 代理配置，需为数组 |

## build

| 字段 | 默认 | 说明 |
|------|------|------|
| `outDir` | `'dist'` | 输出目录 |
| `target` | `'es5'` | 目标环境 es5/es2017 等 |
| `sourcemap` | 开发 true | 源码映射 |
| `minify` | 生产 true | 压缩 |
| `polyfill.mode` | - | `'entry'` \| `'usage'` |
| `polyfill.entryCdn` | - | polyfill CDN 地址 |
| `polyfill.browserslist` | - | 浏览器兼容 |

## html

| 字段 | 默认 | 说明 |
|------|------|------|
| `template` | - | 自定义 HTML 模板路径 |
| `title` | `'EMP'` | 页面标题 |
| `favicon` | - | favicon |
| `inject` | `'body'` | 脚本注入位置 |
