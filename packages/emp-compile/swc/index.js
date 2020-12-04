module.exports = fn => ec => {
  const {config} = ec
  config.module
    .rule('scripts')
    .use('babel')
    .loader('swc-loader')
    .options({
      sync: true,
      jsc: {
        externalHelpers: true,
        parser: {
          syntax: 'typescript',
          tsx: true,
          dynamicImport: true,
          decorators: true,
        },
      },
    })

  config.module.rule('svg').use('svgr').before('url').loader('@svgr/webpack')

  return fn && fn(ec)
}
