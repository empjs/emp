import Vue2 from './vue'
function Vue2InVue3(WrappedComponent, id) {
  let vm
  return {
    mounted() {
      // Vue3 移除了 $listeners后，this.$emit 在 Vue3 正常使用
      // 可以直接 camelCase 调用
      // this.$emit('myEvent')
      // 可以直接 kebab-case 调用
      // this.$emit('my-event')
      vm = new Vue2({
        render: createElement => {
          const slots = Object.keys(this.$slots)
            .reduce((arr, key) => arr.concat(this.$slots[key]), [])
            // 手动更正 context
            .map(vnode => {
              vnode.context = this._self
              return vnode
            })
          return createElement(
            WrappedComponent,
            {
              props: this.$props,
              // Vue3 移除了 $listeners，通过 $attrs 透传函数
              // https://v3.vuejs.org/guide/migration/listeners-removed.html#overview
              // on: this.$listeners,
              on: this.$attrs,
              // 透传 scopedSlots
              scopedSlots: this.$scopedSlots,
              attrs: this.$attrs,
            },
            slots,
          )
        },
      })
      vm.$mount(`#${id}`)
    },
    props: WrappedComponent.props,
    render() {
      vm?.$forceUpdate()
    },
  }
}

export default Vue2InVue3
