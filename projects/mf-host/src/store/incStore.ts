import {makeAutoObservable} from 'mobx'
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
    const d = await fetch(
      'https://unpkg.bdgamelive.com/webupload/gfe/mobx-react-lite@3.2.2/umd/mobxreactlite.umd.production.min.js',
    ).then(res => res.text())
    this.code = d
  }
}

export default new IncStore()
