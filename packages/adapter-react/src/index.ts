// 工具函数
const checkVersion = (version: string): number => (version ? Number(version.split('.')[0]) : 0)
const isPromise = (p: any): boolean => p && Object.prototype.toString.call(p) === '[object Promise]'

// 类型定义
export interface ReactAdapterOptions {
  React?: any
  ReactDOM?: any
  createRoot?: any
  scope?: string
}

// React Adapter 类
export class ReactAdapter {
  libs: ReactAdapterOptions = {
    scope: 'default',
  }

  constructor(op: ReactAdapterOptions = {}) {
    this.libs = {...this.libs, ...op}
  }

  // 适配器核心方法 - 使用类组件实现
  adapter<P = any>(
    component: any,
    scope: string = this.libs.scope || 'default',
    React: any = this.libs.React,
    ReactDOM: any = this.libs.ReactDOM,
  ): P {
    const reactVersion = checkVersion(React?.version || '18.0.0')
    const self = this

    class WrappedComponent extends React.Component {
      public containerRef: any
      public root: any

      constructor(props: P) {
        super(props as any)
        this.containerRef = React.createRef()
      }

      componentDidMount() {
        console.log('[ReactAdapter] componentDidMount')
        this.mountOriginalComponent(true)
      }

      componentDidUpdate() {
        console.log('[ReactAdapter] componentDidUpdate')
        this.mountOriginalComponent()
      }

      componentWillUnmount() {
        console.log('[ReactAdapter] componentWillUnmount')
        this.unMountOriginalComponent()
      }

      unMountOriginalComponent() {
        if (!this.containerRef.current) return
        if (reactVersion < 18) {
          ReactDOM.unmountComponentAtNode(this.containerRef.current)
        } else {
          this.root.unmount()
        }
      }

      async mountOriginalComponent(shouldRender?: boolean) {
        if (isPromise(component))
          component = await component.then((m: any) => {
            return m[scope]
          })
        const element = React.createElement(component, this.props)

        if (reactVersion < 18) {
          const Render = shouldRender ? ReactDOM.render : ReactDOM.hydrate
          Render(element, this.containerRef.current)
          console.log('[ReactAdapter] shouldRender16', shouldRender, reactVersion)
        } else {
          console.log('[ReactAdapter] shouldRender18', shouldRender, reactVersion)
          if (shouldRender) {
            const {createRoot} = self.libs
            this.root = createRoot(this.containerRef.current!)
            this.root.render(element)
          } else {
            // const {hydrateRoot} = self.libs
            // this.root = hydrateRoot(this.containerRef.current!, element)
            this.root.render()
          }
        }
      }

      render() {
        return React.createElement('div', {ref: this.containerRef})
      }
    }

    return WrappedComponent as any
  }
}

export const reactAdapter = new ReactAdapter()
