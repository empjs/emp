// 公共工具函数

/**
 * 获取 React 版本号
 */
export function getReactVersion(React: any): number {
  if (!React || !React.version) return 16
  const versionStr = React.version.split('.')
  return Number.parseInt(versionStr[0], 10)
}

/**
 * 统一错误处理
 */
export function handleError(error: Error, message: string, onError?: (error: Error) => void): void {
  console.error(`[EMP-ERROR] ${message}`, error)
  if (onError) {
    onError(error)
  }
}
