import {createRoot} from 'react-dom/client'
import {StrictMode} from 'react'
const rootElm = document.getElementById('emp-root') as HTMLElement
const root = createRoot(rootElm)
console.log('react root', root)
root.render(<StrictMode>swc</StrictMode>)

//
class TreasureInfoStore {
  awardDuration = 2000 // 中奖动画世界
  treasureInfo: string | undefined // 宝藏页面信息
  treasureLevel = 0 // 当前搜寻等级   0.低级   1.高级
  constructor() {
    // this.treasureInfo = 'abc'
  }
}
const ts = new TreasureInfoStore()
console.log('TreasureInfoStore', ts)
console.log('TreasureInfoStore.treasureInfo', ts.treasureInfo)
