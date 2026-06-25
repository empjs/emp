# Proxy 配置格式更新说明

## 🔄 重要变更

由于 `@rspack/dev-server` 的要求，proxy 配置格式已从**对象格式**改为**数组格式**。

## ❌ 旧格式（不再支持）

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
    },
  }
}
```

## ✅ 新格式（正确）

```typescript
server: {
  proxy: [
    {
      context: ['/api'],
      target: 'http://localhost:3001',
      changeOrigin: true,
    },
  ]
}
```

## 📝 关键变化

1. **数组格式**: proxy 必须是一个数组
2. **context 属性**: 路径匹配规则移到 `context` 属性中
3. **context 值**: `context` 的值也必须是数组（即使只有一个路径）

## 🔧 配置示例

### 单个代理规则

```typescript
proxy: [
  {
    context: ['/api'],
    target: 'http://localhost:3001',
    changeOrigin: true,
  },
]
```

### 多个路径匹配同一目标

```typescript
proxy: [
  {
    context: ['/api', '/v1/api'],
    target: 'http://localhost:3001',
    changeOrigin: true,
  },
]
```

### 多个代理规则

```typescript
proxy: [
  {
    context: ['/api'],
    target: 'http://localhost:3001',
    changeOrigin: true,
  },
  {
    context: ['/auth'],
    target: 'http://localhost:3002',
    changeOrigin: true,
  },
]
```

### 路径重写

```typescript
proxy: [
  {
    context: ['/api'],
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {'^/api': '/v1'},
  },
]
```

### WebSocket 代理

```typescript
proxy: [
  {
    context: ['/ws'],
    target: 'ws://localhost:3001',
    ws: true,
  },
]
```

## 🛠️ 技术实现

### 开发模式 (emp dev)

`@rspack/dev-server` 直接使用数组格式的 proxy 配置。

### 生产模式 (emp serve)

`prod.ts` 中的处理逻辑：

```typescript
if (store.server.proxy && Array.isArray(store.server.proxy)) {
  store.server.proxy.forEach((proxyItem: any) => {
    const {context, ...options} = proxyItem
    const contexts = Array.isArray(context) ? context : [context]
    contexts.forEach((ctx: string) => {
      app.use(createProxyMiddleware(ctx, options) as connect.NextHandleFunction)
    })
  })
}
```

## ⚠️ 常见错误

### 错误 1: 使用对象格式

```
ValidationError: options.proxy should be an array
```

**解决**: 将 proxy 配置改为数组格式

### 错误 2: context 不是数组

```typescript
// ❌ 错误
proxy: [
  {
    context: '/api',  // context 应该是数组
    target: 'http://localhost:3001',
  },
]

// ✅ 正确
proxy: [
  {
    context: ['/api'],  // context 必须是数组
    target: 'http://localhost:3001',
  },
]
```

## 📚 参考文档

- [webpack-dev-server proxy 配置](https://webpack.js.org/configuration/dev-server/#devserverproxy)
- [http-proxy-middleware 文档](https://github.com/chimurai/http-proxy-middleware)
- [@rspack/dev-server 文档](https://rspack.dev/config/dev-server)

## ✅ 更新清单

已更新的文件：

- [x] `emp.config.ts` - 主配置文件
- [x] `src/server/connect/prod.ts` - 生产服务器代理处理
- [x] `PROXY_TEST.md` - 详细测试文档
- [x] `PROXY_TEST_SUMMARY.md` - 测试总结
- [x] `README_PROXY_TEST.md` - 项目 README
- [x] `PROXY_CONFIG_UPDATE.md` - 本文件

所有文档中的配置示例已统一更新为数组格式。
