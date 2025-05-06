import type {CustomAtRules, LengthValue, Selector, Visitor} from 'lightningcss'
export type ExcludeSelectorsType = {type: string; name: RegExp | string}
interface Options {
  designWidth: number
  minPixelValue: number
  /**
   * 屏蔽选择器 [{type: 'class', name: 'cssModule'}]
   * @default []
   */
  excludeSelectors: ExcludeSelectorsType[]
  transformUnit: 'vw' | 'rem' | ''
  /**
   * 屏蔽单位 大小写无法区分 只支持 ipx 等纯字母变量
   * 加上横杠会出现不可预知问题 如 marign 1-px solid #222 会多出一个空格
   * @default ipx
   */
  excludeUnit: string
  rootValue: number
}
export type vwOptions = Partial<Options>
export type remOptions = Partial<Options>
export type ExcludeItemType = {type: string; name?: string}
//
export class UnitTramsform {
  private skipSelector = false
  private skipVal = false
  private skipMedia = 0
  private isExclude!: (item: ExcludeItemType) => boolean
  private isDebug = false
  public op: Options = {
    designWidth: 320,
    minPixelValue: 1,
    excludeSelectors: [],
    transformUnit: '',
    excludeUnit: 'ipx',
    rootValue: 16,
  }
  debug(...args: any[]) {
    if (!this.isDebug) return
    console.log(...args)
  }
  // 解决特殊容器屏蔽问题
  Selector = (selectors: Selector) => {
    this.skipSelector = false //还原上下文
    for (const selector of selectors) {
      if (this.isExclude(selector)) {
        this.skipSelector = true
      }
    }
  }
  // 解决特殊单位如 -px 不转换为 rem 的问题
  Token: any = {
    dimension: (token: {unit: string; value: any}) => {
      this.debug('dimension', token)
      this.skipVal = false
      if (token.unit === this.op.excludeUnit) {
        this.skipVal = true
        return {
          type: 'length',
          value: {
            unit: 'px',
            value: token.value,
          },
        }
      }
    },
  }
  Length: Visitor<CustomAtRules>['Length'] = (length: LengthValue) => {
    this.debug(length, 'skipVal', this.skipVal, 'skipSelector', this.skipSelector, 'skipMedia', this.skipMedia)
    //
    let rs: any = {
      unit: 'px',
      value: length.value,
    }
    if (length.unit === 'px' && !this.skipSelector) {
      if (Math.abs(length.value) > this.op.minPixelValue) {
        if (!this.skipVal && this.skipMedia == 0) {
          switch (this.op.transformUnit) {
            case 'rem':
              rs = {
                unit: 'rem',
                value: length.value / this.op.rootValue,
              }
              break
            case 'vw':
              rs = {
                unit: 'vw',
                value: (length.value / this.op.designWidth) * 100,
              }
              break
            default:
              break
          }
        }
        //todo 验证是否需要改成 if (this.skipMedia > 0&&this.skipVal===true) this.skipMedia--
        if (this.skipMedia > 0) this.skipMedia--
      }
      //还原上下文
      this.skipVal = false
      return rs
    } else {
      this.skipVal = false
    }
  }
  Rule = {
    media: (rule: any) => {
      // console.log('media', JSON.stringify(rule, null, 2))
      const q = rule.value.query.mediaQueries[0]
      const {conditions} = q.condition
      if (conditions) {
        this.skipMedia = conditions.length
      } else {
        this.skipMedia = 1
      }
      // const unit = q.condition.value.value.value.value.unit
    },
  }
  pxToRem(options: remOptions = {}) {
    this.op.transformUnit = 'rem'
    this.op = Object.assign(this.op, options)
    this.isExclude = this.excludeFilter(this.op.excludeSelectors)
    //
    return {
      Selector: this.Selector,
      Token: this.Token,
      Rule: this.Rule,
      Length: this.Length,
    } satisfies Visitor<CustomAtRules>
  }
  pxToVw(options: vwOptions = {}) {
    this.op.transformUnit = 'vw'
    this.op = Object.assign(this.op, options)
    this.isExclude = this.excludeFilter(this.op.excludeSelectors)
    return {
      Selector: this.Selector,
      Token: this.Token,
      Length: this.Length,
    } satisfies Visitor<CustomAtRules>
  }
  excludeFilter(excludes: ExcludeSelectorsType[]) {
    const isExclude = (item: ExcludeItemType) => {
      this.debug(item, excludes)
      if (!item.name) {
        return false
      }
      for (const rule of excludes) {
        if (item.type === rule.type) {
          if (typeof rule.name === 'string' && rule.name === item.name) {
            return true
          }
          if (typeof rule.name === 'object' && rule.name.test(item.name)) {
            return true
          }
        }
      }
      return false
    }

    return isExclude
  }
}
export default new UnitTramsform()
