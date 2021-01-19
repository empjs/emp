import React, {ReactElement} from 'react'
import RouterComp from 'src/components/RouterComp'
import {RouterCompProps} from 'src/types'
import './App.scss'

const App = (props: RouterCompProps): ReactElement => <RouterComp {...props} />

export default App
