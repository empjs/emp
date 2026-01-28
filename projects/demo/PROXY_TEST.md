# EMP Proxy 功能测试

本测试用例用于验证 `emp dev` 和 `emp serve` 的 proxy 代理功能是否正常工作。

## 测试目标

验证在开发模式（`emp dev`）和生产模式（`emp serve`）下，proxy 配置能够正确地将前端请求代理到后端 API 服务器。

## 测试环境

- **前端服务器**: `http://localhost:8000` (emp dev/serve)
- **后端 API 服务器**: `http://localhost:3001` (test-server.js)
- **代理配置**: `/api/*` → `http://localhost:3001`

## 文件说明

### 1. `test-server.js`
模拟后端 API 服务器，提供以下测试端点：

- `GET /api/hello` - 基础响应测试
- `GET /api/user` - 返回用户信息
- `GET /api/posts` - 返回文章列表
- `GET /api/delay` - 延迟响应测试（2秒）
- `GET /api/error` - 错误响应测试
- `POST /api/echo` - Echo 服务，返回请求体

### 2. `src/ProxyTest.tsx`
React 测试组件，提供可视化界面测试各个 API 端点。

### 3. `src/proxy-test.tsx`
测试页面入口文件。

### 4. `emp.config.ts`
EMP 配置文件，包含 proxy 配置：

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

**注意**: `@rspack/dev-server` 要求 proxy 必须是数组格式，每个元素包含 `context` 和其他选项。

## 测试步骤

### 方式一：自动化测试（推荐）

使用提供的测试脚本一键运行所有测试：

```bash
# 测试开发模式
pnpm test:proxy:dev

# 测试生产模式
pnpm test:proxy:prod
```

### 方式二：手动测试

#### 1. 启动后端 API 服务器

```bash
node test-server.js
```

你应该看到类似以下输出：

```
🚀 Test API Server is running on http://localhost:3001

Available endpoints:
  GET  http://localhost:3001/api/hello   - Basic hello response
  GET  http://localhost:3001/api/user    - User information
  GET  http://localhost:3001/api/posts   - Posts list
  GET  http://localhost:3001/api/delay   - Delayed response (2s)
  GET  http://localhost:3001/api/error   - Error response
  POST http://localhost:3001/api/echo    - Echo request body
```

#### 2. 测试开发模式 (emp dev)

在新的终端窗口中：

```bash
pnpm dev
```

访问测试页面：
```
http://localhost:8000/proxy-test.html
```

#### 3. 测试生产模式 (emp serve)

首先构建项目：

```bash
pnpm build
```

然后启动生产服务器：

```bash
pnpm start
```

访问测试页面：
```
http://localhost:8000/proxy-test.html
```

## 测试验证

在测试页面中，点击各个测试按钮，验证以下内容：

### ✅ 成功标准

1. **基础 API 测试**
   - ✅ GET /api/hello 返回成功响应
   - ✅ GET /api/user 返回用户信息
   - ✅ GET /api/posts 返回文章列表

2. **特殊场景测试**
   - ✅ 延迟响应能够正常等待并返回
   - ✅ 错误响应能够正确处理
   - ✅ POST 请求能够正确发送和接收数据

3. **代理功能验证**
   - ✅ 请求从 `http://localhost:8000/api/*` 发出
   - ✅ 实际请求到达 `http://localhost:3001/api/*`
   - ✅ 响应正确返回到前端
   - ✅ 开发模式和生产模式行为一致

### 📊 预期结果

每个测试按钮点击后应该显示：

- ✅ 绿色对勾图标表示成功
- 📊 响应时间标签（蓝色）
- 📄 JSON 格式的响应内容

示例成功响应：

```json
{
  "success": true,
  "message": "Hello from test API server!",
  "timestamp": 1706428800000,
  "path": "/api/hello"
}
```

## 常见问题

### 1. 连接被拒绝 (Connection Refused)

**问题**: 点击测试按钮后显示连接错误

**解决方案**: 
- 确保 `test-server.js` 正在运行
- 检查端口 3001 是否被占用
- 查看 test-server.js 的控制台输出

### 2. 404 Not Found

**问题**: 请求返回 404 错误

**解决方案**:
- 检查 proxy 配置是否正确
- 确认 emp.config.ts 中的 proxy 配置已保存
- 重启 emp dev 或 emp serve

### 3. CORS 错误

**问题**: 浏览器控制台显示 CORS 错误

**解决方案**:
- 确保 proxy 配置中 `changeOrigin: true`
- test-server.js 已经设置了 CORS 头，不应该出现此问题

### 4. 类型错误

**问题**: emp.config.ts 显示类型错误

**解决方案**:
- 确保 proxy 配置使用了 `as any` 类型断言
- 这是正常的，因为类型定义可能不完全匹配

## 调试技巧

### 查看请求日志

1. **后端日志**: test-server.js 会打印所有收到的请求
2. **浏览器 Network**: 打开浏览器开发者工具的 Network 标签
3. **EMP 日志**: 查看 emp dev/serve 的控制台输出

### 验证代理是否生效

在浏览器控制台执行：

```javascript
// 应该通过代理访问后端
fetch('/api/hello')
  .then(r => r.json())
  .then(console.log)
```

如果代理工作正常，你应该看到来自 test-server.js 的响应。

## 测试报告

测试完成后，请记录以下信息：

- [ ] emp dev 模式下所有测试通过
- [ ] emp serve 模式下所有测试通过
- [ ] 代理配置正确转发请求
- [ ] 响应时间合理（< 100ms，延迟测试除外）
- [ ] 错误处理正确

## 扩展测试

你可以通过修改 `emp.config.ts` 测试更多 proxy 功能：

### 路径重写

```typescript
proxy: [
  {
    context: ['/api'],
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {'^/api': '/v1/api'}, // /api/hello -> /v1/api/hello
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

## 总结

此测试用例全面验证了 EMP 的 proxy 功能，确保开发模式和生产模式下的代理行为一致。通过可视化的测试界面，可以快速验证各种场景下的代理功能是否正常工作。
