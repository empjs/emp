import {expect, test} from '@rstest/core'
import {shareGlobalName, shareGlobalVal} from '../../src/helper/config'

test('EMPRuntime.setup throws when required globals are absent', async () => {
  const win = window as typeof window & Record<string, unknown>
  try {
    delete win[shareGlobalName]
    delete win[shareGlobalVal]

    const {EMPRuntime} = await import('../../dist/runtime.js')
    const runtime = new EMPRuntime()

    expect(() => runtime.setup()).toThrow('MFRuntime and MFSDK Required!')
  } finally {
    delete win[shareGlobalName]
    delete win[shareGlobalVal]
  }
})

test('EMPRuntime delegates to a browser global with real call semantics', async () => {
  const win = window as typeof window & Record<string, unknown>
  try {
    const calls: Array<{method: string; args: unknown[]}> = []
    const instance = {
      loadRemote: (...args: unknown[]) => {
        calls.push({method: 'loadRemote', args})
        return Promise.resolve({type: 'remote-result', args})
      },
      registerRemotes: (...args: unknown[]) => {
        calls.push({method: 'registerRemotes', args})
        return 'registered-remotes'
      },
      preloadRemote: (...args: unknown[]) => {
        calls.push({method: 'preloadRemote', args})
        return Promise.resolve('preloaded-remotes')
      },
      loadShare: (...args: unknown[]) => {
        calls.push({method: 'loadShare', args})
        return Promise.resolve('loaded-share')
      },
    }

    win[shareGlobalVal] = {runtimeLib: shareGlobalName, frameworkLib: 'EMP_ADAPTER_REACT'}
    win[shareGlobalName] = {
      MFRuntime: {
        createInstance: (options: unknown) => {
          calls.push({method: 'createInstance', args: [options]})
          return instance
        },
      },
      MFSDK: {},
    }

    const {EMPRuntime} = await import('../../dist/runtime.js')
    const runtime = new EMPRuntime()

    runtime.setup(shareGlobalName)
    runtime.init({
      name: 'browser-runtime-test',
      remotes: [{name: 'mfHost', entry: 'https://cdn.example.test/mfHost/emp.js'}],
      shared: {react: {singleton: true}},
    })

    expect(calls[0]).toMatchObject({
      method: 'createInstance',
      args: [
        expect.objectContaining({
          name: 'browser-runtime-test',
          remotes: [{name: 'mfHost', entry: 'https://cdn.example.test/mfHost/emp.js'}],
          shared: {react: {singleton: true}},
        }),
      ],
    })

    await expect(runtime.load('mfHost/App')).resolves.toEqual({
      type: 'remote-result',
      args: ['mfHost/App'],
    })
    expect(runtime.register('remote-a' as never)).toBe('registered-remotes')
    await expect(runtime.preload('remote-b' as never)).resolves.toBe('preloaded-remotes')
    await expect(runtime.loadShare('react' as never)).resolves.toBe('loaded-share')
    await expect(runtime.preloadRemote('remote-c' as never)).resolves.toBe('preloaded-remotes')

    expect(calls.map(call => call.method)).toEqual([
      'createInstance',
      'loadRemote',
      'registerRemotes',
      'preloadRemote',
      'loadShare',
      'preloadRemote',
    ])
  } finally {
    delete win[shareGlobalVal]
    delete win[shareGlobalName]
  }
})
