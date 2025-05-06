const globalVue3Cache: any = {vue: {defineComponent: null, h: null, ref: null}, increaseId: Date.now()}
const win = window as any
function bindSlotContext(target: any, context: any) {
  return Object.keys(target).map(key => {
    const vnode = target[key]
    vnode.context = context
    return vnode
  })
}

function vue2ToVue3(WrapperComponent: any, wrapperId: string): any {
  const Vue2 = win.EMP_ADAPTER_VUE.Vue
  let vm: any
  return {
    mounted() {
      const slots = this.$slots ? bindSlotContext(this.$slots, this.__self) : null
      vm = new Vue2({
        render: (createElement: any) => {
          return createElement(
            WrapperComponent,
            {
              on: this.$attrs,
              attrs: this.$attrs,
              props: {...this.$props, ...this.$attrs},  // 合并 props 和 attrs
              scopedSlots: this.$scopedSlots,
            },
            slots,
          )
        },
      })
      vm.$mount(`#${wrapperId}`)
    },
    // 继承原组件的所有 props 定义
    props: WrapperComponent.props || {},
    render() {
      vm && vm.$forceUpdate()
    },
  }
}

const initVue2InVue3Adapter = (vue: any) => {
  globalVue3Cache.vue = vue
}
// 创建组件
export const Vue2InVue3Adapter = (() => {
  initVue2InVue3Adapter(win.Vue)
  const {defineComponent, h, ref} = globalVue3Cache.vue
  if (!(defineComponent && h && ref)) {
    console.warn('emp3 Vue2InVue3Adapter has not init')
    return () => {}
  }
  return defineComponent({
    // 声明props
    props: {
      mfComponent: {
        type: Function,
        required: true,
      },
    },
    setup() {
      const renderId = ref(globalVue3Cache.increaseId)
      globalVue3Cache.increaseId++
      return {
        renderId,
      }
    },
    render() {
      const {renderId} = this
      return h('div', [h('div', {id: `vue2-in-vue3${renderId}`})])
    },
    mounted() {
      ;(async () => {
        const fc = await this.mfComponent()
        vue2ToVue3(fc.default, `vue2-in-vue3${this.renderId}`).mounted()
      })()
    },
  })
})()

// const Vue3InVue2Adapter = () => {
//   console.log('not implement')
// }

// export default {Vue2InVue3Adapter, Vue3InVue2Adapter}
