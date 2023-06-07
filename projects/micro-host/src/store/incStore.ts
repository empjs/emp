// import {makeAutoObservable, runInAction} from 'mobx'
// class IncStore {
//   num = 0
//   code: any = ''
//   constructor() {
//     makeAutoObservable(this)
//   }
//   inc() {
//     this.num += 1
//   }
//   async loadData() {
//     const d = await fetch(
//       'https://unpkg.bdgamelive.com/webupload/gfe/mobx-react-lite@3.2.2/umd/mobxreactlite.umd.production.min.js',
//     ).then(res => res.text())
//     runInAction(() => {
//       this.code = d
//     })
//   }
// }

// export default new IncStore()

import {create} from 'zustand'
import {combine} from 'zustand/middleware'
interface IncType {
  num: number
  code: string
  inc: () => void
  loadData: () => void
}
export const useBearStore = create(
  combine({bears: 0}, set => ({
    increase: (by: number) => set(state => ({bears: state.bears + by})),
  })),
)
const useIncStore = create<IncType>()(set => ({
  num: 0,
  code: '',
  inc: () => set(state => ({num: state.num + 1})),
  loadData: async () => {
    const d = await fetch(
      'https://unpkg.bdgamelive.com/webupload/gfe/mobx-react-lite@3.2.2/umd/mobxreactlite.umd.production.min.js',
    ).then(res => res.text())
    set({code: d})
  },
}))

export default useIncStore
