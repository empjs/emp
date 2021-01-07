const {resolveApp} = require('@efox/emp-cli/helpers/paths')
const empConfig = require(`${resolveApp('')}/emp.json`)

module.exports = fn => ec => {
  const {config} = ec
  config.plugin('mf').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        ...empConfig,
        // 被远程引入的文件名
        filename: 'emp.js',
      },
    }
    return args
  })
  return fn(ec)
}
