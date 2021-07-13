export const __WindowTopCache: any = ((win: any) => {
  const top: any = win.top
  top.__mobx = top.__mobx || {}
  return top.__mobx
})(window)
