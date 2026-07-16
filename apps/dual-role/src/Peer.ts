export type PeerRenderOptions = {
  sourcePort: string
  targetPort: string
}

export function renderPeer(container: HTMLElement, options: PeerRenderOptions) {
  container.textContent = `Dual role ${options.sourcePort} consumed peer ${options.targetPort}`
}
