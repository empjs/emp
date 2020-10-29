import React from 'react'
import {Result, Button} from 'antd'
import {Link} from 'react-router-dom'
const P404Comp = () => (
  <Result
    status="404"
    title="404"
    subTitle="找不到相应的页面！"
    extra={
      <Link to="/">
        <Button type="primary">返回首页</Button>
      </Link>
    }
  />
)

export default P404Comp
