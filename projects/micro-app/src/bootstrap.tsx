import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(
  <>
    <App />
  </>,
  document.getElementById('emp-root'),
)
// import.meta.webpackHot
if (module.hot) {
  module.hot.accept(err => {
    console.log('An error occurred while accepting new version')
  })
}
