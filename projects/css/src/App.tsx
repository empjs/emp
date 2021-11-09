import React, {useEffect} from 'react'
import Common from './comps/common'
import CSass from './comps/sass'
import CLess from './comps/less'
import './App.css'
import CssModule from './App.module.css'
import './App.scss'
import SassModule from './App.module.scss'

console.log(CssModule, SassModule)

const App = () => {
  useEffect(() => {
    import('./comps/requireCSS/index').then(myModule => {
      console.log(myModule.default)
    })
  }, [])

  return (
    <h1 style={{fontWeight: 300}}>
      Css Pack Test
      <Common />
      <CSass />
      <CLess />
    </h1>
  )
}
export default App
