import logger from 'src/helper/logger'

export interface CSSOptions {
  unit?: 'vw' | 'rem'
  vw?: PostcssViewPortOptions
  rem?: PostcssREMOptions
  minType?: 'swc' | 'nano'
}
export type PostcssViewPortOptions = {
  /**
   * 需要转换的单位
   * @default 'px'
   */
  unitToConvert?: string
  /**
   * 设计稿的视口宽度
   * @default 320
   */
  viewportWidth?: number
  /**
   * not now used; TODO: need for different units and math for different properties
   * @default 568
   */
  viewportHeight?: number
  /**
   * 单位转换后保留的精度
   * @default 5
   */
  unitPrecision?: number
  /**
   * 希望使用的视口单位
   * @default 'vw'
   */
  viewportUnit?: string
  /**
   * 字体使用的视口单位
   * vmin is more suitable.
   * @default 'vw'
   */
  fontViewportUnit?: string
  /**
   * 需要忽略的CSS选择器，不会转为视口单位，使用原有的px等单位。
   * @default []
   */
  selectorBlackList?: any[]
  /**
   * 能转化为vw的属性列表
   * @default ['*']
   */
  propList?: any[]
  /**
   * 设置最小的转换数值，如果为1的话，只有大于1的值会被转换
   * @default 1
   */
  minPixelValue?: number
  /**
   * 媒体查询里的单位是否需要转换单位
   * @default false
   */
  mediaQuery?: boolean
  /**
   * 是否直接更换属性值，而不添加备用属性
   * @default true
   */
  replace?: boolean
  /**
   * 是否添加根据 landscapeWidth 生成的媒体查询条件 @media (orientation: landscape)
   * @default false
   */
  landscape?: boolean
  /**
   * 横屏时使用的单位
   * @default 'vw'
   */
  landscapeUnit?: string
  /**
   * 横屏时使用的视口宽度
   * @default 568
   */
  landscapeWidth?: number
  /**
   * 是可以一起设置的，将取两者规则的交集
   */
  include?: any
  exclude?: any
}
export type PostcssREMOptions = {
  /**
   * 换算技术 设计稿元素尺寸/16，比如元素宽320px,最终页面会换算成 20rem
   * @default 16
   */
  rootValue?: number
  /**
   * 允许REM单位增长到的十进制数字,小数点后保留的位数。
   * @default 5
   */
  unitPrecision?: number
  /**
   * @default ['font', 'font-size', 'line-height', 'letter-spacing']
   */
  propList?: string[]
  /**
   * 要忽略并保留为px的选择器
   * @default []
   */
  selectorBlackList?: any[]
  /**
   * 替换包含REM的规则，而不是添加回退
   * @default true
   */
  replace?: boolean
  /**
   * 允许在媒体查询中转换px
   * @default false
   */
  mediaQuery?: boolean
  /**
   * 设置要替换的最小像素值
   */
  minPixelValue?: number
  /**
   * 可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)/ 。如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
   * default /node_modules/i
   */
  exclude?: any
}
const defaultVwConfig = {
  unitToConvert: 'px',
  viewportWidth: 320,
  viewportHeight: 568, // not now used; TODO: need for different units and math for different properties
  unitPrecision: 5,
  viewportUnit: 'vw',
  fontViewportUnit: 'vw', // vmin is more suitable.
  selectorBlackList: [],
  propList: ['*'],
  minPixelValue: 1,
  mediaQuery: false,
  replace: true,
  landscape: false,
  landscapeUnit: 'vw',
  landscapeWidth: 568,
}
const defaultRemConfig = {
  rootValue: 16, //结果为：设计稿元素尺寸/16，比如元素宽320px,最终页面会换算成 20rem
  unitPrecision: 5,
  // propList: ['font', 'font-size', 'line-height', 'letter-spacing'],
  propList: ['*'],
  selectorBlackList: [],
  replace: true,
  mediaQuery: false,
  minPixelValue: 0,
  // exclude: /node_modules/i, //这里表示不处理node_modules文件夹下的内容
}
export const initCSS = (o: CSSOptions = {}): CSSOptions => {
  o.minType = o.minType || 'nano'
  if (o.rem && o.vw) {
    if (!o.unit) {
      logger.warn('单位处理 vw 与 rem 不能同时存在，已切换到 vw')
      delete o.rem
      o.unit = 'vw'
    } else {
      if (o.unit === 'vw') delete o.rem
      else delete o.vw
    }
  }
  if (o.unit === 'rem') {
    o.rem = o.rem || defaultRemConfig
  }
  if (o.unit === 'vw') {
    o.vw = o.vw || defaultVwConfig
  }
  return o
}
