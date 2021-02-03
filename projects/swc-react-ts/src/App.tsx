import React from 'react'
import SVGA from 'src/components/SVGA'
import SVG from 'src/components/SVG'
// import DEMO from 'src/components/DEMO1'
import ANTDDEMO from 'src/components/ANTD'
import css from './app.module.scss'
console.log('SVG', SVG)
const App = (): any => (
  <div className={css.wrap}>
    <h2>.Module Federation DEMO!!!</h2>
    {/* <DEMO /> */}
    <h2>.Antd</h2>
    <ANTDDEMO />
    <h2>.SVGA DEMO</h2>
    <SVGA />
    <h2>.SVG DEMO</h2>
    <SVG />
  </div>
)
export default App
