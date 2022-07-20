import {StrictMode} from 'react'
import {render} from 'react-dom'
import {RouterDom} from 'src/RouterDom'

render(
  <>
    <StrictMode>
      <RouterDom />
    </StrictMode>
  </>,
  document.getElementById('emp-root'),
)
