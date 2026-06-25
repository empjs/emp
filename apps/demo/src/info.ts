console.log('info page')
const div = document.createElement('div')
const txt = () => `this is info page [${Date.now()}]`
div.innerHTML = txt()
document.body.appendChild(div)
setInterval(() => (div.innerHTML = txt()), 500)
