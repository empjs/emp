import Vue from 'vue'
import Vuex from 'vuex'

// 必须在创建store实例之前调用Vue.use(Vuex)
Vue.use(Vuex)

export const countStore = new Vuex.Store({
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
