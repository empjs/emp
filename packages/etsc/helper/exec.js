const {exec} = require('child_process')

const execAsync = (commander, options = {}) => {
  return new Promise((resolve, reject) => {
    exec(commander, options, function (e, stdout, stderr) {
      if (e) {
        reject(e)
        return
      }
      resolve(stdout)
      if (stderr) console.error(stderr)
    })
  })
}
module.exports = execAsync
