// import { defineComponent, h } from "vue";
const globalVue3Cache = {vue: {defineComponent: null, h: null, ref: null}, increaseId: Date.now()}

function bindSlotContext(target: any, context: any) {
	return Object.keys(target).map((key) => {
		const vnode = target[key];
		vnode.context = context;
		return vnode;
	});
}

/*
 * Transform vue2 components to DOM.
 */
export function vue2ToVue3(WrapperComponent: any, wrapperId: string) {
	console.log(`vue2ToVue3`, WrapperComponent, wrapperId);
	const win = window as any;
	const Vue2 = win.EMP_ADAPTER_VUE.Vue;
	let vm: any;
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
							props: this.$props,
							scopedSlots: this.$scopedSlots,
						},
						slots,
					);
				},
			});
			vm.$mount(`#${wrapperId}`);
		},
		props: WrapperComponent.props,
		render() {
			vm && vm.$forceUpdate();
		},
	};
}

// 创建组件
const Vue2InVue3Adapter = (() => {
  globalVue3Cache.vue = require('vue')
  const {defineComponent, h, ref} = globalVue3Cache.vue
  if (!(defineComponent && h && ref)) {
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
      };
    },
    render() {
      const { renderId } = this
      return h("div", [
        h("div", { id: `vue2-in-vue3${renderId}` }),
        // h(vue2ToVue3(this.mfComponent(), 'content_id'))
        // componentState && componentState.value ? h(componentState.value) : h('div', '正在加载组件...')
      ]);
    },
    // template: `<div><div id="content_id"></div><dynamic-component-one></dynamic-component-one></div>`,
    mounted() {
      (async () => {
        const fc = await this.mfComponent();
        vue2ToVue3(fc.default, `vue2-in-vue3${this.renderId}`).mounted()
        
        // this.setComponent(vue2ToVue3(fc.default, "content_id"));
      })();
      // 在created钩子函数中动态增加组件到components选项
      // this.$.['dynamic-component-one'] = vue2ToVue3(this.mfComponent(), 'content_id');
    },
  });
})()

export default Vue2InVue3Adapter;
