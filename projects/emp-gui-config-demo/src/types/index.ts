import {SuspenseProps} from 'react'
import {RouteProps} from 'react-router-dom'

export interface SwitchRouterProps {
  routes?: RouteProps[]
  onChange?: () => void
}

export interface RouterCompProps extends SwitchRouterProps {
  fallback?: SuspenseProps['fallback']
}
