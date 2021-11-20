import {makeAutoObservable} from 'mobx'
import axios from 'axios'
class IncStore {
  num = 0
  code: any = ''
  constructor() {
    makeAutoObservable(this)
  }
  inc() {
    this.num += 1
  }
  async loadData() {
    const {data} = await axios.get(
      'https://unpkg.bdgamelive.com/webupload/gfe/mobx-react-lite@3.2.2/umd/mobxreactlite.umd.production.min.js',
    )
    this.code = data
  }
}

export default new IncStore()
