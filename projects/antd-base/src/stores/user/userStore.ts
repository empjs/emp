import axios from 'axios'
import Cookies from 'js-cookie'
import {message} from 'antd'
import storage from 'src/helpers/envStorage'
export const userStore = () => {
  const user: TgetUserInfo = {yyuid: Cookies.get('yyuid') || '', permission: []}
  const permission: string[] = []
  return {
    user,
    permission,
    permissionIsLoad: false,
    async getUserInfo(yyuid: string | number) {
      const user = storage.getJSON('userInfo')
      if (user) {
        this.user = user
        //
        // const loginUser = await API.login.login.request(
        //   {},
        //   {username: 'admin', password: '123456', verifyToken: 'string', code: 'string'},
        // )
        // this.permission = loginUser.loginSysUserVo?.permissionCodes || []
        // console.log(loginUser.loginSysUserVo?.permissionCodes, 'userStore', this.permissionIsLoad)
        this.permissionIsLoad = true
        //
        return
      }
      // https://efox-webdb.yy.com/?uid=50020865
      const {data}: {data: TgetUserInfo} = await axios.get(`https://efox-webdb.yy.com/?uid=${yyuid}`)
      this.user = {...data, ...this.user}
      storage.setJSON('userInfo', this.user)
    },
    logout() {
      Cookies.remove('yyuid', {path: '/', domain: 'yy.com'})
      this.user = {yyuid: '', permission: []}
      message.success('退出成功', 1.5)
      storage.remove('userInfo')
    },
  }
}

export type TuserStore = ReturnType<typeof userStore>
export type TgetUserInfo = {
  id?: string
  permission: []
  yyuid: string
  yyno?: string
  nick?: string
  sex?: string
  birthday?: string
  province?: string
  sign?: string
  intro?: string
  jifen?: string
  register_time?: string
  passport?: string
  account?: string
  hdlogo?: string
  session_card?: string
  custom_logo?: string
}
