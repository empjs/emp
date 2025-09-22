import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * 错误边界组件，用于捕获子组件中的JavaScript错误
 * 防止整个应用崩溃，并提供优雅的降级UI
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    // 更新状态，下次渲染时显示降级UI
    return {hasError: true, error}
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      // 显示自定义降级UI
      return (
        this.props.fallback || (
          <div
            style={{
              padding: '20px',
              margin: '10px',
              border: '1px solid #f5c6cb',
              borderRadius: '4px',
              backgroundColor: '#f8d7da',
              color: '#721c24',
            }}
          >
            <h3>组件加载出错</h3>
            <p>抱歉，组件渲染时发生错误。</p>
            <details style={{whiteSpace: 'pre-wrap'}}>{this.state.error && this.state.error.toString()}</details>
          </div>
        )
      )
    }

    // 正常情况下渲染子组件
    return this.props.children
  }
}

export default ErrorBoundary
