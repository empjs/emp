import {createRemoteAppComponent} from '@empjs/bridge-react'
import {createBridgeComponent} from '@empjs/bridge-vue3'
// React 16 组件
import React from 'react'
import Antd from 'v3h/Antd'
import v3App from 'v3h/ButtonComponent'

const {EMP_ADAPTER_VUE} = window as any
const {Vue, Pinia} = EMP_ADAPTER_VUE
//
const BridgeComponent = createBridgeComponent(v3App, {
  Vue,
  plugin: app => {
    const pinia = Pinia.createPinia()
    app.use(Antd)
    app.use(pinia)
  },
})
export const RemoteVue3App = createRemoteAppComponent(BridgeComponent, {React})
