import {render} from 'react-dom'
import RouterComp from 'src/RouterComp'

render(<RouterComp />, document.getElementById('emp-root'))

class TreasureInfoStore {
  awardDuration = 2000 // 中奖动画世界
  treasureInfo: string | undefined // 宝藏页面信息
  treasureLevel = 0 // 当前搜寻等级   0.低级   1.高级
  constructor() {
    this.treasureInfo = 'abc'
  }
}
