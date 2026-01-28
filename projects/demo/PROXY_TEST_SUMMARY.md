# EMP Proxy 功能测试用例总结

## 📋 测试概述

本测试用例验证了 EMP CLI 在开发模式（`emp dev`）和生产模式（`emp serve`）下的 proxy 代理功能。

## 🎯 测试目标

验证通过 `emp.config.ts` 中的 `server.proxy` 配置，能够将前端请求正确代理到后端 API 服务器。

## 📁 测试文件清单

### 核心文件

1. **test-server.js** - 模拟后端 API 服务器
   - 端口: 3001
   - 提供 6 个测试端点
   - 支持 GET/POST 请求
   - 包含延迟和错误场景

2. **src/ProxyTest.tsx** - React 测试组件
   - 可视化测试界面
   - 支持单个和批量测试
   - 实时显示响应结果
   - 错误处理和加载状态

3. **src/ProxyTest.scss** - 测试组件样式

4. **src/proxy-test.tsx** - 测试页面入口

### 配置文件

5. **emp.config.ts** - 更新的配置
   ```typescript
   server: {
     port: 8000,
     proxy: [
       {
         context: ['/api'],
         target: 'http://localhost:3001',
         changeOrigin: true,
       },
     ],
   }
   ```

6. **package.json** - 新增测试脚本
   - `test:server` - 启动测试服务器
   - `test:proxy:dev` - 测试开发模式
   - `test:proxy:prod` - 测试生产模式

### 文档文件

7. **PROXY_TEST.md** - 详细测试文档
8. **PROXY_QUICKSTART.md** - 快速开始指南
9. **PROXY_TEST_SUMMARY.md** - 本文件

## 🧪 测试端点

### 基础 API 测试

| 端点 | 方法 | 描述 | 预期结果 |
|------|------|------|----------|
| `/api/hello` | GET | 基础响应 | 返回欢迎消息 |
| `/api/user` | GET | 用户信息 | 返回用户对象 |
| `/api/posts` | GET | 文章列表 | 返回文章数组 |

### 特殊场景测试

| 端点 | 方法 | 描述 | 预期结果 |
|------|------|------|----------|
| `/api/delay` | GET | 延迟响应 | 2秒后返回 |
| `/api/error` | GET | 错误响应 | 返回 500 错误 |
| `/api/echo` | POST | Echo 服务 | 返回请求体 |

## 🔧 技术实现

### 开发模式 (emp dev)

- 使用 `@rspack/dev-server`
- 内置 `http-proxy-middleware` 支持
- 通过 `devServer.proxy` 配置

### 生产模式 (emp serve)

- 使用 `connect` + `http-proxy-middleware`
- 手动配置代理中间件
- 从 `store.server.proxy` 读取配置

### 中间件顺序

```
1. Compression (压缩)
2. CORS (跨域)
3. Proxy (代理) ← 新增
4. Static Files (静态文件)
5. HTML Fallback (HTML 回退)
```

## ✅ 测试检查清单

### 功能测试

- [ ] GET 请求能够正确代理
- [ ] POST 请求能够正确代理
- [ ] 请求头正确传递
- [ ] 响应正确返回
- [ ] 延迟请求正常工作
- [ ] 错误响应正确处理

### 环境测试

- [ ] `emp dev` 模式下代理工作正常
- [ ] `emp serve` 模式下代理工作正常
- [ ] 两种模式行为一致

### 配置测试

- [ ] `changeOrigin` 选项生效
- [ ] 多个代理规则支持（可选）
- [ ] 路径重写功能（可选）

## 📊 测试结果示例

### 成功响应

```json
{
  "success": true,
  "message": "Hello from test API server!",
  "timestamp": 1706428800000,
  "path": "/api/hello"
}
```

### 错误响应

```json
{
  "success": false,
  "error": "Internal Server Error",
  "message": "This is a test error response"
}
```

## 🚀 运行测试

### 方式一：分步执行

```bash
# 终端 1: 启动测试服务器
pnpm test:server

# 终端 2: 启动开发服务器
pnpm dev

# 浏览器访问
http://localhost:8000/proxy-test.html
```

### 方式二：使用脚本

```bash
# 测试开发模式
pnpm test:proxy:dev

# 测试生产模式
pnpm test:proxy:prod
```

## 🎨 测试界面

测试页面提供：

- 📡 **API 测试按钮** - 单独测试每个端点
- 🔄 **批量测试** - 一键运行所有基础测试
- ✅ **状态指示** - 成功/失败/加载状态
- ⏱️ **响应时间** - 显示每个请求的耗时
- 📄 **响应预览** - JSON 格式化显示
- ⚠️ **错误提示** - 清晰的错误信息

## 🔍 调试方法

### 1. 查看后端日志

test-server.js 会打印所有收到的请求：

```
[2026-01-28T13:00:00.000Z] GET /api/hello
[2026-01-28T13:00:01.000Z] GET /api/user
```

### 2. 浏览器 Network 面板

- 查看请求 URL（应该是 `/api/*`）
- 检查响应状态码
- 查看请求/响应头

### 3. 控制台测试

```javascript
// 测试代理
fetch('/api/hello')
  .then(r => r.json())
  .then(console.log)
```

## 📝 注意事项

1. **类型断言**: proxy 配置使用 `as any` 是正常的，因为类型定义可能不完全匹配
2. **端口占用**: 确保 3001 和 8000 端口未被占用
3. **服务器启动**: 必须先启动 test-server.js
4. **构建要求**: 生产模式测试需要先执行 `pnpm build`

## 🎯 验证标准

### 成功标准

- ✅ 所有基础 API 测试通过
- ✅ 特殊场景测试通过
- ✅ 开发和生产模式行为一致
- ✅ 响应时间合理（< 100ms，延迟测试除外）
- ✅ 错误处理正确

### 失败情况

- ❌ 连接被拒绝 → 检查 test-server 是否运行
- ❌ 404 错误 → 检查 proxy 配置
- ❌ CORS 错误 → 检查 changeOrigin 设置
- ❌ 类型错误 → 添加 `as any` 断言

## 🔄 扩展测试

可以通过修改配置测试更多功能：

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

### 多个代理

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

## 📚 相关文档

- [http-proxy-middleware 文档](https://github.com/chimurai/http-proxy-middleware)
- [Rspack DevServer 文档](https://rspack.dev/config/dev-server)
- [EMP CLI 文档](https://github.com/empjs/emp)

## 🎉 总结

本测试用例提供了完整的 proxy 功能验证方案，包括：

- ✅ 完整的测试服务器
- ✅ 可视化测试界面
- ✅ 详细的测试文档
- ✅ 便捷的测试脚本
- ✅ 开发和生产环境覆盖

通过这些测试，可以确保 EMP 的 proxy 功能在各种场景下都能正常工作。
