const worker = new Worker(new URL('src/worker.ts', import.meta.url))
worker.postMessage({
  question: 'The Answer to the Ultimate Question of Life, The Universe, and Everything.',
})
worker.onmessage = ({data: {answer}}) => {
  console.log('[main thead]', answer)
}
