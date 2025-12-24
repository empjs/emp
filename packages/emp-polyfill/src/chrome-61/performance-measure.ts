const p: any = (typeof globalThis !== 'undefined' ? (globalThis as any) : {}).performance
if (p && typeof p.measure === 'function') {
  const m = p.measure.bind(p)
  ;(p as any).measure = function (name: string, startOrOptions?: any, endMark?: any) {
    if (startOrOptions && typeof startOrOptions === 'object') {
      const s = typeof startOrOptions.startMark === 'string' ? startOrOptions.startMark : undefined
      const e = typeof startOrOptions.endMark === 'string' ? startOrOptions.endMark : undefined
      try {
        if (s && p.getEntriesByName(s, 'mark').length === 0) return
        if (e && p.getEntriesByName(e, 'mark').length === 0) return
      } catch {}
      try {
        return m(name, s, e)
      } catch {
        return
      }
    }
    try {
      return m(name, startOrOptions, endMark)
    } catch {
      return
    }
  }
}
