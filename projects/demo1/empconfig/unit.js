const shareByVersion = module => {
  const vendorVersion = require(`${module}/package.json`).version
  const trimmedVersion = vendorVersion.substring(0, vendorVersion.length - 2)
  return {[trimmedVersion]: module}
}
module.exports = {shareByVersion}
