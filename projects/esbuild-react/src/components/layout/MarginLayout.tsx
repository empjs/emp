import {Layout, Menu} from 'antd'
import {UserOutlined} from '@ant-design/icons'
import {useHistory} from 'react-router-dom'
import {BreadcrumbComp} from 'src/components/common/BreadcrumbComp'
import {HeaderUserProfile} from 'src/components/common/HeaderUserProfile'
import React, {useState, useEffect} from 'react'
import {RoutesType} from 'src/types'
// import headerMenu from 'src/configs/headerMenu'
import './MarginLayout.less'
const {SubMenu} = Menu
const {Sider, Header} = Layout

const {Content, Footer} = Layout
/* export type TMarginLayout = {
  children?: React.ReactNode
} */

const jumpPath = (history: any, path: string) => {
  const outLink = /^(https?|ftp|file):\/\/.+$/
  console.log(path)
  if (outLink.test(path)) {
    window.location.href = path
  } else {
    history.push(path)
  }
}

type THeaderComp = {
  theme?: 'light' | 'dark' | undefined
}
// HeaderComp
export const HeaderComp = ({theme = 'light'}: THeaderComp) => {
  const history = useHistory()
  const [selectKey, setSelectKey] = useState<string>('')
  useEffect(() => {
    let menuKey = history.location.pathname.split('/')[1]
    menuKey = `/${menuKey}`
    setSelectKey(menuKey)
  }, [history.location.pathname])
  const menuClick = ({key}: {key: string}) => {
    jumpPath(history, key)
  }
  return (
    <Header className={`header ${theme}`}>
      <img className="logo" src={require('src/assets/logo.jpeg')} alt="logo" />

      <Menu
        className="header-left"
        onClick={() => menuClick}
        theme={theme}
        mode="horizontal"
        selectedKeys={[selectKey, history.location.pathname]}
        style={{lineHeight: '64px'}}>
        {/* {headerMenu.map(m => (
          <Menu.Item key={m.path}>{m.name}</Menu.Item>
        ))} */}
      </Menu>
      <div className="header-right">
        <HeaderUserProfile />
      </div>
    </Header>
  )
}
// SideComp
export const SideComp = () => {
  const history = useHistory()
  const menuItemClick = ({key}: {key: string}) => {
    jumpPath(history, key)
  }
  return (
    <Sider width={200}>
      <Menu
        mode="inline"
        onClick={() => menuItemClick}
        defaultOpenKeys={['me']}
        selectedKeys={[history.location.pathname]}
        style={{height: '100%'}}>
        <SubMenu
          key="me"
          title={
            <span>
              <UserOutlined />
              me
            </span>
          }>
          <Menu.Item key="/me/home">home</Menu.Item>
          <Menu.Item key="/me/about">about</Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  )
}

const MarginLayout = function ({children, routes}: {children?: React.ReactNode; routes?: RoutesType[]}) {
  return (
    <Layout>
      <HeaderComp theme="light" />
      <Content style={{padding: '0 50px'}}>
        <BreadcrumbComp routers={routes} />
        <Layout className="site-layout-background">
          <SideComp />
          <Content className="site-layout-background" style={{minHeight: 280}}>
            {children}
          </Content>
        </Layout>
      </Content>
      <Footer style={{textAlign: 'center'}}>©2020 Created by Efox</Footer>
    </Layout>
  )
}
export default MarginLayout
