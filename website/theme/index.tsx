import {type ComponentProps, useEffect, useState} from 'react'
import Theme, {Nav as DefaultNav} from 'rspress/theme'
import {FamilyNavIcon} from './FamilyNavIcon'

import {HomeLayout} from './pages'

const Layout = () => <Theme.Layout beforeNavTitle={<FamilyNavIcon />} afterFeatures={<HomeLayout />} />

// Rspress 1 的导航首屏依赖视口宽度，客户端挂载后再选择手机或桌面结构。
export const Nav = (props: ComponentProps<typeof DefaultNav>) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted ? <DefaultNav {...props} /> : <div style={{height: 'var(--rp-nav-height, 64px)'}} />
}

// 定制 404 页面

export * from 'rspress/theme'

export default {
  ...Theme,
  Layout,
  Nav,
}
