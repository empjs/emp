import Components from 'src/components'

export type EMPData = {
  Components: typeof Components
}

const EMP: EMPData = {
  Components,
}

if (window.boot) {
  const fn = window.boot
  window.boot = async function () {
    cc.EMP = EMP
    fn()
  }
} else {
  cc.EMP = EMP
}