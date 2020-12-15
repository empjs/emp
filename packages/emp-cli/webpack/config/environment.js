module.exports = type => {
  let config = {}
  switch (type) {
    case 'esm':
      config = {
        arrowFunction: true,
        bigIntLiteral: true,
        const: true,
        destructuring: true,
        forOf: true,
        dynamicImport: true,
        module: true,
      }
      break
    //es5
    default:
      config = {
        arrowFunction: false,
        bigIntLiteral: false,
        const: false,
        destructuring: false,
        forOf: false,
        dynamicImport: false,
        module: false,
      }
      break
  }
  return config
}
