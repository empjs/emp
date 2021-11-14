const logger = require('./logger')
const ts = require('typescript')
const root = process.cwd()
/* const execAsync = require('./exec')
module.exports = () => {
  logger('dts generator.')
  return execAsync(`tsc --declaration --emitDeclarationOnly`, {cwd: root})
}
 */
//
module.exports = () => {}
