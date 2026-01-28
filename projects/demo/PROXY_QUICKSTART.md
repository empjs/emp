# EMP Proxy 测试 - 快速开始

## 🚀 快速测试

### 步骤 1: 启动测试 API 服务器

在第一个终端窗口中运行：

```bash
cd /Users/bigo/Desktop/Develop/emp-workspace/emp/projects/demo
pnpm test:server
```

你应该看到：
```
🚀 Test API Server is running on http://localhost:3001
```

### 步骤 2: 测试开发模式

在第二个终端窗口中运行：

```bash
cd /Users/bigo/Desktop/Develop/emp-workspace/emp/projects/demo
pnpm dev
```

然后访问: **http://localhost:8000/proxy-test.html**

### 步骤 3: 测试生产模式

先构建项目：

```bash
pnpm build
```

然后启动生产服务器：

```bash
pnpm start
```

访问: **http://localhost:8000/proxy-test.html**

## ✅ 验证测试

在测试页面中：

1. 点击 **"测试 GET /api/hello"** 按钮
2. 应该看到绿色对勾 ✅ 和 JSON 响应
3. 点击 **"运行所有基础测试"** 按钮测试所有 API

## 📝 预期结果

成功的响应示例：

```json
{
  "success": true,
  "message": "Hello from test API server!",
  "timestamp": 1706428800000,
  "path": "/api/hello"
}
```

## 🔍 验证代理工作

打开浏览器控制台，运行：

```javascript
fetch('/api/hello').then(r => r.json()).then(console.log)
```

如果看到来自 test-server 的响应，说明代理工作正常！

## 📚 更多信息

详细测试说明请查看: [PROXY_TEST.md](./PROXY_TEST.md)
