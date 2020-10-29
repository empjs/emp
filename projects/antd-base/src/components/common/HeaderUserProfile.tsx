import React, {useEffect} from 'react'
import {yyLogin} from 'src/helpers/udb'
import {useStores} from 'src/stores'
import {TuserStore} from 'src/stores/user/userStore'
import {observer} from 'mobx-react-lite'
import {Avatar, Dropdown, Menu} from 'antd'
import {DownOutlined, LoginOutlined, UserOutlined} from '@ant-design/icons'
import './HeaderUserProfile.less'
export const HeaderUserProfile = observer(() => {
  const {userStore} = useStores()
  const {user} = userStore

  console.log('user.yyuid', user.yyuid)
  useEffect(() => {
    if (user.yyuid) userStore.getUserInfo(user.yyuid)
  }, [user.yyuid])
  return (
    <div className="profile">
      {!user.yyuid ? <a onClick={() => yyLogin()}>登录</a> : <UserInfoComp userStore={userStore} />}
    </div>
  )
})
//
type TProps = {
  userStore: TuserStore
}
const DropMenuComp = ({userStore}: TProps) => {
  return (
    <Menu>
      <Menu.Item key="0">
        <UserOutlined />
        个人设置
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3" onClick={() => userStore.logout()}>
        <LoginOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  )
}

const UserInfoComp = observer(({userStore}: TProps) => {
  const {user} = userStore
  //console.log('user', JSON.stringify(user))
  return (
    <>
      <Dropdown overlay={<DropMenuComp userStore={userStore} />}>
        <div className="header_user_profile">
          <Avatar size={24} className="userinfo_avatar" src={user.custom_logo} />
          {user.nick} <DownOutlined />
        </div>
      </Dropdown>
    </>
  )
})
