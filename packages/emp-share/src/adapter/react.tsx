import {checkVersion, isPromise} from 'src/helper'
import type {EMPShareRuntimeAdapterReactType, InitOptionsType} from 'src/types'
import {log} from '../helper'

//
let globalLib = {}
const win: any = window
//
log('process.env.EMPSHARE_ENV', process.env.EMPSHARE_ENV)
//
const {EMPShareGlobalVal} = win || {}
if (EMPShareGlobalVal && EMPShareGlobalVal.frameworkLib) {
  globalLib = win[EMPShareGlobalVal.frameworkLib]
}
//
export class ReactAdapter {
  libs: EMPShareRuntimeAdapterReactType = {
    scope: 'default',
    ...globalLib,
  }
  constructor(op?: EMPShareRuntimeAdapterReactType) {
    if (op) this.setup(op)
  }
  public setup(o?: EMPShareRuntimeAdapterReactType | string) {
    if (o) {
      if (typeof o === 'string') o = window[o]
      this.libs = {...this.libs, ...(o as any)}
    }
  }
  get shared(): InitOptionsType['shared'] {
    const {React, ReactDOM, scope} = this.libs as EMPShareRuntimeAdapterReactType
    return {
      react: {
        lib: () => React,
        version: React.version,
        scope,
        shareConfig: {
          singleton: true,
          requiredVersion: `^${React.version}`,
        },
      },
      'react-dom': {
        lib: () => ReactDOM,
        version: ReactDOM.version,
        scope,
        shareConfig: {
          singleton: true,
          requiredVersion: `^${React.version}`,
        },
      },
    }
  }
  adapter<P = any>(
    component: any,
    scope: string = this.libs.scope,
    React: any = this.libs.React,
    ReactDOM: any = this.libs.ReactDOM,
  ): P {
    const reactVersion = checkVersion(React.version)
    const self = this
    class WrappedComponent extends React.Component {
      public containerRef: any
      public root: any
      constructor(props: P) {
        super(props as any)
        this.containerRef = React.createRef()
      }

      componentDidMount() {
        log('componentDidMount')
        this.mountOriginalComponent(true)
      }

      componentDidUpdate() {
        log('componentDidUpdate')
        this.mountOriginalComponent()
      }

      componentWillUnmount() {
        log('componentWillUnmount')
        this.unMountOriginalComponent()
      }
      unMountOriginalComponent() {
        if (!this.containerRef.current) return
        if (reactVersion < 18) {
          ReactDOM.unmountComponentAtNode(this.containerRef.current)
        } else {
          this.root.unmount()
        }
      }
      async mountOriginalComponent(shouldRender?: boolean) {
        if (isPromise(component))
          component = await component.then((m: any) => {
            return m[scope]
          })
        const element = React.createElement(component, this.props)

        if (reactVersion < 18) {
          const Render = shouldRender ? ReactDOM.render : ReactDOM.hydrate
          Render(element, this.containerRef.current)
          log('shouldRender16', shouldRender, reactVersion)
        } else {
          log('shouldRender18', shouldRender, reactVersion)
          if (shouldRender) {
            const {createRoot} = self.libs
            this.root = createRoot(this.containerRef.current!)
            this.root.render(element)
          } else {
            // const {hydrateRoot} = self.libs
            // this.root = hydrateRoot(this.containerRef.current!, element)
            this.root.render()
          }
        }
      }

      render() {
        return <div ref={this.containerRef} />
      }
    }
    return WrappedComponent as any
  }
}

export const reactAdapter = new ReactAdapter()
