import './global'
import {observable, observe} from 'mobx'
// import {__WindowTopCache} from './cache'
import {serialize} from './serialize'
export const __WindowTopCache: any = ((win: any) => {
  const top: any = win.top
  top.__mobx = top.__mobx || {}
  return top.__mobx
})(window)

export function empCreateClassStore<T>(Ctor: {new (...args: any[]): any}): T {
  const namespace = serialize(Ctor)
  const clazz = __WindowTopCache[namespace] || new Ctor()
  clazz.__name = namespace
  __WindowTopCache[namespace] = clazz
  return clazz
}

export function empCreateObjectStore<T>(obj: Record<any, any> & T): T & {__name: string} {
  const namespace = serialize(obj)
  const clazz: typeof obj & {__name: string} = __WindowTopCache[namespace] || observable(obj)
  clazz.__name = namespace
  if (!__WindowTopCache[namespace]) {
    observe(clazz, (change: any) => {
      return change
    })
  }
  __WindowTopCache[namespace] = clazz
  return clazz
}
