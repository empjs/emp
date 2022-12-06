import {TreasureInfoStore} from './classProps'
import {Button, Space, Switch} from 'antd'
import {Layout} from './Layout'
import {CheckOutlined, CloseOutlined} from '@ant-design/icons'
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
    <Space direction="vertical">
      <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked />
      <Switch checkedChildren="1" unCheckedChildren="0" />
      <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} defaultChecked />
    </Space>
  </Layout>
)
