// import emp from 'emp-lib'
// emp()

import App, {mod} from 'emp-lib'
import logger from 'emp-lib/helper/logger'
// import wp from 'webpack-lib'
// wp()
// import('emp-lib').then(fn => fn.default())
// import('webpack-lib').then(fn => fn.default())
// console.log(App)
console.log(mod('abc'))
import('emp-lib/helper/logger').then(logger => {
  logger.default.warnning('[emp lib logger]', Math.random())
})
App()
const div = document.createElement('div')
const h1 = document.createElement('h1')
h1.innerText = 'emp v2 library demo'
document.body.appendChild(h1)

console.log('process.env.DOTENV', process.env.DOTENV, 'mode', process.env.mode, 'env', process.env.env)
