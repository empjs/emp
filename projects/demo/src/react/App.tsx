import {Button} from 'antd'
import {lazy, Suspense} from 'react'
import LogoUrl from 'src/assets/logo.svg'
import LogoComponent from 'src/assets/logo.svg?react'
import txt from 'src/file.txt?raw'
import AppLayout from 'src/react/AppLayout'
import CssModule from 'src/react/CssModule'
import classDemo from './classDemo'
import SameAssets from './SameAssets'

const LazyComponent = lazy(() => import('src/react/LazyComponent'))
console.log('logourl', txt)
classDemo.log()
//
function Loading() {
  return <h2>🌀 Loading...</h2>
}

//
function App() {
  return (
    <>
      <AppLayout>
        <h1 className="banner">
          <p>EMP 3.0</p>
        </h1>
        <div className="imgList">
          <h2 className="title">Image Text</h2>
          <ul>
            <li>
              <h3>Require Image</h3>
              <img className="img" src={require('src/assets/logo.jpg')} />
            </li>
            <li>
              <h3>Public Image</h3>
              <img className="img" src="/logo.jpg" />
            </li>
            <li>
              <h3>SVGR</h3>
              <LogoComponent className="logo" />
            </li>
            <li>
              <h3>SVG Url</h3>
              <img className="img" src={LogoUrl} />
            </li>
            <li>
              <h3>CSS Background Image</h3>
              <div className="img-yy-logo"></div>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="title">Content Text</h2>
          <p className="margin-p">body content!</p>
          <p>
            <a href="./info.html" target="_blank" rel="noreferrer">
              info page
            </a>
          </p>
          <p>
            <a href="./work" target="_blank" rel="noreferrer">
              work page
            </a>
          </p>
          <Suspense fallback={<Loading />}>
            <LazyComponent />
          </Suspense>
        </div>
        <CssModule />
        <SameAssets />
      </AppLayout>
    </>
  )
}
export default App
