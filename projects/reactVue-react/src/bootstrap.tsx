import * as React from 'react'
import * as ReactDOM from 'react-dom'

import Hello from 'src/components/Hello'
import Content from '@emp/vueComponents/Content.vue'
import { VueInReact } from 'vuera'

const VueComponent = VueInReact(Content)

ReactDOM.render(
  <>
    <Hello title="I am React Project" />
    <div style={{ backgroundColor: '#eee', padding: '20px' }}>
      <VueComponent title="React use Vue Component" />
    </div>
  </>,
  document.getElementById('emp-root'),
)
