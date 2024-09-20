import {useState, version} from 'react'
import './App.css'
import ReactLogo from './assets/react.svg'
import ReactInline from './assets/react.svg?inline'

import {CountComp, ShowCountComp} from './CountComp'
import Section from './component/Section'
//
type AppType = {
  from?: string
  version?: string
  component?: any
  nameformRemote?: string
}

function App(o: AppType) {
  const [count, setCount] = useState(0)
  return (
    <div className="App">
      <div>
        <a rel="noreferrer">
          <img src={ReactLogo} className="logo react" alt="React logo" />
          {/* <ReactLogo /> */}
        </a>
      </div>
      <h1>EMP 3.0 React {version}</h1>
      <ShowCountComp />
      {o.from ? <p>{o.from}</p> : ''}
      {o.nameformRemote ? <p>{o.nameformRemote}</p> : ''}
      {o.version ? <p>React Version {o.version}</p> : ''}
      <h2>Inject Diff Component</h2>
      {o.component && <o.component />}
      <Section />
      <CountComp />
      <h2>Image List</h2>
      <div className="imageList">
        <span>
          inline: <img src={ReactInline} />
        </span>
        <span>
          url: <img src={ReactLogo} />
        </span>
      </div>
    </div>
  )
}

export default App
