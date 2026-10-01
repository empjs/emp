import {createRemoteAppComponent as reactConsumer, createBridgeComponent as reactProvider} from '@empjs/bridge-react'
import {createRemoteAppComponent as vue2Consumer, createBridgeComponent as vue2Provider} from '@empjs/bridge-vue2'
import {createRemoteAppComponent as vue3Consumer, createBridgeComponent as vue3Provider} from '@empjs/bridge-vue3'
import reactPackage from '../../../../packages/bridge-react/package.json'
import vue2Package from '../../../../packages/bridge-vue2/package.json'
import vue3Package from '../../../../packages/bridge-vue3/package.json'
import type {DemoProps, FrameworkId, FrameworkRuntime} from './types'

const propDefinitions = {
  name: {type: String, default: 'Bridge Demo'},
  step: {type: Number, default: 1},
  instanceId: {type: String, default: 'demo'},
  note: {type: String, default: '未提供'},
  onChange: Function,
  onLifecycle: Function,
}

export function reactRuntime(id: FrameworkId, React: any, ReactDOM: any, createRoot?: any): FrameworkRuntime {
  const label = `React ${React.version.split('.')[0]}`
  const options = {React, ReactDOM, createRoot}
  function Demo(props: DemoProps) {
    const [count, setCount] = React.useState(0)
    const latest = React.useRef(props)
    latest.current = props
    React.useEffect(() => {
      latest.current.onLifecycle?.({runtime: id, instanceId: props.instanceId, type: 'mounted'})
      return () => latest.current.onLifecycle?.({runtime: id, instanceId: props.instanceId, type: 'unmounted'})
    }, [])
    const change = (value: number) => {
      setCount(value)
      props.onChange?.({runtime: id, instanceId: props.instanceId, type: 'countChanged', value})
    }
    return React.createElement(
      'div',
      {'data-runtime': id, 'data-instance': props.instanceId, className: 'framework-demo'},
      React.createElement('span', {className: 'version-badge'}, `组件 · React ${React.version}`),
      React.createElement('h3', {'data-demo-name': true}, props.name),
      React.createElement('p', {'data-demo-note': true}, props.note ?? '未提供'),
      React.createElement(
        'div',
        {className: 'counter-row'},
        React.createElement('output', {'data-count': true, 'aria-live': 'polite'}, count),
        React.createElement(
          'button',
          {'data-increment': true, onClick: () => change(count + props.step)},
          `+${props.step}`,
        ),
        React.createElement('button', {'data-reset': true, className: 'quiet', onClick: () => change(0)}, '重置'),
      ),
    )
  }
  return {
    id,
    label,
    version: React.version,
    bridge: reactPackage.name,
    bridgeVersion: reactPackage.version,
    provider: reactProvider(Demo, options),
    host(component, onError) {
      const Remote = reactConsumer(component, {React}, {onError})
      const Host = (props: DemoProps) =>
        React.createElement(
          'section',
          {'data-host': id, className: 'bridge-host'},
          React.createElement('span', {className: 'host-version'}, `宿主 · React ${React.version}`),
          React.createElement(Remote, props),
        )
      return reactProvider(Host, options)
    },
  }
}

export function vueRuntime(id: 'vue2' | 'vue3', Vue: any): FrameworkRuntime {
  const isVue2 = id === 'vue2'
  const makeProvider = isVue2 ? vue2Provider : vue3Provider
  const makeConsumer = isVue2 ? vue2Consumer : vue3Consumer
  const bridge = isVue2 ? vue2Package : vue3Package
  const Demo = {
    name: 'FrameworkDemo',
    props: propDefinitions,
    data: () => ({count: 0}),
    mounted(this: any) {
      this.onLifecycle?.({runtime: id, instanceId: this.instanceId, type: 'mounted'})
    },
    ...(isVue2
      ? {
          beforeDestroy(this: any) {
            this.onLifecycle?.({runtime: id, instanceId: this.instanceId, type: 'unmounted'})
          },
        }
      : {
          beforeUnmount(this: any) {
            this.onLifecycle?.({runtime: id, instanceId: this.instanceId, type: 'unmounted'})
          },
        }),
    methods: {
      change(this: any, value: number) {
        this.count = value
        this.onChange?.({runtime: id, instanceId: this.instanceId, type: 'countChanged', value})
      },
    },
    render(this: any, createElement?: any) {
      const h = isVue2 ? createElement : Vue.h
      const attrs = (data: Record<string, any>) => (isVue2 ? {attrs: data} : data)
      const click = (fn: () => void) => (isVue2 ? {on: {click: fn}} : {onClick: fn})
      return h('div', {...attrs({'data-runtime': id, 'data-instance': this.instanceId}), class: 'framework-demo'}, [
        h('span', {class: 'version-badge'}, `组件 · Vue ${Vue.version}`),
        h('h3', attrs({'data-demo-name': true}), this.name),
        h('p', attrs({'data-demo-note': true}), this.note ?? '未提供'),
        h('div', {class: 'counter-row'}, [
          h('output', attrs({'data-count': true, 'aria-live': 'polite'}), String(this.count)),
          h(
            'button',
            {...attrs({'data-increment': true}), ...click(() => this.change(this.count + this.step))},
            `+${this.step}`,
          ),
          h('button', {...attrs({'data-reset': true}), class: 'quiet', ...click(() => this.change(0))}, '重置'),
        ]),
      ])
    },
  }
  return {
    id,
    label: isVue2 ? 'Vue 2' : 'Vue 3',
    version: Vue.version,
    bridge: bridge.name,
    bridgeVersion: bridge.version,
    provider: makeProvider(Demo, {Vue}),
    host(component, onError) {
      const Remote = makeConsumer(component, {Vue}, {onError})
      const Host = {
        props: propDefinitions,
        render(this: any, createElement?: any) {
          const h = isVue2 ? createElement : Vue.h
          return h('section', {class: 'bridge-host', ...(isVue2 ? {attrs: {'data-host': id}} : {'data-host': id})}, [
            h('span', {class: 'host-version'}, `宿主 · Vue ${Vue.version}`),
            h(Remote, isVue2 ? {attrs: {...this.$props}} : {...this.$props}),
          ])
        },
      }
      return makeProvider(Host, {Vue})
    },
  }
}
