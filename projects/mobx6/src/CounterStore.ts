import {makeAutoObservable, configure} from 'mobx'
configure({isolateGlobalState: true})
class Store {
  data = {
    count: 0,
  }

  constructor() {
    makeAutoObservable(this)
  }

  inc() {
    this.data.count += 1
  }
}

export default new Store()
