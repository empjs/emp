import {expect, test} from '@rstest/core'
import {createInstance} from '@module-federation/runtime'
import {loadAppFrame, removeFrame} from '@empjs/test-support/browser/frame'
import forceRemotePlugin from '../../dist/forceRemote.js'
import {shareForceRemote} from '../../src/helper/config'
import {registerRemotes} from '../../src/plugins/rspack/runtimePlugin/registerRemotes'

type ForceRemoteMap = Record<string, {entry?: string} | string>

function createRemote(field: 'entry' | 'url' | 'manifest', value: string, alias: string) {
  return {
    alias,
    [field]: value,
  } as Record<'alias' | 'entry' | 'url' | 'manifest', string>
}

function runBeforeRegisterRemote(remote: Record<string, unknown>) {
  const plugin = forceRemotePlugin()
  const args = {remote}
  const result = plugin.beforeRegisterRemote?.(args)
  return {args, remote, result}
}

test('forceRemote rewrites alias entries and leaves unmatched remotes unchanged', () => {
  const win = window as typeof window & Record<string, ForceRemoteMap | undefined>
  try {
    win[shareForceRemote] = {
      mfHost: {entry: 'https://mirror.example.test/mfHost/emp.js'},
    }

    const aliasedRemote = createRemote('entry', 'https://cdn.example.test/mfHost/emp.js', 'mfHost')
    const unmatchedRemote = createRemote('entry', 'https://cdn.example.test/other/emp.js', 'otherRemote')

    const aliasedResult = runBeforeRegisterRemote(aliasedRemote)
    const unmatchedResult = runBeforeRegisterRemote(unmatchedRemote)

    expect(aliasedResult.result).toBe(aliasedResult.args)
    expect(aliasedRemote.entry).toBe('https://mirror.example.test/mfHost/emp.js')
    expect(unmatchedRemote.entry).toBe('https://cdn.example.test/other/emp.js')
    expect(unmatchedResult.result).toBe(unmatchedResult.args)
  } finally {
    delete win[shareForceRemote]
  }
})

test('forceRemote replaces versions in entry url and manifest fields', () => {
  const win = window as typeof window & Record<string, ForceRemoteMap | undefined>
  try {
    win[shareForceRemote] = {
      versionedRemote: '9.9.9',
    }

    for (const field of ['entry', 'url', 'manifest'] as const) {
      const remote = createRemote(field, `https://cdn.example.test/versionedRemote@1.2.3/emp.js`, 'versionedRemote')
      runBeforeRegisterRemote(remote)
      expect(remote[field]).toBe('https://cdn.example.test/versionedRemote@9.9.9/emp.js')
    }
  } finally {
    delete win[shareForceRemote]
  }
})

test('forceRemote falls back to the remote name when alias is unavailable', () => {
  const win = window as typeof window & Record<string, ForceRemoteMap | undefined>
  try {
    win[shareForceRemote] = {
      mfHost: {entry: 'https://mirror.example.test/mfHost/emp.js'},
      mfAlias: {entry: 'https://alias.example.test/mfHost/emp.js'},
    }

    const nameOnlyRemote = {
      name: 'mfHost',
      entry: 'https://cdn.example.test/mfHost/emp.js',
    }
    const aliasedRemote = {
      alias: 'mfAlias',
      name: 'mfHost',
      entry: 'https://cdn.example.test/mfHost/emp.js',
    }
    runBeforeRegisterRemote(nameOnlyRemote)
    runBeforeRegisterRemote(aliasedRemote)

    expect(nameOnlyRemote.entry).toBe('https://mirror.example.test/mfHost/emp.js')
    expect(aliasedRemote.entry).toBe('https://alias.example.test/mfHost/emp.js')
  } finally {
    delete win[shareForceRemote]
  }
})

test('registerRemotes injects the browser config consumed by the runtime plugin', () => {
  const calls: Array<{tags: Array<Record<string, unknown>>; key: string}> = []
  registerRemotes(
    {
      injectTags(tags: Array<Record<string, unknown>>, key: string) {
        calls.push({tags, key})
      },
    } as never,
    {mfHost: {entry: 'https://mirror.example.test/mfHost/emp.json'}},
  )

  expect(calls).toEqual([
    {
      key: 'EMP_FORCE_REMOTES',
      tags: [
        {
          innerHTML:
            'window.EMP_FORCE_REMOTES = {"mfHost":{"entry":"https://mirror.example.test/mfHost/emp.json"}};',
          tagName: 'script',
          pos: 'head',
        },
      ],
    },
  ])
})

test('forceRemote overrides a registered remote before the real runtime fetches its manifest', async () => {
  const win = window as typeof window & Record<string, ForceRemoteMap | undefined>
  const alias = `forceRemoteMfHost${Date.now()}`
  const originalEntry = `${window.location.origin}/container-static/missing-force-remote/emp.json`
  const forcedEntry = `${window.location.origin}/container-static/mf-host/emp.json`
  const requestedUrls: string[] = []
  const originalFetch = window.fetch.bind(window)
  const hostFrame = await loadAppFrame('mf-host')

  try {
    const globals = win as typeof win & Record<string, unknown>
    const hostGlobals = hostFrame.contentWindow as (Window & typeof globalThis & Record<string, unknown>) | null
    globals.EMP_ADAPTER_REACT = hostGlobals?.EMP_ADAPTER_REACT
    globals.EMP_SHARE_RUNTIME = hostGlobals?.EMP_SHARE_RUNTIME
    expect(globals.EMP_ADAPTER_REACT).toBeTruthy()
    expect(globals.EMP_SHARE_RUNTIME).toBeTruthy()
    window.fetch = async (input, init) => {
      requestedUrls.push(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url)
      return originalFetch(input, init)
    }
    win[shareForceRemote] = {
      [alias]: {entry: forcedEntry},
    }

    const runtime = createInstance({
      name: `force-remote-browser-${Date.now()}`,
      remotes: [{name: 'mfHost', alias, entry: originalEntry}],
      plugins: [forceRemotePlugin()],
    })
    const remoteModule = await runtime.loadRemote<Record<string, unknown>>(`${alias}/CountComp`)

    expect(remoteModule?.CountComp).toBeTruthy()
    expect(remoteModule?.ShowCountComp).toBeTruthy()
    expect(requestedUrls).toContain(forcedEntry)
    expect(requestedUrls).not.toContain(originalEntry)
  } finally {
    window.fetch = originalFetch
    await removeFrame(hostFrame)
    delete win[shareForceRemote]
    delete (win as typeof win & Record<string, unknown>).EMP_ADAPTER_REACT
    delete (win as typeof win & Record<string, unknown>).EMP_SHARE_RUNTIME
  }
}, 90000)
