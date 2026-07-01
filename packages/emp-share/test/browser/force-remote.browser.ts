import {expect, test} from '@rstest/core'
import forceRemotePlugin from '../../dist/forceRemote.js'
import {shareForceRemote} from '../../src/helper/config'

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
