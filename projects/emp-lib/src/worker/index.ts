import logger from 'src/helper/logger'
self.onmessage = async ({data: {question}}) => {
  logger.info('[worker]', question)
  // const mod = await import('src/mod')
  // mod.default('abc')
  function emitMsg() {
    self.postMessage({
      answer: Math.random(),
    })
  }
  emitMsg()
  setInterval(() => emitMsg(), 2000)
}
