type PeerModule = typeof import('./Peer')
type FederationContainer = {
  get: (module: string) => Promise<() => PeerModule>
  init: (shareScope: Record<string, unknown>) => Promise<void> | void
}

const proxiedRole = location.pathname.match(/container-static\/(dual-role-[ab])\//)?.[1]
const currentPort = proxiedRole === 'dual-role-a' ? '8201' : proxiedRole === 'dual-role-b' ? '8202' : location.port
const peerPort = currentPort === '8201' ? '8202' : '8201'
const root = document.createElement('main')
root.innerHTML = `<h1>Dual role endpoint ${currentPort}</h1><div data-peer-result>Loading peer ${peerPort}...</div>`
document.body.appendChild(root)

function loadPeerContainer() {
  return new Promise<FederationContainer>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `http://${location.hostname}:${peerPort}/emp.js`
    script.async = true
    script.onload = () => {
      const container = (window as Window & {dualRole?: FederationContainer}).dualRole
      if (container) resolve(container)
      else reject(new Error(`dualRole container from ${peerPort} did not register`))
    }
    script.onerror = () => reject(new Error(`dualRole container from ${peerPort} failed to load`))
    document.head.appendChild(script)
  })
}

const result = root.querySelector('[data-peer-result]') as HTMLElement
async function consumePeer() {
  try {
    const container = await loadPeerContainer()
    await container.init({})
    const factory = await container.get('./Peer')
    const peer = factory()
    peer.renderPeer(result, {
      sourcePort: currentPort,
      targetPort: peerPort,
    })
  } catch (error) {
    result.textContent = `Dual role load error: ${error instanceof Error ? error.message : String(error)}`
  }
}

void consumePeer()
