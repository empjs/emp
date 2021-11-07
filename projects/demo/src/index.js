// Test import of a JavaScript module
import {example} from 'src/js/example'

const heading = document.createElement('h1')
heading.textContent = example()

const app = document.querySelector('#emp-root')
app.innerHTML = ''
app.append(heading)

if (module.hot) {
  module.hot.accept(err => {
    console.log('An error occurred while accepting new version')
  })
}
