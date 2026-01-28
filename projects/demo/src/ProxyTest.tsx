import {
  ApiOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SendOutlined,
} from '@ant-design/icons'
import {Alert, Button, Card, Divider, Space, Spin, Tag, Typography} from 'antd'
import React, {useState} from 'react'
import './ProxyTest.scss'

const {Title, Paragraph, Text} = Typography

interface ApiResponse {
  success: boolean
  message?: string
  data?: any
  error?: string
  timestamp?: number
}

interface TestResult {
  endpoint: string
  status: 'pending' | 'success' | 'error'
  response?: any
  error?: string
  duration?: number
}

const ProxyTest: React.FC = () => {
  const [results, setResults] = useState<Record<string, TestResult>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  const testEndpoint = async (endpoint: string, method: 'GET' | 'POST' = 'GET', body?: any) => {
    const key = endpoint
    setLoading(prev => ({...prev, [key]: true}))
    setResults(prev => ({
      ...prev,
      [key]: {endpoint, status: 'pending'},
    }))

    const startTime = Date.now()

    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      }

      if (body && method === 'POST') {
        options.body = JSON.stringify(body)
      }

      const response = await fetch(endpoint, options)
      const data = await response.json()
      const duration = Date.now() - startTime

      setResults(prev => ({
        ...prev,
        [key]: {
          endpoint,
          status: response.ok ? 'success' : 'error',
          response: data,
          duration,
        },
      }))
    } catch (error: any) {
      const duration = Date.now() - startTime
      setResults(prev => ({
        ...prev,
        [key]: {
          endpoint,
          status: 'error',
          error: error.message,
          duration,
        },
      }))
    } finally {
      setLoading(prev => ({...prev, [key]: false}))
    }
  }

  const testAll = async () => {
    const tests = [
      {endpoint: '/api/hello', method: 'GET' as const},
      {endpoint: '/api/user', method: 'GET' as const},
      {endpoint: '/api/posts', method: 'GET' as const},
    ]

    for (const test of tests) {
      await testEndpoint(test.endpoint, test.method)
      // 添加小延迟，避免请求过快
      await new Promise(resolve => setTimeout(resolve, 300))
    }
  }

  const renderResult = (key: string) => {
    const result = results[key]
    if (!result) return null

    const isLoading = loading[key]

    return (
      <Card size="small" className="result-card" style={{marginTop: 8}}>
        <Space direction="vertical" style={{width: '100%'}}>
          <Space>
            {isLoading && <Spin size="small" />}
            {!isLoading && result.status === 'success' && (
              <CheckCircleOutlined style={{color: '#52c41a', fontSize: 16}} />
            )}
            {!isLoading && result.status === 'error' && (
              <CloseCircleOutlined style={{color: '#ff4d4f', fontSize: 16}} />
            )}
            <Text strong>{result.endpoint}</Text>
            {result.duration && <Tag color="blue">{result.duration}ms</Tag>}
          </Space>

          {result.response && <pre className="response-pre">{JSON.stringify(result.response, null, 2)}</pre>}

          {result.error && <Alert message="Error" description={result.error} type="error" showIcon />}
        </Space>
      </Card>
    )
  }

  return (
    <div className="proxy-test-container">
      <Card>
        <Title level={2}>
          <ApiOutlined /> EMP Proxy 功能测试
        </Title>

        <Alert
          message="测试说明"
          description={
            <div>
              <p>
                此页面用于测试 <code>emp dev</code> 和 <code>emp serve</code> 的 proxy 代理功能。
              </p>
              <p>
                确保测试服务器已启动: <code>node test-server.js</code>
              </p>
              <p>
                代理配置: <code>/api/*</code> → <code>http://localhost:3001</code>
              </p>
            </div>
          }
          type="info"
          showIcon
          style={{marginBottom: 24}}
        />

        <Divider>基础 API 测试</Divider>

        <Space direction="vertical" style={{width: '100%'}} size="large">
          {/* Hello API */}
          <div>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={() => testEndpoint('/api/hello')}
              loading={loading['/api/hello']}
            >
              测试 GET /api/hello
            </Button>
            {renderResult('/api/hello')}
          </div>

          {/* User API */}
          <div>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={() => testEndpoint('/api/user')}
              loading={loading['/api/user']}
            >
              测试 GET /api/user
            </Button>
            {renderResult('/api/user')}
          </div>

          {/* Posts API */}
          <div>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={() => testEndpoint('/api/posts')}
              loading={loading['/api/posts']}
            >
              测试 GET /api/posts
            </Button>
            {renderResult('/api/posts')}
          </div>

          <Divider>特殊场景测试</Divider>

          {/* Delay API */}
          <div>
            <Button
              icon={<ClockCircleOutlined />}
              onClick={() => testEndpoint('/api/delay')}
              loading={loading['/api/delay']}
            >
              测试延迟响应 (2秒)
            </Button>
            {renderResult('/api/delay')}
          </div>

          {/* Error API */}
          <div>
            <Button danger onClick={() => testEndpoint('/api/error')} loading={loading['/api/error']}>
              测试错误响应
            </Button>
            {renderResult('/api/error')}
          </div>

          {/* Echo API */}
          <div>
            <Button
              onClick={() =>
                testEndpoint('/api/echo', 'POST', {
                  test: 'data',
                  timestamp: Date.now(),
                })
              }
              loading={loading['/api/echo']}
            >
              测试 POST /api/echo
            </Button>
            {renderResult('/api/echo')}
          </div>

          <Divider />

          {/* Test All */}
          <Button type="primary" size="large" block onClick={testAll} disabled={Object.values(loading).some(v => v)}>
            运行所有基础测试
          </Button>
        </Space>
      </Card>
    </div>
  )
}

export default ProxyTest
