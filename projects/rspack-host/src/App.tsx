import {Suspense, useState} from 'react'
// import ReactLogo from './assets/react.svg'
// import ReactInline from './assets/react.svg?inline'
import './App.css'
// import React from 'react'

function App() {
  const [count, setCount] = useState(0)
  return (
    <div className="App">
      <div>
        <a rel="noreferrer">
          {/* <img src={ReactLogo} className="logo react" alt="React logo" /> */}
          {/* <ReactLogo /> */}
        </a>
      </div>
      <h1>EMP 3.0 ESM React Host</h1>
      <div className="card">
        <button onClick={() => setCount(count => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the emp and React logos to learn more</p>
      <h2>Image List</h2>
      <div className="imageList">
        <span>{/* inline: <img src={ReactInline} /> */}</span>
        <span>{/* url: <img src={ReactLogo} /> */}</span>
      </div>
      <h1>act ui lazy loader</h1>
    </div>
  )
}

export default App
