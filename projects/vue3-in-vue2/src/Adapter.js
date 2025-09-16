import rt from '@empjs/share/runtime'

/**
 * Vue3适配器类 - 用于在Vue2环境中渲染Vue3组件
 */
class Vue3AdapterCore {
  constructor() {
    this.vue3Component = null
    this.vue3App = null
    this.plugins = new Map()
    this.isLoading = true
    this.error = null

    // 整合EMP_ADAPTER_VUE模块
    this.Vue = EMP_ADAPTER_VUE?.Vue
    this.Pinia = EMP_ADAPTER_VUE?.Pinia
    this.VueRouter = EMP_ADAPTER_VUE?.VueRouter

    this.initPlugins()
  }

  /**
   * 初始化插件实例
   */
  initPlugins() {
    if (this.Pinia) {
      this.plugins.set('pinia', this.Pinia.createPinia?.() || this.Pinia)
    }
    if (this.VueRouter) {
      this.plugins.set(
        'router',
        this.VueRouter.createRouter?.({
          history: this.VueRouter.createWebHistory?.() || this.VueRouter.createWebHashHistory?.(),
          routes: [],
        }),
      )
    }
  }

  /**
   * 加载Vue3组件
   */
  async loadComponent(moduleName) {
    try {
      this.isLoading = true
      this.error = null

      const componentModule = await rt.load(moduleName)
      if (!componentModule?.default) {
        throw new Error(`Component ${moduleName} not found`)
      }

      this.vue3Component = componentModule.default
      this.isLoading = false
      return this.vue3Component
    } catch (error) {
      this.error = error.message
      this.isLoading = false
      throw error
    }
  }

  /**
   * 创建并挂载Vue3应用
   */
  async mountApp(container, props = {}) {
    if (!this.Vue?.createApp || !this.vue3Component) return

    this.cleanup()
    container.innerHTML = ''

    // 创建Vue3应用
    this.vue3App = this.Vue.createApp(this.vue3Component, props)

    // 安装插件
    this.plugins.forEach(plugin => {
      if (plugin) this.vue3App.use(plugin)
    })

    // 挂载应用
    this.vue3App.mount(container)
  }

  /**
   * 更新组件Props
   */
  updateProps(newProps) {
    if (this.vue3App?._instance) {
      Object.assign(this.vue3App._instance.props, newProps)
    }
  }

  /**
   * 清理资源
   */
  cleanup() {
    if (this.vue3App) {
      this.vue3App.unmount()
      this.vue3App = null
    }
  }

  /**
   * 重新加载组件
   */
  async reload(moduleName, container, props) {
    this.cleanup()
    await this.loadComponent(moduleName)
    await this.mountApp(container, props)
  }
}

/**
 * Vue2适配器组件
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
    }
  },

  async mounted() {
    await this.$nextTick()
    await this.loadAndMount()
  },

  beforeDestroy() {
    this.adapter.cleanup()
  },

  methods: {
    async loadAndMount() {
      try {
        await this.adapter.loadComponent(this.moduleName)
        await this.$nextTick()

        const container = await this.getContainer()
        await this.adapter.mountApp(container, this.componentProps)
      } catch (error) {
        console.error('Vue3Adapter Error:', error)
      }
    },

    async getContainer() {
      let container = this.$refs.vue3Container
      let retries = 0

      while (!container && retries < 5) {
        await this.$nextTick()
        await new Promise(resolve => setTimeout(resolve, 50))
        container = this.$refs.vue3Container
        retries++
      }

      if (!container) {
        throw new Error('Container not found')
      }
      return container
    },

    async reload() {
      const container = await this.getContainer()
      await this.adapter.reload(this.moduleName, container, this.componentProps)
    },
  },

  watch: {
    moduleName: 'reload',
    componentProps: {
      handler(newProps) {
        this.adapter.updateProps(newProps)
      },
      deep: true,
    },
  },

  render(h) {
    if (this.adapter.isLoading) {
      return h('div', {class: 'vue3-adapter-loading'}, '正在加载Vue3组件...')
    }

    if (this.adapter.error) {
      return h('div', {class: 'vue3-adapter-error'}, [
        h('div', `错误: ${this.adapter.error}`),
        h('button', {on: {click: this.reload}}, '重试'),
      ])
    }

    return h('div', {ref: 'vue3Container', class: 'vue3-adapter-container'})
  },
}
