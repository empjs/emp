import {createBridgeComponent, createRemoteAppComponent} from '@empjs/bridge-react'
import AhApp from 'ah/App'
import React from 'react'

const {EMP_ADAPTER_REACT} = window as any
//
const Remote18BridgeComponent = createBridgeComponent(AhApp, EMP_ADAPTER_REACT)
export const Remote18App = createRemoteAppComponent(Remote18BridgeComponent, {React})
