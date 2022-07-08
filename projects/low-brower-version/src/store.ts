import {decorate, observable} from 'mobx'
import axios from 'axios'
class Store {
  data: any = {}
  s = 'static data'
  setdata(a: any) {
    this.data = a
    this.loadData()
  }
  async loadData() {
    const {data} = await axios.get(
      'https://unpkg.bdgamelive.com/webupload/gfe/mobx-react-lite@3.2.2/umd/mobxreactlite.umd.production.min.js',
    )
    this.s = data
  }
}
// 4.x 需要增加描述
decorate(Store, {
  data: observable,
  s: observable,
})
//
export default new Store()
