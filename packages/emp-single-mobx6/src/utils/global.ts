;(window => {
  try {
    ;(window as any).__mobxGlobals = (window.top as any).__mobxGlobals
    ;(() => {
      !(window as any).__mobxGlobals && require('mobx')
    })()
  } catch (e) {
    console.error('同步mobxglobals失败')
    // const length = window.top.frames.length
    // for (let index = 0; index < length; index++) {
    //   try {
    //     window.top.frames[index] && window.top.frames[index].origin
    //     ;(() => {
    //       require('mobx')
    //       // window.top.frames[index].__mobxGlobals
    //     })()
    //   } catch (e) {
    //     console.error('同步iframeMobxglobals失败', index)
    //   }
    // }
    const length = window.top.frames.length
    let tmpMobxGlobals
    for (let index = 0; index < length; index++) {
      try {
        window.top.frames[index] && window.top.frames[index].origin
        tmpMobxGlobals = tmpMobxGlobals || window.top.frames[index].__mobxGlobals
        ;(() => {
          !tmpMobxGlobals && require('mobx')
          tmpMobxGlobals = tmpMobxGlobals || window.top.frames[index].__mobxGlobals
        })()
        window.top.frames[index].__mobxGlobals = tmpMobxGlobals
      } catch (e) {
        console.error('同步iframeMobxglobals失败', index)
      }
    }
    ;(window as any).__mobxGlobals = tmpMobxGlobals || require('mobx')
  }
})(window)
