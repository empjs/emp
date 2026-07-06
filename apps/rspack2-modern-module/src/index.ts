export const createModernModuleMessage = () => 'rspack2 modern module ready'

export const unusedModernModuleValue = createModernModuleMessage()

const root = document.createElement('main')
root.className = 'rspack2-modern-module'
root.textContent = unusedModernModuleValue
document.body.appendChild(root)
