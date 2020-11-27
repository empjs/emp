module.exports = fn => ec => {
  const {config, env, hot} = ec
  // config.merge({type: 'module'})
  return fn && fn(ec)
}
