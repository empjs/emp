;(win => {
  try {
    ;(win as any).__mobxGlobals = (win.top as any).__mobxGlobals
  } catch (e) {
    console.error('同步mobxglobals失败')
  }
})(window)
