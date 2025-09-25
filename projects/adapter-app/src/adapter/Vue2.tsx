import {createRemoteAppComponent} from '@empjs/bridge-react'
import {createBridgeComponent} from '@empjs/bridge-vue2'

// React 16 组件
import React from 'react'
import v2Content from 'v2h/Content'
//
import v2App from 'v2h/HelloVue'
import plugin from 'v2h/plugin'
import store from 'v2h/store'
import v2Table from 'v2h/Table'

//
console.log('v2App', v2App)

const {EMP_ADAPTER_VUE_v2} = window as any
const {Vue} = EMP_ADAPTER_VUE_v2

function createVue2BridgeComponent(Vue2Component: any) {
  const BridgeComponent = createBridgeComponent(Vue2Component, {Vue, plugin, instanceOptions: {store}})
  return createRemoteAppComponent(BridgeComponent, {React})
}

export const Vue2Hello = createVue2BridgeComponent(v2App)
export const Vue2Content = createVue2BridgeComponent(v2Table)
export const Vue2Table = createVue2BridgeComponent(v2Content)
