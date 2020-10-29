export interface LayoutType {
  useStores: any
  routes: RoutesType[]
  children?: React.ReactNode
  pageview?: <T>(local: T) => void
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

export interface RouterCompType {
  routes?: RoutesType[]
  layout?: () => JSX.Element
  stores?: StoresType
  pageview?: () => void
}

export interface StoresType {
  [key: string]: (...args: any) => any
}
