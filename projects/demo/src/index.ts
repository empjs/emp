const a = async () => {
  console.log('async function')
}
;(async () => {
  await a()
})()
