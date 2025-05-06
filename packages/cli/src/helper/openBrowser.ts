import {exec} from 'node:child_process'
import {promisify} from 'node:util'
import store from 'src/store'
import logger from './logger'

const execAsync = promisify(exec)

const supportedChromiumBrowsers = [
  'Google Chrome Canary',
  'Google Chrome Dev',
  'Google Chrome Beta',
  'Google Chrome',
  'Microsoft Edge',
  'Brave Browser',
  'Vivaldi',
  'Chromium',
]

const getTargetBrowser = async () => {
  // Use user setting first
  let targetBrowser = process.env.BROWSER
  // If user setting not found or not support, use opening browser first
  if (!targetBrowser || !supportedChromiumBrowsers.includes(targetBrowser)) {
    const {stdout: ps} = await execAsync('ps cax')
    targetBrowser = supportedChromiumBrowsers.find(b => ps.includes(b))
  }
  return targetBrowser
}

export const openBrowser = async (url: string) => {
  const shouldTryOpenChromeWithAppleScript = process.platform === 'darwin'

  if (shouldTryOpenChromeWithAppleScript) {
    try {
      const targetBrowser = await getTargetBrowser()
      if (targetBrowser) {
        // Try to reuse existing tab with AppleScript
        const c = `osascript openChrome.applescript "${encodeURI(url)}" "${targetBrowser}"`
        await execAsync(c, {
          cwd: store.resource.dir,
        })

        return true
      }
    } catch (err) {
      logger.debug(err)
    }
  }
  //
  // Fallback to open
  // (It will always open new tab)
  try {
    const {default: open} = await import('open')
    await open(url)
    return true
  } catch (err) {
    logger.error('Failed to open start URL.')
    logger.error(err)
    return false
  }
}
export default openBrowser
