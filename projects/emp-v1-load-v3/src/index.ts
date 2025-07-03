import {loadComponent} from './load'

;(async function () {
  const {default: comp} = await loadComponent({url: `http://localhost:6001/emp.js`, scope: 'mfv3Host', module: './App'})
  console.log('mf-v2-load-v3', comp.toString())
})()
