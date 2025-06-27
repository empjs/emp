import {reactAdapter} from '@empjs/share/adapter'
import empRuntime from '@empjs/share/runtime'
import {lazy, Suspense} from 'react'

const entryUrl = `http://172.29.96.217:8801/emp.js`
const shared: any = reactAdapter.shared
shared['react-router-dom'] = {
  lib: (window as any).EMP_ADAPTER_REACT.ReactRouterDOM,
  scope: 'default',
  shareConfig: {singleton: true, requiredVersion: '^6.23.1'},
  version: '^6.23.1',
}
console.log('shared', shared)
empRuntime.init({
  shared,
  remotes: [
    {
      name: 'YoRoomSettingComponent',
      entry: entryUrl,
    },
  ],
})

// export const RoomSettingComponent = lazy(() => empRuntime.load('YoRoomSettingComponent/RoomSettingComponent'))
// export const ManagerRule = lazy(() => empRuntime.load('YoRoomSettingComponent/ManagerRule'))
// export const ActiveMember = lazy(() => empRuntime.load('YoRoomSettingComponent/ActiveMember'))
// export const MemberPrivilege = lazy(() => empRuntime.load('YoRoomSettingComponent/MemberPrivilege'))
export const MemberRule = lazy(() => empRuntime.load('YoRoomSettingComponent/MemberRule'))

export default () => {
  return (
    <div>
      <h1>Remoter Loader</h1>
      <Suspense>
        {/* <RoomSettingComponent /> */}
        {/* <ManagerRule />
        <ActiveMember />
        <MemberPrivilege /> */}
        <MemberRule />
      </Suspense>
    </div>
  )
}
