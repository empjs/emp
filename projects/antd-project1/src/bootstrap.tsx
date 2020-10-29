import React from 'react'
import ReactDOM from 'react-dom'
import {routes} from 'src/configs/router'
import EMPApp from '@emp-antd/base/App'
import {langStore} from 'src/stores/langStore'
const App = () => <EMPApp routes={routes} stores={{langStore}} />
//

ReactDOM.render(<App />, document.getElementById('emp-root'))
