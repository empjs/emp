/* eslint-disable react/prop-types */
import React from 'react'
class Adapter extends React.Component {
  constructor(props) {
    super(props)
    this.refHold
  }
  init = hydrate => {
    ;(async () => {
      const ReactDOM = await this.props.newReactDOM()
      const React = await this.props.newReact()
      const RemoteComponent = await this.props?.importer()
      const {importer, children, ...rest} = this.props
      const renderMethod = hydrate ? ReactDOM.hydrate : ReactDOM.render
      renderMethod(React.createElement(RemoteComponent.default, rest, children), this.refHold)
    })()
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    this.init(true)
  }

  componentDidMount() {
    this.init()
  }

  render() {
    return (
      <div style={{border: '1px red solid', padding: '10px', margin: '20px 0'}} ref={ref => (this.refHold = ref)} />
    )
  }
}

export default Adapter
