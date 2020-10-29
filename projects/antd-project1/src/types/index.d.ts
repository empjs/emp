// JSON TYPE
export interface LayoutType {
  useStores: any
  routes: RoutesType[]
  children?: React.ReactNode
  pageview?: (local: any) => void
  layout?: string | 'FixSlideLayout'
}

export type RoutesType = {
  path: string
  component?: any
  name?: string
  url?: string
  icon?: any
  routes?: RoutesType[]
  role?: string // 权限管理
}
