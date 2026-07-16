/**
 * 测试 API 服务器
 * 用于验证 emp dev 和 emp serve 的 proxy 功能
 *
 * 运行方式: node test-server.js
 */

const http = require('http')

const PORT = Number(process.env.EMP_DEMO_API_PORT ?? 3101)

const server = http.createServer((req, res) => {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)

  // 路由处理
  if (req.url === '/api/hello' && req.method === 'GET') {
    // 基础 GET 请求
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(
      JSON.stringify({
        success: true,
        message: 'Hello from test API server!',
        timestamp: Date.now(),
        path: req.url,
      }),
    )
  } else if (req.url === '/api/user' && req.method === 'GET') {
    // 返回用户信息
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(
      JSON.stringify({
        success: true,
        data: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          role: 'admin',
        },
      }),
    )
  } else if (req.url === '/api/posts' && req.method === 'GET') {
    // 返回文章列表
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(
      JSON.stringify({
        success: true,
        data: [
          {id: 1, title: 'First Post', content: 'This is the first post'},
          {id: 2, title: 'Second Post', content: 'This is the second post'},
          {id: 3, title: 'Third Post', content: 'This is the third post'},
        ],
        total: 3,
      }),
    )
  } else if (req.url === '/api/delay' && req.method === 'GET') {
    // 延迟响应测试
    setTimeout(() => {
      res.writeHead(200, {'Content-Type': 'application/json'})
      res.end(
        JSON.stringify({
          success: true,
          message: 'Delayed response after 2 seconds',
          timestamp: Date.now(),
        }),
      )
    }, 2000)
  } else if (req.url === '/api/error' && req.method === 'GET') {
    // 错误响应测试
    res.writeHead(500, {'Content-Type': 'application/json'})
    res.end(
      JSON.stringify({
        success: false,
        error: 'Internal Server Error',
        message: 'This is a test error response',
      }),
    )
  } else if (req.url.startsWith('/api/echo') && req.method === 'POST') {
    // Echo 服务 - 返回请求体
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    req.on('end', () => {
      res.writeHead(200, {'Content-Type': 'application/json'})
      res.end(
        JSON.stringify({
          success: true,
          echo: body,
          headers: req.headers,
          method: req.method,
          url: req.url,
        }),
      )
    })
  } else {
    // 404 响应
    res.writeHead(404, {'Content-Type': 'application/json'})
    res.end(
      JSON.stringify({
        success: false,
        error: 'Not Found',
        path: req.url,
      }),
    )
  }
})

server.listen(PORT, () => {
  console.log(`\n🚀 Test API Server is running on http://localhost:${PORT}`)
  console.log('\nAvailable endpoints:')
  console.log(`  GET  http://localhost:${PORT}/api/hello   - Basic hello response`)
  console.log(`  GET  http://localhost:${PORT}/api/user    - User information`)
  console.log(`  GET  http://localhost:${PORT}/api/posts   - Posts list`)
  console.log(`  GET  http://localhost:${PORT}/api/delay   - Delayed response (2s)`)
  console.log(`  GET  http://localhost:${PORT}/api/error   - Error response`)
  console.log(`  POST http://localhost:${PORT}/api/echo    - Echo request body`)
  console.log('\n')
})

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down test server...')
  server.close(() => {
    console.log('✅ Server closed')
    process.exit(0)
  })
})
