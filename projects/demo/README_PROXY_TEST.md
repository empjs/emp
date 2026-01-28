# EMP Proxy 功能测试用例

> 完整的 EMP proxy 代理功能测试套件，验证 `emp dev` 和 `emp serve` 的代理能力

## 🎯 项目说明

本测试用例用于验证 EMP CLI 的 proxy 代理功能，确保在开发模式和生产模式下都能正确地将前端请求代理到后端 API 服务器。

## ⚡ 快速开始

### 1️⃣ 启动测试 API 服务器

```bash
pnpm test:server
```

### 2️⃣ 启动前端服务器

**开发模式:**
```bash
pnpm dev
```

**生产模式:**
```bash
pnpm build
pnpm start
```

### 3️⃣ 访问测试页面

打开浏览器访问: **http://localhost:8000/proxy-test.html**

## 📁 项目结构

```
demo/
├── test-server.js              # 测试 API 服务器
├── src/
│   ├── ProxyTest.tsx          # 测试组件
│   ├── ProxyTest.scss         # 组件样式
│   └── proxy-test.tsx         # 测试入口
├── emp.config.ts              # EMP 配置（含 proxy）
├── package.json               # 测试脚本
├── PROXY_QUICKSTART.md        # 快速开始指南
├── PROXY_TEST.md              # 详细测试文档
├── PROXY_TEST_SUMMARY.md      # 测试总结
└── README_PROXY_TEST.md       # 本文件
```

## 🧪 测试端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/hello` | GET | 基础响应测试 |
| `/api/user` | GET | 用户信息 |
| `/api/posts` | GET | 文章列表 |
| `/api/delay` | GET | 延迟响应（2秒） |
| `/api/error` | GET | 错误响应 |
| `/api/echo` | POST | Echo 服务 |

## ⚙️ Proxy 配置

在 `emp.config.ts` 中配置：

```typescript
export default defineConfig(store => {
  return {
    server: {
      port: 8000,
      proxy: [
        {
          context: ['/api'],
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      ],
    },
    // ... 其他配置
  }
})
```

## 📜 可用脚本

```bash
# 启动测试 API 服务器
pnpm test:server

# 测试开发模式（需先启动 test:server）
pnpm test:proxy:dev

# 测试生产模式（需先启动 test:server）
pnpm test:proxy:prod

# 常规开发
pnpm dev

# 构建
pnpm build

# 启动生产服务器
pnpm start
```

## ✅ 测试验证

在测试页面中验证以下功能：

- [x] GET 请求代理
- [x] POST 请求代理
- [x] 延迟响应处理
- [x] 错误响应处理
- [x] 开发模式代理
- [x] 生产模式代理
- [x] 两种模式行为一致

## 🔍 技术实现

### 开发模式 (emp dev)
- 使用 `@rspack/dev-server`
- 内置 proxy 支持

### 生产模式 (emp serve)
- 使用 `connect` + `http-proxy-middleware`
- 手动配置代理中间件
- 读取 `store.server.proxy` 配置

## 📚 文档导航

- **[快速开始](./PROXY_QUICKSTART.md)** - 最快速的测试方法
- **[详细测试文档](./PROXY_TEST.md)** - 完整的测试说明和故障排除
- **[测试总结](./PROXY_TEST_SUMMARY.md)** - 测试用例总结和技术细节

## 🎨 测试界面功能

- 📡 单独测试每个 API 端点
- 🔄 批量运行所有测试
- ✅ 实时状态指示（成功/失败/加载）
- ⏱️ 响应时间显示
- 📄 JSON 响应格式化显示
- ⚠️ 错误信息提示

## 🐛 常见问题

### 连接被拒绝
**原因**: test-server.js 未运行  
**解决**: 运行 `pnpm test:server`

### 404 错误
**原因**: proxy 配置未生效  
**解决**: 检查 emp.config.ts，重启服务器

### 类型错误
**原因**: proxy 类型定义不匹配  
**解决**: 使用 `as any` 类型断言（已配置）

## 🎯 成功标准

- ✅ 所有 API 测试返回正确响应
- ✅ 响应时间 < 100ms（延迟测试除外）
- ✅ 错误场景正确处理
- ✅ 开发和生产模式行为一致

## 🔗 相关链接

- [EMP GitHub](https://github.com/empjs/emp)
- [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)
- [Rspack DevServer](https://rspack.dev/config/dev-server)

## 📝 测试报告模板

测试完成后，请记录：

```
测试日期: ____________________
测试人员: ____________________

开发模式 (emp dev):
  [ ] GET /api/hello
  [ ] GET /api/user
  [ ] GET /api/posts
  [ ] GET /api/delay
  [ ] GET /api/error
  [ ] POST /api/echo

生产模式 (emp serve):
  [ ] GET /api/hello
  [ ] GET /api/user
  [ ] GET /api/posts
  [ ] GET /api/delay
  [ ] GET /api/error
  [ ] POST /api/echo

结论: [ ] 通过  [ ] 失败

备注: ____________________
```

## 🎉 总结

这是一个完整的 EMP proxy 功能测试套件，包含：

- ✅ 模拟后端 API 服务器
- ✅ 可视化测试界面
- ✅ 完整的测试文档
- ✅ 便捷的测试脚本
- ✅ 开发和生产环境全覆盖

通过本测试用例，可以全面验证 EMP 的 proxy 代理功能是否正常工作！

---

**Happy Testing! 🚀**
