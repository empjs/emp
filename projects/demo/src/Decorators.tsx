import {observer} from 'mobx-react'
import React from 'react'
import {TodoStore} from './store/incStore'
//
@observer
class Decorators extends React.Component {
  render() {
    return (
      <>
        <h2>TodoStore</h2>
        <p>{TodoStore.finished ? 'true' : 'false'}</p>
        <button onClick={() => TodoStore.toggle()}>finished toggle</button>
      </>
    )
  }
}

export default Decorators
