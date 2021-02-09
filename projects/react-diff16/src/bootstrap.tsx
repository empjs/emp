import * as React from 'react'
import * as ReactDOM from 'react-dom'

import Adapter from '@efox/react-diff-adapt'
ReactDOM.render(
  <>
    <div style={{backgroundColor: '#eee', padding: '20px'}}>
      <h2>React 16 Component: Hello!!</h2>
    </div>
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
