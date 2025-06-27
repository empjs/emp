import Theme from 'rspress/theme'
import {FamilyNavIcon} from './FamilyNavIcon'

import {HomeLayout} from './pages'

const Layout = () => <Theme.Layout beforeNavTitle={<FamilyNavIcon />} afterFeatures={<HomeLayout />} />

// 定制 404 页面

export * from 'rspress/theme'

export default {
  ...Theme,
  Layout,
}
