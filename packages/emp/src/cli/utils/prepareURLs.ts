import url from 'url'
import chalk from 'chalk'
import address from 'address'
import defaultGateway from 'default-gateway'

export default function prepareUrls(protocol: any, host: string, port: number, pathname = '/') {
  const formatUrl = (hostname: string) =>
    url.format({
      protocol,
      hostname,
      port,
      pathname,
    })
  const prettyPrintUrl = (hostname: string) =>
    url.format({
      protocol,
      hostname,
      port: chalk.bold(port),
      pathname,
    })

  const isUnspecifiedHost = host === '0.0.0.0' || host === '::'
  let prettyHost, lanUrlForConfig
  let lanUrlForTerminal = chalk.gray('unavailable')
  if (isUnspecifiedHost) {
    prettyHost = 'localhost'
    try {
      // This can only return an IPv4 address
      const result = defaultGateway.v4.sync()
      lanUrlForConfig = address.ip(result && result.interface)
      if (lanUrlForConfig) {
        // Check if the address is a private ip
        // https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces
        if (/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(lanUrlForConfig)) {
          // Address is private, format it for later use
          lanUrlForTerminal = prettyPrintUrl(lanUrlForConfig)
        } else {
          // Address is not private, so we will discard it
          lanUrlForConfig = undefined
        }
      }
    } catch (_e) {
      // ignored
    }
  } else {
    prettyHost = host
    lanUrlForConfig = host
    lanUrlForTerminal = prettyPrintUrl(lanUrlForConfig)
  }
  const localUrlForTerminal = prettyPrintUrl(prettyHost)
  const localUrlForBrowser = formatUrl(prettyHost)
  return {
    lanUrlForConfig,
    lanUrlForTerminal,
    localUrlForTerminal,
    localUrlForBrowser,
  }
}
