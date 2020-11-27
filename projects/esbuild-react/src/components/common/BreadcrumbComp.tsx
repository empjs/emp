import React from 'react'
import {useHistory} from 'react-router-dom'
import {Breadcrumb} from 'antd'
// import {routes, RoutesType} from 'src/configs/router'
import {RoutesType} from 'src/types'
let routes: RoutesType[] = []

const useGetBreadCrumbs = (routes: RoutesType[]) => {
  const history = useHistory()
  const pathKeys: string[] = []
  let path = ''
  history.location.pathname.split('/').map(v => {
    if (v) {
      path += `/${v}`
      return pathKeys.push(path)
    }
  })
  const routeMaps = []
  routes.map((r: RoutesType) => {
    if (r.path === pathKeys[0]) {
      routeMaps.push(r)
      r.routes &&
        r.routes.map((ro: RoutesType) => {
          if (ro.path === pathKeys[1]) {
            routeMaps.push(ro)
          }
        })
    }
  })
  routeMaps.unshift({name: 'antd', path: '/'})
  return {routeMaps, pathname: history.location.pathname}
}
export const BreadcrumbComp = ({routers}: {routers?: RoutesType[]}) => {
  routes = routers || []
  const {routeMaps, pathname} = useGetBreadCrumbs(routes)
  console.log('pathname', pathname)
  return pathname !== '/' ? (
    <Breadcrumb style={{margin: '16px 0'}} separator=">">
      {routeMaps.map(r => (
        <Breadcrumb.Item key={r.path}>{r.name}</Breadcrumb.Item>
      ))}
    </Breadcrumb>
  ) : (
    <div className="mt"></div>
  )
  // return <PageHeader className="site-page-header" title="" breadcrumb={{routes}} />
}
