# @efox/emp-single-mobx6

> 单例mobx，实现跨组件、Iframe间通信


## 🔗 Install
`yarn add @efox/emp-single-mobx6`

## Use

```
import {empCreateClassStore, makeAutoObservable} from '@efox/emp-single-mobx6'

class DemoStore {
  count = 2
  list = [{index: 0, person: {name: 'Lion', age: 12}}]
  constructor() {
    makeAutoObservable(this)
  }
  addCount() {
    this.count += 1
  }
  pushList() {
    this.list.push({...this.list[0], index: this.list.length})
  }
}

export default empCreateClassStore<DemoStore>(DemoStore)



const DemoComponent = () => {
  return <div>{demoStore.count}</div>
}
export default Obserer(DemoComponent)
```