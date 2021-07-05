import './utils/global'
// ;(win => {
//   try {
//     ;(win as any).__mobxGlobals = (win.top as any).__mobxGlobals
//     console.log('--', (win.top as any).__mobxGlobals)
//   } catch (e) {
//     console.error('同步mobxglobals失败')
//   }
// })(window)

const __WindowTopCache: any = (win => {
  const top: any = win.top
  top.__mobx = top.__mobx || {}
  return top.__mobx
})(window)

import {makeAutoObservable, observable, observe, onBecomeObserved, onBecomeUnobserved, toJS} from 'mobx'

function empCreateClassStore<T>(Ctor: {new (...args: any[]): any}): T {
  const namespace = Object.keys(Ctor.prototype).join('-').substr(0, 20)
  const clazz = __WindowTopCache[namespace] || new Ctor()
  clazz.__name = namespace
  __WindowTopCache[namespace] = clazz
  return clazz
}

function empCreateObjectStore<T>(obj: Record<any, any> & T, namespace?: string): T & {__name: string} {
  namespace = namespace || Object.keys(obj).join('-').substr(0, 20)
  const clazz: typeof obj & {__name: string} = __WindowTopCache[namespace] || observable(obj)
  clazz.__name = namespace
  if (!__WindowTopCache[namespace]) {
    observe(clazz, (change: any) => {
      // SampleBus.dispatchEvent(clazz.__name, change)
      return change
    })
  }
  __WindowTopCache[namespace] = clazz
  return clazz
}

export {
  makeAutoObservable,
  empCreateClassStore,
  observe,
  onBecomeObserved,
  onBecomeUnobserved,
  observable,
  empCreateObjectStore,
  toJS,
}
