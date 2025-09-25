import {createRemoteAppComponent} from '@empjs/bridge-react'
import {createBridgeComponent} from '@empjs/bridge-vue2'

// React 16 组件
import React from 'react'
// 必须加载这个 预加载 从而解决热更问题
import {Content, HelloVue, plugin, store, Table} from 'src/adapter/Vue2Exports'

//
console.log('v2App', HelloVue)

const {EMP_ADAPTER_VUE_v2} = window as any
const {Vue} = EMP_ADAPTER_VUE_v2

function createVue2BridgeComponent(Vue2Component: any) {
  const BridgeComponent = createBridgeComponent(Vue2Component, {Vue, plugin, instanceOptions: {store}})
  return createRemoteAppComponent(BridgeComponent, {React})
}

export const Vue2Hello = createVue2BridgeComponent(HelloVue)
export const Vue2Content = createVue2BridgeComponent(Content)
export const Vue2Table = createVue2BridgeComponent(Table)
