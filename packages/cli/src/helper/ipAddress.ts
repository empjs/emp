import url from 'url'
import chalk from 'chalk'
import {gray} from 'src/helper/color'
import {getLanIp} from './utils'
type IpAdressOpt = {
  protocol?: string
  port?: number
  pathname?: string
  host?: string
}
class IpAdress {
  imf = {
    protocol: '',
    port: 8000,
    pathname: '/',
  }
  host = '0.0.0.0'

  urls = {
    lanUrlForConfig: '',
    lanUrlForTerminal: gray('unavailable'),
    localUrlForTerminal: '',
    localUrlForBrowser: '',
  }

  setup(o: IpAdressOpt) {
    if (o.host) this.host = o.host
    if (o.protocol) this.imf.protocol = o.protocol
    if (o.pathname) this.imf.pathname = o.pathname
    if (o.port) this.imf.port = o.port
    this.setupUrls()
  }
  private setupUrls() {
    const {host} = this
    const isUnspecifiedHost = host === '0.0.0.0' || host === '::'
    let prettyHost
    if (isUnspecifiedHost) {
      prettyHost = 'localhost'
      try {
        this.urls.lanUrlForConfig = this.getLanIp()
        if (this.urls.lanUrlForConfig) {
          // Check if the address is a private ip
          // https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces
          if (/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(this.urls.lanUrlForConfig)) {
            // Address is private, format it for later use
            this.urls.lanUrlForTerminal = this.prettyPrintUrl(this.urls.lanUrlForConfig)
          } else {
            // Address is not private, so we will discard it
            this.urls.lanUrlForConfig = ''
          }
        }
      } catch (_e) {
        // ignored
      }
    } else {
      prettyHost = host
      this.urls.lanUrlForConfig = host
      this.urls.lanUrlForTerminal = this.prettyPrintUrl(this.urls.lanUrlForConfig)
    }
    this.urls.localUrlForTerminal = this.prettyPrintUrl(prettyHost)
    this.urls.localUrlForBrowser = this.formatUrl(prettyHost)
  }
  public getLanIp = getLanIp
  formatUrl(hostname: string) {
    const {protocol, port, pathname} = this.imf
    return url.format({
      protocol,
      hostname,
      port,
      pathname,
    })
  }
  prettyPrintUrl(hostname: string) {
    const {protocol, port, pathname} = this.imf
    return url.format({
      protocol,
      hostname,
      port: chalk.bold(port),
      pathname,
    })
  }
}
export default new IpAdress()
/* export function prepareUrls(protocol: any, host: string, port: number, pathname = '/') {
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
      const {int} = gateway4sync()
      lanUrlForConfig = ip(int || '')
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
 */
