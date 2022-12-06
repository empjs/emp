import {TreasureInfoStore} from './classProps'
import {Button, Space} from 'antd'
import {Layout} from './Layout'
const ts = new TreasureInfoStore()
console.log('TreasureInfoStore', ts)
console.log('TreasureInfoStore.treasureInfo', ts.treasureInfo)

export const App = () => (
  <Layout>
    <h1>EMP SWC Antd5 </h1>
    <Space wrap>
      <Button type="primary">Primary Button</Button>
      <Button>Default Button</Button>
      <Button type="dashed">Dashed Button</Button>
      <Button type="text">Text Button</Button>
      <Button type="link">Link Button</Button>
    </Space>
    <p>TreasureInfoStore.treasureInfo {ts.treasureInfo}</p>
  </Layout>
)
