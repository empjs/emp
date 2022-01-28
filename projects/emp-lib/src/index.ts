import logger from './helper/logger'
import mod from '@src/mod'
import {b, logger as modLogger} from 'src/mod'
import ClientWorker from 'src/worker/index?worker'
import mfImage from 'src/assets/mf.png?inline'
// console.log('import.meta.url', import.meta.url, new URL('src/worker/index.ts', import.meta.url))
// const worker = new Worker(new URL('src/worker/index.ts', import.meta.url), {type: 'module'})
// new Worker(new URL('./relative/path/to/my/worker.js?inline'), import.meta.url)
// const worker = new Worker(new URL('src/worker.ts', import.meta.url), {
//   type: 'module',
// })
// const worker = new Worker(new URL('src/worker/index.ts?inline', import.meta.url), {type: 'module'})
const img = document.createElement('img')
img.src = mfImage
img.style.width = '200px'
document.body.appendChild(img)
const worker = new ClientWorker()
const App = () => {
  mod('this is mod')
  modLogger.info('mode logger')
  worker.postMessage({
    question: 'The Answer to the Ultimate Question of Life, The Universe, and Everything.',
  })
  const p = document.createElement('p')
  document.body.appendChild(p)
  worker.onmessage = async ({data: {answer}}: any) => {
    logger.info('[main thead]', answer)

    p.innerText = `[FROM Worker] ${answer}`
  }
}
export {mod, logger, b}
export default App
