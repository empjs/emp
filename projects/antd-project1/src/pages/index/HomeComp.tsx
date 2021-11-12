import React from 'react'
import {PageHeader, Button, Descriptions, Card} from 'antd'
import config from 'src/configs'
const HomeComp = () => (
  <>
    <Card className="mt">
      <PageHeaderComp />
      home components!!
    </Card>
    <Card>{JSON.stringify(config)}</Card>
  </>
)
const PageHeaderComp = () => (
  <PageHeader
    ghost={false}
    onBack={() => window.history.back()}
    title="Emp Micro Fe"
    subTitle="This is a subtitle"
    extra={[
      <Button key="3">Operation 1</Button>,
      <Button key="2">Operation 2</Button>,
      <Button key="1" type="primary">
        Primary
      </Button>,
    ]}
  >
    <Descriptions size="small" column={3}>
      <Descriptions.Item label="Created">Lili Qu</Descriptions.Item>
      <Descriptions.Item label="Association">
        <a>421421</a>
      </Descriptions.Item>
      <Descriptions.Item label="Creation Time">2017-01-10</Descriptions.Item>
      <Descriptions.Item label="Effective Time">2017-10-10</Descriptions.Item>
      <Descriptions.Item label="Remarks">Gonghu Road, Xihu District, Hangzhou, Zhejiang, China</Descriptions.Item>
    </Descriptions>
  </PageHeader>
)

export default HomeComp
