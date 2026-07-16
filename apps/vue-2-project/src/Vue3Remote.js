export default {
  name: 'Vue3Remote',
  props: {
    label: {
      type: String,
      default: 'from-vue2',
    },
  },
  data() {
    return {
      app: null,
      loadError: '',
    }
  },
  async mounted() {
    await this.mountVue3()
  },
  beforeDestroy() {
    this.unmountVue3()
  },
  watch: {
    label() {
      this.mountVue3()
    },
  },
  methods: {
    async mountVue3() {
      this.unmountVue3()
      this.loadError = ''
      try {
        const [{default: component}] = await Promise.all([import('@v3b/PiniaCount')])
        const adapter = window.EMP_ADAPTER_VUE
        if (!adapter?.Vue?.createApp || !adapter?.Pinia?.createPinia) {
          throw new Error('Vue3/Pinia runtime is unavailable')
        }
        this.app = adapter.Vue.createApp(component, {name: this.label})
        this.app.use(adapter.Pinia.createPinia())
        this.app.mount(this.$refs.container)
      } catch (error) {
        this.loadError = error instanceof Error ? error.message : String(error)
      }
    },
    unmountVue3() {
      if (!this.app) return
      this.app.unmount()
      this.app = null
      window.__EMP_VUE3_IN_VUE2_UNMOUNTS__ = (window.__EMP_VUE3_IN_VUE2_UNMOUNTS__ || 0) + 1
    },
  },
  render(h) {
    if (this.loadError) return h('output', {attrs: {'data-vue3-error': 'true'}}, this.loadError)
    return h('div', {ref: 'container', attrs: {'data-vue3-in-vue2': 'mounted'}})
  },
}
