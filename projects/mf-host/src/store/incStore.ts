import {makeAutoObservable} from 'mobx'
export class IncStore {
  num = 0
  code: any = ''
  constructor() {
    makeAutoObservable(this)
  }
  inc() {
    this.num += 1
  }
  async loadData() {
    const d = await fetch('https://unpkg.com/mobx-react-lite@3.2.2').then(res => res.text())
    this.code = d
  }
}

export default new IncStore()
