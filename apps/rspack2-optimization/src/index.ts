import './style.css'

createPureValue()

async function bootstrap() {
  const feature = await import('./feature')
  const root = document.createElement('main')
  root.className = 'rspack2-optimization'
  root.textContent = feature.featureValue
  document.body.appendChild(root)
}

bootstrap()

function createPureValue() {
  return 'unused-call'
}
