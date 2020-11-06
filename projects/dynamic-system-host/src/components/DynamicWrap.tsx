import React, {useState, useEffect, lazy, Suspense, ReactElement} from 'react'

declare let __webpack_init_sharing__: any
declare let __webpack_share_scopes__: any
declare let window: any

export interface DynamicSystemDataType {
  url: string
  scope: string
  module: string
}
export interface DynamicWrapProp<T> {
  system: DynamicSystemDataType
  widgetProps?: T
}

export interface UseDynamicScriptType {
  url: string
}

export const loadComponent = (scope: string | number, module: any) => {
  return async (): Promise<any> => {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__('default')
    const container = window[scope] // or get the container somewhere else
    // Initialize the container, it may provide shared modules
    await container.init(__webpack_share_scopes__.default)
    const factory = await window[scope].get(module)
    const Module = factory()
    return Module
  }
}

export const useDynamicScript = (args: UseDynamicScriptType): any => {
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!args.url) {
      return
    }

    const element = document.createElement('script')

    element.src = args.url
    element.type = 'text/javascript'
    element.async = true

    setReady(false)
    setFailed(false)

    element.onload = () => {
      console.log(`Dynamic Script Loaded: ${args.url}`)
      setReady(true)
    }

    element.onerror = () => {
      console.error(`Dynamic Script Error: ${args.url}`)
      setReady(false)
      setFailed(true)
    }

    document.head.appendChild(element)

    return () => {
      console.log(`Dynamic Script Removed: ${args.url}`)
      document.head.removeChild(element)
    }
  }, [args.url])

  return {
    ready,
    failed,
  }
}

export const DynamicWrap = (props: DynamicWrapProp<any>): ReactElement => {
  const {ready, failed} = useDynamicScript({
    url: props?.system && props.system.url,
  })

  if (!props?.system) {
    return <h2>Not system specified</h2>
  }

  if (!ready) {
    return <h2>Loading dynamic script: {props.system.url}</h2>
  }

  if (failed) {
    return <h2>Failed to load dynamic script: {props.system.url}</h2>
  }

  const Component = lazy(loadComponent(props.system.scope, props.system.module))

  return (
    <Suspense fallback="Loading System">
      <Component {...props?.widgetProps} />
    </Suspense>
  )
}
