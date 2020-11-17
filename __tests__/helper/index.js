var exec = require('child_process').exec
exports.cli = function (cmd, cwd) {
  return new Promise(resolve => {
    exec(cmd, {cwd}, (error, stdout, stderr) => {
      resolve({
        code: error && error.code ? error.code : 0,
        error,
        stdout,
        stderr,
      })
    })
  })
}
