import {expect, test} from '@rstest/core'
import {shareGlobalName, shareGlobalVal} from '../../src/helper/config'

async function loadScript(src: string) {
  const script = document.createElement('script')
  await new Promise<void>((resolve, reject) => {
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.append(script)
  })
  return script
}

test('library bundle exposes the runtime namespace on EMP_SHARE_RUNTIME', async () => {
  const win = window as typeof window & Record<string, unknown>
  let script: HTMLScriptElement | undefined
  try {
    delete win[shareGlobalName]
    win[shareGlobalVal] = {
      frameworkLib: 'EMP_TEST_REACT',
      runtimeLib: shareGlobalName,
    }
    win.EMP_TEST_REACT = {
      React: {
        version: '18.2.0',
        Component: class Component {
          props: unknown
          constructor(props: unknown) {
            this.props = props
          }
        },
        createElement: () => ({}),
        createRef: () => ({current: null}),
      },
      ReactDOM: {
        version: '18.2.0',
        render: () => undefined,
        hydrate: () => undefined,
        unmountComponentAtNode: () => undefined,
      },
      createRoot: () => ({render: () => undefined, unmount: () => undefined}),
      scope: 'default',
    }

    script = await loadScript('/container-static/emp-share/sdk.js')

    const runtime = win[shareGlobalName] as
      | {
          MFRuntime?: Record<string, unknown>
          MFSDK?: Record<string, unknown>
          reactAdapter?: Record<string, unknown>
          runtime?: Record<string, unknown>
        }
      | undefined

    expect(runtime).toBeTruthy()
    expect(runtime).toMatchObject({
      MFRuntime: expect.any(Object),
      MFSDK: expect.any(Object),
      reactAdapter: expect.any(Object),
      runtime: expect.any(Object),
    })
    expect(runtime?.MFRuntime).toEqual(
      expect.objectContaining({
        createInstance: expect.any(Function),
        loadRemote: expect.any(Function),
        registerRemotes: expect.any(Function),
        preloadRemote: expect.any(Function),
        loadShare: expect.any(Function),
      }),
    )
    expect(runtime?.MFSDK).toEqual(
      expect.objectContaining({
        createLink: expect.any(Function),
        loadScript: expect.any(Function),
        loadScriptNode: expect.any(Function),
        createScript: expect.any(Function),
        createScriptNode: expect.any(Function),
      }),
    )
    expect(runtime?.reactAdapter?.adapter).toEqual(expect.any(Function))
    expect(runtime?.reactAdapter?.shared).toMatchObject({
      react: {
        version: '18.2.0',
        scope: 'default',
        shareConfig: {
          singleton: true,
          requiredVersion: '^18.2.0',
        },
      },
      'react-dom': {
        version: '18.2.0',
        scope: 'default',
        shareConfig: {
          singleton: true,
          requiredVersion: '^18.2.0',
        },
      },
    })
    expect(runtime?.runtime).toEqual(
      expect.objectContaining({
        init: expect.any(Function),
        load: expect.any(Function),
        register: expect.any(Function),
      }),
    )
  } finally {
    script?.remove()
    delete win[shareGlobalName]
    delete win[shareGlobalVal]
    delete win.EMP_TEST_REACT
  }
})
