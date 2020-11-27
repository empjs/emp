import React from 'react'
import {Result, Button} from 'antd'
import {Link} from 'react-router-dom'
const P403Comp = () => (
  <Result
    status="403"
    title="403"
    subTitle="暂无访问权限！"
    extra={
      <Link to="/">
        <Button type="primary">返回首页</Button>
      </Link>
    }
  />
)

export default P403Comp
