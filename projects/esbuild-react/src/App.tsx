import React from 'react'
import RouterComp from 'src/components/common/RouterComp'
// import 'antd/dist/antd.css'
import 'src/index.scss'
import 'src/App.scss'

import {StoreProvider} from 'src/stores'
import {ConfigProvider} from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import {RouterCompType} from 'src/types'
//
const App = ({layout, routes, stores}: RouterCompType) => (
  <ConfigProvider locale={zhCN}>
    <StoreProvider stores={stores}>
      <RouterComp layout={layout} routes={routes || []} />
    </StoreProvider>
  </ConfigProvider>
)

export default App
