module.exports = (env, config) => {
  const experimentConf = {
    experiments: {
      // mjs: true,
      // outputModule: true,
      // 开启后 暂时 不支持调试环境 arrow function 转 es5
      topLevelAwait: true,
      // importAsync: true,
      // importAwait: true,
      // file-loader、url-loader、raw-loader
      asset: true,
      //wasm
      asyncWebAssembly: true,
      syncWebAssembly: true,
    },
  }
  config.merge(experimentConf)
}
