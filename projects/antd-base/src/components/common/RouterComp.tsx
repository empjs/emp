import React, {Suspense, useEffect} from 'react'
import {Route, BrowserRouter as Router, Switch, useLocation, RouteProps} from 'react-router-dom'
// import MarginLayout from 'src/components/layout/MarginLayout'
import FixSlideLayout from 'src/components/layout/FixSlideLayout'
import LoadingComp from './LoadingComp'
import P404Comp from './P404Comp'
import P403Comp from './P403Comp'
import {useObserver} from 'mobx-react-lite'
import {useStores} from 'src/stores'
import {RoutesType, RouterCompType} from 'src/types'
////////////////
let routes: RoutesType[] = []
let pageview: <T>(d: T) => void = d => d
function usePageViews() {
  const location = useLocation()
  useEffect(() => {
    pageview(location)
  }, [location])
}
// 返回 component 的模型使用
type PrivateRouteProps = RouteProps & {role?: string}
function PrivateRoute({component: Component, role, ...rest}: PrivateRouteProps) {
  const {userStore} = useStores()
  return useObserver(() => (
    <Route
      {...rest}
      render={props => {
        return (!role || userStore.permission.indexOf(role) > -1) && Component ? (
          <Component {...props} />
        ) : (
          <IsFinishRoleLoading userStore={userStore} />
        )
      }}
    />
  ))
}

const IsFinishRoleLoading = ({userStore}: {userStore: any}) =>
  userStore.permissionIsLoad === true ? <P403Comp /> : <LoadingComp />

const RoutersComp = () => {
  return (
    routes.length > 0 &&
    routes.map((route, i) => {
      if (route.path === '/') {
        return <PrivateRoute role={route.role} exact path="/" key={i} component={route.component} />
      } else {
        return <RouteWithSubRoutes key={i} {...route} />
      }
    })
  )
}
const SwitchMainRouter = () => {
  usePageViews()
  return (
    <Switch>
      {RoutersComp()}
      <Route>
        <P404Comp />
      </Route>
    </Switch>
  )
}

export default function RouterComp(props: RouterCompType) {
  const Layout = props.layout || FixSlideLayout
  pageview = props.pageview || pageview
  routes = props.routes || []
  return (
    <Router>
      <Layout routes={routes}>
        <Suspense fallback={<LoadingComp />}>
          <SwitchMainRouter />
        </Suspense>
      </Layout>
    </Router>
  )
}
// route.componen 403配置
type PrivateRouteComponentProps = {
  props: any
  route: RoutesType
}
const PrivateRouteComponent = ({props, route}: PrivateRouteComponentProps) => {
  const {userStore} = useStores()
  return useObserver(() =>
    !route.role || userStore.permission.indexOf(route.role) > -1 ? (
      <route.component {...props} routes={route.routes} />
    ) : (
      <IsFinishRoleLoading userStore={userStore} />
    ),
  )
}
//
const RouteWithSubRoutes = (route: RoutesType) =>
  (route.component && (
    // <Route path={route.path} render={props => <route.component {...props} routes={route.routes} />} />
    <Route path={route.path} render={props => <PrivateRouteComponent props={props} route={route} />} />
  )) || <SwitchRouter routes={route.routes} />

export const SwitchRouter = ({routes}: {routes?: RoutesType[]}) => {
  return (
    <Switch>
      {routes && routes.length > 0 && routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)}
    </Switch>
  )
}
