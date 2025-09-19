/**
 * React 适配器
 * 这个模块提供了一个适配器，用于在不同版本的 React 环境中渲染组件
 * 支持 React 16/17 和 React 18+
 */

// ================ 工具函数 ================

/**
 * 检查 React 版本号
 * @param version - React 版本字符串
 * @returns 主版本号数字
 */
const checkVersion = (version: string): number => (version ? Number(version.split('.')[0]) : 0)

/**
 * 检查对象是否为 Promise
 * @param p - 要检查的对象
 * @returns 是否为 Promise
 */
const isPromise = (p: any): boolean => p && Object.prototype.toString.call(p) === '[object Promise]'

// ================ 类型定义 ================

/**
 * React 适配器配置选项
 */
export interface ReactAdapterOptions {
  /** React 库实例 */
  React?: any
  /** ReactDOM 库实例 */
  ReactDOM?: any
  /** React 18+ createRoot 方法 */
  createRoot?: any
  /** 组件导出的作用域名称 */
  scope?: string
}

// ================ 适配器实现 ================

/**
 * React 适配器类
 * 用于在不同版本的 React 环境中适配组件渲染
 */
export class ReactAdapter {
  /** 适配器配置 */
  libs: ReactAdapterOptions = {
    scope: 'default',
  }

  /**
   * 构造函数
   * @param op - 适配器配置选项
   */
  constructor(op: ReactAdapterOptions = {}) {
    this.libs = {...this.libs, ...op}
  }

  /**
   * 适配器核心方法 - 使用类组件实现
   * @param component - 要适配的组件
   * @param scope - 组件导出的作用域名称
   * @param React - React 库实例
   * @param ReactDOM - ReactDOM 库实例
   * @returns 包装后的组件
   */
  adapter<P = any>(
    component: any,
    scope: string = this.libs.scope || 'default',
    React: any = this.libs.React,
    ReactDOM: any = this.libs.ReactDOM,
  ): P {
    // 检测 React 版本
    const reactVersion = checkVersion(React?.version || '18.0.0')
    const self = this

    /**
     * 包装组件类
     * 负责在不同版本的 React 中正确渲染原始组件
     */
    class WrappedComponent extends React.Component {
      /** 容器引用 */
      public containerRef: any
      /** React 18+ root 实例 */
      public root: any
      /** 已解析的组件 */
      private resolvedComponent: any = null

      constructor(props: P) {
        super(props as any)
        this.containerRef = React.createRef()
      }

      /**
       * 组件挂载生命周期
       */
      componentDidMount() {
        console.log('[ReactAdapter] componentDidMount')
        this.mountOriginalComponent(true) // 首次渲染
      }

      /**
       * 组件更新生命周期
       */
      componentDidUpdate() {
        console.log('[ReactAdapter] componentDidUpdate')
        this.mountOriginalComponent(false) // 更新渲染
      }

      /**
       * 组件卸载生命周期
       */
      componentWillUnmount() {
        console.log('[ReactAdapter] componentWillUnmount')
        this.unmountOriginalComponent()
      }

      /**
       * 卸载原始组件
       */
      unmountOriginalComponent() {
        if (!this.containerRef.current) return

        try {
          // 根据 React 版本使用不同的卸载方法
          if (reactVersion < 18) {
            // React 16/17
            ReactDOM.unmountComponentAtNode(this.containerRef.current)
          } else if (this.root) {
            // React 18+
            this.root.unmount()
          }
        } catch (error) {
          console.error('[ReactAdapter] 卸载组件时出错:', error)
        }
      }

      /**
       * 挂载原始组件
       * @param shouldRender - 是否为首次渲染
       */
      async mountOriginalComponent(shouldRender = false) {
        try {
          // 处理异步组件
          if (!this.resolvedComponent) {
            let resolvedComp = component
            if (isPromise(component)) {
              resolvedComp = await component.then((m: any) => m[scope])
            }
            this.resolvedComponent = resolvedComp
          }

          // 创建 React 元素
          const element = React.createElement(this.resolvedComponent, this.props)

          // 根据 React 版本使用不同的渲染方法
          if (reactVersion < 18) {
            // React 16/17
            const renderMethod = shouldRender ? ReactDOM.render : ReactDOM.hydrate
            renderMethod(element, this.containerRef.current)
            console.log('[ReactAdapter] React 16/17 渲染', shouldRender ? '首次' : '更新')
          } else {
            // React 18+
            console.log('[ReactAdapter] React 18+ 渲染', shouldRender ? '首次' : '更新')

            if (shouldRender) {
              // 首次渲染 - 创建 root
              const {createRoot} = self.libs
              this.root = createRoot(this.containerRef.current)
              this.root.render(element)
            } else if (this.root) {
              // 更新渲染
              this.root.render(element)
            }
          }
        } catch (error) {
          console.error('[ReactAdapter] 挂载组件时出错:', error)
        }
      }

      /**
       * 渲染容器元素
       */
      render() {
        return React.createElement('div', {ref: this.containerRef})
      }
    }

    return WrappedComponent as any
  }
}

/**
 * 默认导出的 React 适配器实例
 */
export const reactAdapter = new ReactAdapter()
