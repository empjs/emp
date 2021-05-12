import * as React from 'react'
// import * as ReactDOM from 'react-dom'
import Hello from './Hello'
import css from './index.module.scss'
import config from './config'
import Svgacase from 'src/components/svgacase'
import logourl, {ReactComponent as Logo} from 'src/assets/logo.svg'
import {ReactComponent as TipIcon} from 'src/assets/tongzhi.svg'
import mf from 'src/assets/logo.svg'
const mf2 = require('src/assets/logo.svg')
const mf3 = require('src/assets/logo.svg').default
console.log('logo:', 'import', mf, 'require', mf2, 'require default', mf3, 'import url', logourl)

const ButtonEvent = () => <button>Button Click Event</button>
class Democlass {
  a: any = 1
  constructor() {
    console.log(this.a)
  }
}
new Democlass()
export default function App(): any {
  /* const a = 1
  if (a === true) {
    console.log(1)
  } */
  return (
    <>
      <Logo width="350" className={css['App-logo']} />
      <img src={require('src/assets/mf.png')} width="300" />
      <h1 className={css.main}>EMP EMPTY PROJECT DEMO!</h1>
      <p>Infomation!!!!</p>
      <p>config:{JSON.stringify(config)}</p>
      <Hello />
      <ButtonEvent />
      <h2>SVG</h2>
      <TipIcon width={20} height={16} />
      <h2>SVGA CASE</h2>
      <Svgacase />
      <h2>Background Img</h2>
      <div className={css.imgBg}></div>
    </>
  )
}
