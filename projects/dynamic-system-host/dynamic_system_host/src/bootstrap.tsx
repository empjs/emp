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

  return (
    <>
      <h1>Hello Dynamic System Host</h1>
      <button onClick={setApp2}>Load App 2 Widget</button>
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
