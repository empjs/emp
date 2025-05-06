import net from 'net'
import os from 'os'

const minPort = 1024
const maxPort = 65_535
const httpsPort = 443

/**
 * @return {Set<string|undefined>}
 */
const getLocalHosts = () => {
  const interfaces = os.networkInterfaces()

  // Add undefined value for createServer function to use default host,
  // and default IPv4 host in case createServer defaults to IPv6.
  // eslint-disable-next-line no-undefined
  const results = new Set([undefined, '0.0.0.0'])

  for (const _interface of Object.values(interfaces)) {
    if (_interface) {
      for (const config of _interface) {
        results.add(config.address)
      }
    }
  }

  return results
}

/**
 * @param {number} basePort
 * @param {string | undefined} host
 * @return {Promise<number>}
 */
const checkAvailablePort = (basePort: number, host?: string) =>
  new Promise((resolve, reject) => {
    const server = net.createServer()
    server.unref()
    server.on('error', reject)

    server.listen(basePort, host, () => {
      // Next line should return AdressInfo because we're calling it after listen() and before close()
      const {port}: any = server.address()
      server.close(() => {
        resolve(port)
      })
    })
  })

/**
 * @param {number} port
 * @param {Set<string|undefined>} hosts
 * @return {Promise<number>}
 */
const getAvailablePort = async (port: number, hosts: any) => {
  /**
   * Errors that mean that host is not available.
   * @type {Set<string | undefined>}
   */
  const nonExistentInterfaceErrors = new Set(['EADDRNOTAVAIL', 'EINVAL'])
  /* Check if the post is available on every local host name */
  for (const host of hosts) {
    try {
      await checkAvailablePort(port, host) // eslint-disable-line no-await-in-loop
    } catch (error: any) {
      /* We throw an error only if the interface exists */
      if (!nonExistentInterfaceErrors.has(/** @type {NodeJS.ErrnoException} */ error.code)) {
        throw error
      }
    }
  }

  return port
}

/**
 * @param {number} basePort
 * @param {string=} host
 * @return {Promise<number>}
 */
export async function getPorts(basePort: number, host = undefined) {
  if (basePort !== httpsPort && (basePort < minPort || basePort > maxPort)) {
    throw new Error(`Port number must lie between ${minPort} and ${maxPort}`)
  }

  let port = basePort
  const localhosts = getLocalHosts()
  let hosts
  if (host && !localhosts.has(host)) {
    hosts = new Set([host])
  } else {
    /* If the host is equivalent to localhost
       we need to check every equivalent host
       else the port might falsely appear as available
       on some operating systems  */
    hosts = localhosts
  }
  /** @type {Set<string | undefined>} */
  const portUnavailableErrors = new Set(['EADDRINUSE', 'EACCES'])
  while (port <= maxPort) {
    try {
      const availablePort = await getAvailablePort(port, hosts) // eslint-disable-line no-await-in-loop
      return availablePort
    } catch (error: any) {
      /* Try next port if port is busy; throw for any other error */
      if (!portUnavailableErrors.has(/** @type {NodeJS.ErrnoException} */ error.code)) {
        throw error
      }
      port += 1
    }
  }

  throw new Error('No available ports found')
}
