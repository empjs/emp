import {Options} from 'html-webpack-plugin'
import store from 'src/helper/store'
import fs from 'fs'
import {Override} from 'src/types'
export type HtmlTagsType = {
  headTags: any[]
  bodyTags: any[]
}
export interface HtmlOptions extends Options {
  /**
   * 基于项目的根目录 index.html url
   * @default src/index.html
   */
  template?: string
  /**
   * 当前文件路径名 基于 src 如 `pc/index` `index-pc` 不填为匹配路径
   * @default [folder]/[filename]
   */
  chunk?: string
  /**
   * 基于项目的根目录 favicon url
   * @default src/favicon.ico
   */
  favicon?: string | false
  /**
   * externals 文件插入到html
   */
  files?: {
    /**
     * 插入 css
     */
    css?: string[]
    /**
     * 插入 js
     */
    js?: string[]
  }
  /**
   * 自定义 头部脚步内容 headTags[] bodyTags[]
   */
  tags?: HtmlTagsType
  /**
   * 网站语言
   */
  lang?: string
}
export type InitHtmlType = Override<
  Options,
  {
    files: {
      css: string[]
      js: string[]
    }
  }
>
export const initHtml = (o: Options = {}): InitHtmlType => {
  let template = o.template || 'src/index.html'
  let favicon = o.favicon || 'src/favicon.ico'
  if (store) {
    template = store.resolve(template)
    if (!fs.existsSync(template)) {
      template = store.empResolve('template/index.html')
    }
    favicon = store.resolve(favicon)
    if (!fs.existsSync(favicon)) {
      favicon = store.empResolve('template/favicon.ico')
    }
  }
  return {lang: 'zh-CN', title: 'EMP', files: {css: [], js: []}, ...o, template, favicon}
}
