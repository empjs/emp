import {makeAutoObservable} from 'mobx'
class IncStore {
  num = 0
  constructor() {
    makeAutoObservable(this)
  }
  inc() {
    this.num += 1
  }
}

export default new IncStore()
