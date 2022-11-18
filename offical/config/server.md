# Server 服务选项
> 继承 webpack dev server 所有配置
+ 类型 `ServerOptions`
## server.server
> 4.4.0 (2021-10-27)
+ 增加 `server` 选项 例如 `{ server: { type: 'http', options: { maxHeaderSize: 32768 } } }`
+ 类型 `"http" | "https" | "spdy" | { type: "http" | "https" | "spdy", options }`
+ 详细文档 [点击](https://webpack.js.org/configuration/dev-server/#devserverserver)
+ 升级详情 [changelog](https://github.com/webpack/webpack-dev-server/blob/master/CHANGELOG.md#440-2021-10-27)
## server.https
+ 类型 `https.ServerOptions` [新版本将弃置]
## server.http2
+ 类型 `boolean` [新版本将弃置]
