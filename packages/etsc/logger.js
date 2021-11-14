const chalk = require('chalk')
const pkg = require('./package.json')
const logTagStyle = function (msg, c1, c2, w = '#ecf0f1') {
  return console.log(`${chalk.bgHex(w).hex(c1)(` ETSC v${pkg.version} `)}${chalk.hex(w).bgHex(c2)(` ${msg} `)}\n`)
}

module.exports = function (msg, tag = 'blue') {
  switch (tag) {
    case 'green':
      logTagStyle(msg, '#27ae60', '#2ecc71')
      break
    case 'blue':
      logTagStyle(msg, '#2980b9', '#3498db')

      break
    case 'red':
      logTagStyle(msg, '#c0392b', '#e74c3c')
      break
    case 'yellow':
      logTagStyle(msg, '#f39c12', '#f1c40f')
      break
    case 'purple':
      logTagStyle(msg, '#8e44ad', '#9b59b6')
      break
    case 'black':
      logTagStyle(msg, '#2c3e50', '#34495e')
      break
  }
}
