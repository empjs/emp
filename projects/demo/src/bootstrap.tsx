import {createRoot} from 'react-dom/client'
import RouterComp from 'src/RouterComp'
const container: any = document.getElementById('emp-root')
const root = createRoot(container)
root.render(<RouterComp />)

class TreasureInfoStore {
  awardDuration = 2000 // 中奖动画世界
  treasureInfo: string | undefined // 宝藏页面信息
  treasureLevel = 0 // 当前搜寻等级   0.低级   1.高级
  constructor() {
    this.treasureInfo = 'abc'
  }
}
