import {createRemoteAppComponent} from '@empjs/bridge-react'
import {createBridgeComponent} from '@empjs/bridge-vue2'
// React 16 组件
import React from 'react'
import v2App from 'v2h/HelloVue'

// import plugin from 'v2h/plugin'
// import store from 'v2h/store'

const {EMP_ADAPTER_VUE_v2} = window as any
const {Vue} = EMP_ADAPTER_VUE_v2

// 创建Vue2桥接组件，添加额外配置以增强稳定性
const BridgeComponent = createBridgeComponent(v2App, {Vue})

// 创建React远程组件，添加额外配置以增强稳定性
export const RemoteVue2App = createRemoteAppComponent(BridgeComponent, {React})
