import rt from '@empjs/share/runtime'

// 类型定义
interface Vue3Instance {
  createApp: (component: any, props?: Record<string, any>) => Vue3App
}

interface Vue3App {
  use: (plugin: any) => Vue3App
  mount: (container: Element | string) => any
  unmount: () => void
  _instance?: {
    props: Record<string, any>
  }
}

interface PiniaInstance {
  createPinia?: () => any
}

interface VueRouterInstance {
  createRouter?: (options: any) => any
  createWebHistory?: () => any
  createWebHashHistory?: () => any
}

interface EmpAdapterVue {
  Vue?: Vue3Instance
  Pinia?: PiniaInstance
  VueRouter?: VueRouterInstance
}

// 全局变量声明
declare global {
  const EMP_ADAPTER_VUE: EmpAdapterVue | undefined
}

/**
 * Vue3适配器核心类 - 用于在Vue2环境中渲染Vue3组件
 */
class Vue3AdapterCore {
  private vue3Component: any = null
  private vue3App: Vue3App | null = null
  private plugins = new Map<string, any>()
  private isLoading = true
  private error: string | null = null
  private Vue: Vue3Instance | undefined
  private Pinia: PiniaInstance | undefined
  private VueRouter: VueRouterInstance | undefined

  constructor() {
    this.initVueModules()
    this.initPlugins()
  }

  /**
   * 初始化Vue模块
   */
  private initVueModules(): void {
    try {
      const empAdapter = (globalThis as any).EMP_ADAPTER_VUE || (window as any).EMP_ADAPTER_VUE
      this.Vue = empAdapter?.Vue
      this.Pinia = empAdapter?.Pinia
      this.VueRouter = empAdapter?.VueRouter
    } catch (error) {
      console.warn('Vue3Adapter: Failed to initialize Vue modules:', error)
    }
  }

  /**
   * 初始化插件实例
   */
  private initPlugins(): void {
    try {
      // 初始化Pinia
      if (this.Pinia?.createPinia) {
        this.plugins.set('pinia', this.Pinia.createPinia())
      }

      // 初始化Router
      if (this.VueRouter?.createRouter) {
        const history = this.VueRouter.createWebHistory?.() || this.VueRouter.createWebHashHistory?.()
        if (history) {
          this.plugins.set(
            'router',
            this.VueRouter.createRouter({
              history,
              routes: [],
            }),
          )
        }
      }
    } catch (error) {
      console.warn('Vue3Adapter: Failed to initialize plugins:', error)
    }
  }

  /**
   * 加载Vue3组件
   */
  async loadComponent(moduleName: string): Promise<any> {
    if (!moduleName?.trim()) {
      throw new Error('Module name is required')
    }

    try {
      this.isLoading = true
      this.error = null

      const componentModule = await rt.load(moduleName)
      if (!componentModule?.default) {
        throw new Error(`Component ${moduleName} not found or has no default export`)
      }

      this.vue3Component = componentModule.default
      this.isLoading = false
      return this.vue3Component
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      this.error = errorMessage
      this.isLoading = false
      console.error('Vue3Adapter: Failed to load component:', error)
      throw new Error(`Failed to load component ${moduleName}: ${errorMessage}`)
    }
  }

  /**
   * 创建并挂载Vue3应用
   */
  async mountApp(container: Element, props: Record<string, any> = {}): Promise<void> {
    if (!container) {
      throw new Error('Container element is required')
    }

    if (!this.Vue?.createApp) {
      throw new Error('Vue3 createApp method not available')
    }

    if (!this.vue3Component) {
      throw new Error('No Vue3 component loaded')
    }

    try {
      this.cleanup()

      // 清空容器
      if (container instanceof Element) {
        container.innerHTML = ''
      }

      // 创建Vue3应用
      this.vue3App = this.Vue.createApp(this.vue3Component, props)

      // 安装插件
      this.plugins.forEach((plugin, name) => {
        try {
          if (plugin && this.vue3App) {
            this.vue3App.use(plugin)
          }
        } catch (error) {
          console.warn(`Vue3Adapter: Failed to install plugin ${name}:`, error)
        }
      })

      // 挂载应用
      this.vue3App.mount(container)
    } catch (error) {
      this.cleanup()
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      console.error('Vue3Adapter: Failed to mount app:', error)
      throw new Error(`Failed to mount Vue3 app: ${errorMessage}`)
    }
  }

  /**
   * 更新组件Props
   */
  updateProps(newProps: Record<string, any>): void {
    if (!newProps || typeof newProps !== 'object') {
      console.warn('Vue3Adapter: Invalid props provided for update')
      return
    }

    try {
      if (this.vue3App?._instance?.props) {
        Object.assign(this.vue3App._instance.props, newProps)
      }
    } catch (error) {
      console.warn('Vue3Adapter: Failed to update props:', error)
    }
  }

  /**
   * 清理资源
   */
  cleanup(): void {
    try {
      if (this.vue3App) {
        this.vue3App.unmount()
        this.vue3App = null
      }
    } catch (error) {
      console.warn('Vue3Adapter: Error during cleanup:', error)
    }
  }

  /**
   * 重新加载组件
   */
  async reload(moduleName: string, container: Element, props: Record<string, any> = {}): Promise<void> {
    this.cleanup()
    await this.loadComponent(moduleName)
    await this.mountApp(container, props)
  }

  // Getters
  get loading(): boolean {
    return this.isLoading
  }

  get errorMessage(): string | null {
    return this.error
  }

  get hasVue3(): boolean {
    return !!this.Vue?.createApp
  }
}

/**
 * Vue2适配器组件 - 精简版
 */
export default {
  name: 'Vue3Adapter',

  props: {
    moduleName: {type: String, required: true},
    componentProps: {type: Object, default: () => ({})},
  },

  data() {
    return {
      adapter: new Vue3AdapterCore(),
      retryCount: 0,
    }
  },

  async mounted() {
    if (!this.adapter.hasVue3) {
      console.warn('Vue3Adapter: Vue3 runtime not available')
      return
    }
    await this.loadAndMount()
  },

  beforeDestroy() {
    this.adapter.cleanup()
  },

  methods: {
    async loadAndMount() {
      try {
        await this.adapter.loadComponent(this.moduleName)
        const container = this.getContainer()
        if (container) {
          await this.adapter.mountApp(container, this.componentProps)
          this.retryCount = 0 // 重置重试计数
        }
      } catch (error) {
        console.error('Vue3Adapter: Load and mount failed:', error)
      }
    },

    getContainer() {
      const container = this.$refs.vue3Container
      if (!container) {
        console.warn('Vue3Adapter: Container ref not found')
      }
      return container
    },

    async handleReload() {
      if (this.retryCount >= 3) {
        console.error('Vue3Adapter: Maximum retry attempts reached')
        return
      }

      this.retryCount++
      try {
        const container = this.getContainer()
        if (container) {
          await this.adapter.reload(this.moduleName, container, this.componentProps)
        }
      } catch (error) {
        console.error('Vue3Adapter: Reload failed:', error)
      }
    },
  },

  watch: {
    moduleName: {
      handler() {
        this.retryCount = 0
        this.loadAndMount()
      },
      immediate: false,
    },

    componentProps: {
      handler(newProps) {
        if (newProps && typeof newProps === 'object') {
          this.adapter.updateProps(newProps)
        }
      },
      deep: true,
    },
  },

  render(h) {
    // 检查Vue3运行时
    if (!this.adapter.hasVue3) {
      return h(
        'div',
        {
          class: 'vue3-adapter-error',
        },
        'Vue3 runtime not available',
      )
    }

    // 加载状态
    if (this.adapter.loading) {
      return h(
        'div',
        {
          class: 'vue3-adapter-loading',
        },
        'Loading Vue3 component...',
      )
    }

    // 错误状态
    if (this.adapter.errorMessage) {
      return h('div', {class: 'vue3-adapter-error'}, [
        h('div', {class: 'error-message'}, `Error: ${this.adapter.errorMessage}`),
        this.retryCount < 3 &&
          h(
            'button',
            {
              class: 'retry-button',
              on: {click: this.handleReload},
            },
            `Retry (${this.retryCount}/3)`,
          ),
      ])
    }

    // 正常容器
    return h('div', {
      ref: 'vue3Container',
      class: 'vue3-adapter-container',
    })
  },
}
