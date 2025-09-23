import type {ErrorInfo, ReactNode} from 'react'
import React, {Component} from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error)
    console.error('Component stack:', errorInfo.componentStack)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // 如果提供了自定义的fallback，则使用它
      if (this.props.fallback) {
        return this.props.fallback
      }

      // 默认的错误UI
      return (
        <div
          style={{
            padding: '20px',
            margin: '10px',
            border: '1px solid #f5222d',
            borderRadius: '4px',
            backgroundColor: '#fff1f0',
          }}
        >
          <h3 style={{color: '#f5222d'}}>组件加载失败</h3>
          <p>发生了一个错误，无法正确加载组件。</p>
          <details style={{whiteSpace: 'pre-wrap'}}>
            <summary>查看错误详情</summary>
            {this.state.error && this.state.error.toString()}
          </details>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary as any
