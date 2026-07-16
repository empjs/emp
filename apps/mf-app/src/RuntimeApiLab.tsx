import {EMPRuntime} from '@empjs/share/runtime'
import {type ComponentType, useMemo, useState} from 'react'

type RuntimeRemoteProps = {
  label?: string
}

const runtime = new EMPRuntime()
runtime.init({name: 'mfAppRuntimeCapability', remotes: []})

const RuntimeApiLab = () => {
  const [Remote, setRemote] = useState<ComponentType<RuntimeRemoteProps>>()
  const [diagnostic, setDiagnostic] = useState('')
  const entry = useMemo(() => `http://${location.hostname}:6001/emp.json`, [])

  const loadRemote = async () => {
    runtime.register([{name: 'mfHostRuntimeCapability', alias: 'runtimeHost', entry}])
    const remote = await runtime.load<{default: ComponentType<RuntimeRemoteProps>}>('runtimeHost/RuntimeCapability')
    if (!remote?.default) throw new Error('runtimeHost/RuntimeCapability did not return a default component')
    setRemote(() => remote.default)
  }

  const verifyDiagnostic = async () => {
    try {
      await runtime.load('runtimeHost/UnknownExpose')
      setDiagnostic('unexpected success')
    } catch (error) {
      setDiagnostic(error instanceof Error ? error.message : String(error))
    }
  }

  return (
    <section data-runtime-api-lab>
      <h2>Runtime API capability</h2>
      <button type="button" onClick={loadRemote}>
        Load runtime remote
      </button>
      <button type="button" onClick={verifyDiagnostic}>
        Verify runtime diagnostic
      </button>
      {Remote ? <Remote label="isolated-init-register-load" /> : null}
      {diagnostic ? <output>Runtime diagnostic: {diagnostic}</output> : null}
    </section>
  )
}

export default RuntimeApiLab
