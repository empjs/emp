import {readdir, readFile, writeFile} from 'node:fs/promises'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

// CDN 可能将 npm 包版本 URL 中的 @ 当成邮箱，改写 DOM 会破坏 React hydration。
// https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/
async function protectHtml(directory) {
  let count = 0
  for (const entry of await readdir(directory, {withFileTypes: true})) {
    const file = resolve(directory, entry.name)
    if (entry.isDirectory()) {
      count += await protectHtml(file)
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      const html = await readFile(file, 'utf8')
      if (html.includes('<!--email_off-->')) continue
      if (!/<body\b[^>]*>/i.test(html) || !/<\/body>/i.test(html)) {
        throw new Error(`HTML 缺少 body，无法保护文档内容：${file}`)
      }
      const protectedHtml = html
        .replace(/<body\b[^>]*>/i, body => `${body}<!--email_off-->`)
        .replace(/<\/body>/i, '<!--/email_off--></body>')
      await writeFile(file, protectedHtml)
      count++
    }
  }
  return count
}

const output = resolve(dirname(fileURLToPath(import.meta.url)), '../doc_build')
console.log(`已保护 ${await protectHtml(output)} 个 HTML 页面的原始内容。`)
