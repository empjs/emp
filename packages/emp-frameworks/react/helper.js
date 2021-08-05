exports.versionStringCompare = (preVersion = '', lastVersion = '') => {
  var sources = preVersion.replace('^', '').split('.')
  var dests = lastVersion.replace('^', '').split('.')
  // console.log(sources, dests)
  var maxL = Math.max(sources.length, dests.length)
  var result = 0
  for (let i = 0; i < maxL; i++) {
    let preValue = sources.length > i ? sources[i] : 0
    let preNum = isNaN(Number(preValue)) ? preValue.charCodeAt() : Number(preValue)
    let lastValue = dests.length > i ? dests[i] : 0
    let lastNum = isNaN(Number(lastValue)) ? lastValue.charCodeAt() : Number(lastValue)
    if (preNum < lastNum) {
      result = -1
      break
    } else if (preNum > lastNum) {
      result = 1
      break
    }
  }
  return result
}
