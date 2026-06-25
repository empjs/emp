import Vuex from 'vuex'
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
