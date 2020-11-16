import Vue2 from './vue'
let vm
function Vue2InVue3(WrappedComponent, id) {
  return {
    props: WrappedComponent.props,
    watch: {
      $props: {
        deep: true,
        handler: function () {
          vm.$forceUpdate()
        },
      },
    },
    mounted() {
      console.log('I have already mounted')
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
              on: this.$listeners,
              attrs: this.$attrs,
            },
            slots,
          )
        },
      })
      vm.$mount(`#${id}`)
    },
  }
}

export default Vue2InVue3
