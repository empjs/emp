const {Vue, Vuex} = globalThis.EMP_ADAPTER_VUE_v2

Vue.use(Vuex)

const Store = Vuex.Store

export const countStore = new Store({
  state: {
    count: 0,
  },
  mutations: {
    increment(state) {
      state.count++
    },
  },
})
export default countStore
