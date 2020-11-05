import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {DynamicWrap, DynamicDataType} from './components/DynamicWrap'
const DynamicDemo = (): any => {
  const [system, setSystem] = React.useState<DynamicDataType>()

  function setApp2() {
    // https://www.jeremypay.com/lab/mflab/app2/dist/remoteEntry.js
    setSystem({
      url: 'http://www.jeremypay.com/lab/mflab/app2/dist/remoteEntry.js',
      scope: 'app2',
      module: './Widget',
    })
  }

  function setApp3() {
    // https://www.jeremypay.com/lab/mflab/app2/dist/remoteEntry.js
    setSystem({
      url: 'http://localhost:8002/emp.js',
      scope: 'demo2',
      module: './components/Hello',
    })
  }

  return (
    <>
      <h1>Hello Dynamic System Host</h1>
      <button onClick={setApp2}>常规MF组件动态加载</button>
      <button onClick={setApp3}>EMP组件动态加载</button>
      <div style={{marginTop: '2em'}}>{system ? <DynamicWrap system={system} /> : <></>}</div>
    </>
  )
}

// log('==============testing!!!!==============================')
ReactDOM.render(
  <>
    <DynamicDemo />
  </>,
  document.getElementById('emp-root'),
)
