export const vCompare = (preVersion = '', lastVersion = ''): number => {
  const sources = preVersion.replace('^', '').split('.')
  const dests = lastVersion.replace('^', '').split('.')
  const maxL = Math.max(sources.length, dests.length)
  let result = 0
  for (let i = 0; i < maxL; i++) {
    const preValue: any = sources.length > i ? sources[i] : 0
    const preNum = isNaN(Number(preValue)) ? preValue.charCodeAt() : Number(preValue)
    const lastValue: any = dests.length > i ? dests[i] : 0
    const lastNum = isNaN(Number(lastValue)) ? lastValue.charCodeAt() : Number(lastValue)
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
export function clearConsole() {
  process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H')
}
