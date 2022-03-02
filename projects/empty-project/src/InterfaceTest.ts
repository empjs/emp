type ITreasureInfo = {info: string}
class TreasureInfoStore {
  awardDuration = 2000 // 中奖动画世界
  treasureInfo: ITreasureInfo | undefined // 宝藏页面信息
}

export default TreasureInfoStore
