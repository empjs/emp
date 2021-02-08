import * as React from 'react'
import * as ReactDOM from 'react-dom'

import Hello from 'src/components/Hello'
import Demo from 'src/components/Demo'
import Adapter from 'src/adapt'
ReactDOM.render(
  <>
    <Hello />
    <Demo />
    <div style={{backgroundColor: '#eee', padding: '20px'}}>
      <h2>Demo2 Component: Hello!!</h2>
    </div>
    {/* <Hello2 compiler={'emp'} framework={'react'} /> */}
    <Adapter
      newReactDOM={async () => (await import('@emp/diff17/newReactDOM'))?.default}
      newReact={async () => (await import('@emp/diff17/newReact')).default}
      importer={() => import('@emp/diff17/components/Hello')}
      // any other props, passed to ModernComponent
      compiler={'emp'}
      framework={'react17'}>
      <h3>And these are children passed into it from the legacy app</h3>
    </Adapter>
  </>,
  document.getElementById('emp-root'),
)
