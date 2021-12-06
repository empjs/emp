// import emp from 'emp-lib'
// emp()

// import wp from 'webpack-lib'
// wp()
import('emp-lib').then(fn => fn.default())

// import('webpack-lib').then(fn => fn.default())

const div = document.createElement('div')
const h1 = document.createElement('h1')
h1.innerText = 'emp v2 library demo'
document.body.appendChild(h1)
