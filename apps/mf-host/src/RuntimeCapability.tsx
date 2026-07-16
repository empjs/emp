type RuntimeCapabilityProps = {
  label?: string
}

const RuntimeCapability = ({label = 'runtime-api'}: RuntimeCapabilityProps) => (
  <section data-runtime-capability="loaded">Runtime API remote loaded: {label}</section>
)

export default RuntimeCapability
