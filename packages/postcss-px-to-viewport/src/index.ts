export type PostcssViewPortOptions = {
  /**
   * @default 'px'
   */
  unitToConvert?: string
  /**
   * @default 320
   */
  viewportWidth?: number
  /**
   * not now used; TODO: need for different units and math for different properties
   * @default 568
   */
  viewportHeight?: number
  /**
   * @default 5
   */
  unitPrecision?: number
  /**
   * @default 'vw'
   */
  viewportUnit?: string
  /**
   * vmin is more suitable.
   * @default 'vw'
   */
  fontViewportUnit?: string
  /**
   * @default []
   */
  selectorBlackList?: any[]
  /**
   * @default ['*']
   */
  propList?: any[]
  /**
   * @default 1
   */
  minPixelValue?: number
  /**
   * @default false
   */
  mediaQuery?: boolean
  /**
   * @default true
   */
  replace?: boolean
  /**
   * @default false
   */
  landscape?: boolean
  /**
   * @default 'vw'
   */
  landscapeUnit?: string
  /**
   * @default 568
   */
  landscapeWidth?: number
  include?: any[]
  exclude?: any[]
}
const getVwConfig = {
  viewportWidth: 720,
  unitPrecision: 3,
  viewportUnit: 'vw',
  selectorBlackList: ['.ignore', '.hairlines'],
  minPixelValue: 1,
  mediaQuery: false,
}
