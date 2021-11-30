self.onmessage = ({data: {question}}) => {
  console.log('[worker]', question)
  self.postMessage({
    answer: 42,
  })
}
Node
