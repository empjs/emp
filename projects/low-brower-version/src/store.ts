import {decorate, observable} from 'mobx'
class Store {
  data: any = {}
  s = 'static data'
  setdata(a: any) {
    this.data = a
  }
}
decorate(Store, {
  data: observable,
  s: observable,
})
export default new Store()
