import {Layout, Menu} from 'antd'
import {useHistory, Link} from 'react-router-dom'
import React, {useState, useEffect} from 'react'
import {HeaderUserProfile} from 'src/components/common/HeaderUserProfile'
import {BreadcrumbComp} from 'src/components/common/BreadcrumbComp'
// import {routes, Troutes} from 'src/configs/router'
import {MenuUnfoldOutlined, MenuFoldOutlined} from '@ant-design/icons'
import './FixSlideLayout.less'
import {RoutesType} from 'src/types'
const {Header, Content, Footer, Sider} = Layout
const {SubMenu} = Menu
//
const IconName = ({route}: {route: RoutesType}) => {
  return (
    <span>
      {route.icon && route.icon.render()}
      <span>{route.name}</span>
    </span>
  )
}
// console.log('routes', routes)
const FixSlideLayout = ({children, routes}: {children?: React.ReactNode; routes?: RoutesType[]}) => {
  routes = routes || []
  const history = useHistory()
  const menuClick = ({key}: {key: string}) => {
    history.push(key)
  }
  //
  const {pathname} = history.location
  const selectKey = [pathname]
  const [openKey, setOpenKey] = useState([''])
  const [collapsed, setCollapsed] = useState(false)
  //
  useEffect(() => {
    setOpenKey([`/${pathname.split('/')[1]}`])
  }, [history.location.pathname])
  //
  return (
    <Layout className={`FixSideLayout ${collapsed ? 'iscollapsed' : ''}`}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}>
        <div className="logo">
          <Link to="/">
            <img src={require('src/assets/logo.jpeg')} alt="logo" />
            <i>
              EMP <span>by Efox</span>
            </i>
          </Link>
        </div>

        <Menu
          theme="dark"
          onClick={menuClick}
          mode="inline"
          openKeys={openKey}
          onOpenChange={d => {
            setOpenKey(d)
          }}
          //openKeys={selectKey}
          //inlineCollapsed={false}
          defaultSelectedKeys={selectKey}>
          {routes.map(d => {
            if (d.routes && d.routes.length > 0) {
              return (
                <SubMenu key={d.url || d.path} title={<IconName route={d} />}>
                  {d.routes &&
                    d.routes.map(s => (
                      <Menu.Item key={s.url || s.path}>
                        <IconName route={s} />
                      </Menu.Item>
                    ))}
                </SubMenu>
              )
            } else {
              return (
                <Menu.Item key={d.url || d.path}>
                  <IconName route={d} />
                </Menu.Item>
              )
            }
          })}
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{padding: 0}}>
          <span className="triggerCollapsed" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <MenuUnfoldOutlined style={{fontSize: 20}} /> : <MenuFoldOutlined style={{fontSize: 20}} />}
          </span>
          <div className="header-right">
            <HeaderUserProfile />
          </div>
        </Header>

        <Content style={{margin: '0px 24px', overflow: 'initial'}}>
          <BreadcrumbComp routers={routes} />
          <div>{children}</div>
        </Content>
        <Footer style={{textAlign: 'center'}}>©2020 Created By EMP Micro FE & Efox Team</Footer>
      </Layout>
    </Layout>
  )
}

export default FixSlideLayout
