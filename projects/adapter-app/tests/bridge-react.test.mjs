import assert from 'node:assert/strict'
import {test} from 'node:test'
import {createRemoteAppComponent} from '@empjs/bridge-react'

// Drive React's lifecycle boundaries deterministically, including a cleared
// DOM ref and StrictMode's mount/unmount/remount sequence on the same instance.
const React = {
  Component: class {
    constructor(props) {
      this.props = props
    }
  },
  createRef: () => ({current: null}),
  createElement: (type, props) => ({type, props}),
}
const tick = async () => {
  await Promise.resolve()
  await Promise.resolve()
}
const deferred = () => {
  let resolve
  const promise = new Promise(done => {
    resolve = done
  })
  return {promise, resolve}
}

test('deferred unmount destroys the captured DOM exactly once after React clears its ref', async () => {
  const dom = {}
  const calls = []
  const Remote = createRemoteAppComponent(() => ({render() {}, destroy: node => calls.push(node)}), {React})
  const instance = new Remote({})
  instance.containerRef.current = dom
  instance.componentDidMount()
  await tick()
  instance.componentWillUnmount()
  instance.containerRef.current = null
  await tick()
  assert.deepEqual(calls, [dom])
})

test('remount ignores stale loads and renders with the latest props', async () => {
  const first = deferred()
  const second = deferred()
  let loads = 0
  const rendered = []
  const staleProvider = () => {
    throw new Error('stale provider must never instantiate')
  }
  const currentProvider = () => ({render: (_dom, props) => rendered.push(props.name), destroy() {}})
  const Remote = createRemoteAppComponent(() => (++loads === 1 ? first.promise : second.promise), {React})
  const instance = new Remote({name: '初始'})
  assert.equal(loads, 0, 'construction must not start side effects')
  instance.containerRef.current = {}
  instance.componentDidMount()
  instance.componentWillUnmount()
  instance.props = {name: '重新挂载后的 Props'}
  instance.componentDidMount()
  first.resolve({default: staleProvider})
  second.resolve({default: currentProvider})
  await tick()
  assert.deepEqual(rendered, ['重新挂载后的 Props'])
  instance.componentWillUnmount()
  await tick()
})

test('render, update and destroy errors reach the consumer error callback', async () => {
  const received = []
  const failure = new Error('expected render failure')
  const destroyFailure = new Error('expected destroy failure')
  const Remote = createRemoteAppComponent(
    () => ({
      render() {
        throw failure
      },
      destroy() {
        throw destroyFailure
      },
    }),
    {React},
    {onError: error => received.push(error)},
  )
  const instance = new Remote({})
  instance.containerRef.current = {}
  instance.componentDidMount()
  await tick()
  instance.componentDidUpdate()
  instance.componentWillUnmount()
  await tick()
  assert.deepEqual(received, [failure, failure, destroyFailure])
})
