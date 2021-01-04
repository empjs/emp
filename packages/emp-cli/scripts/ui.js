const {start} = require('@efox/emp-gui/server')
const {openBrowser} = require('../helpers/bowser')
const {portInUsed} = require('../helpers/port')
const chalk = require('chalk')

module.exports = async args => {
  const {host = 'localhost', port = '1234', headless = false} = args || {}
  let useablePort = port
  while (await portInUsed({host, port: useablePort})) {
    useablePort++
  }
  if (useablePort !== port) {
    console.log(chalk.green(`由于端口${port}已经被占用，帮你改为启用${useablePort}端口`))
  }
  const url = `http://${host}:${useablePort}`
  start({host, port: useablePort}, () => (!headless ? openBrowser(url) : console.log(useablePort)))
}
