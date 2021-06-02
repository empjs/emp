import {decorate, observable, configure, action} from 'mobx'
configure({isolateGlobalState: true})
class Store {
  data = {
    count: 0,
  }
  inc() {
    this.data.count += 1
  }
}
decorate(Store, {
  data: observable,
  inc: action,
})

export default new Store()
