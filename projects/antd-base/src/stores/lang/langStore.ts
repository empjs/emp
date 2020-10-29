import http from 'src/helpers/http'
//
export interface LangApi {
  Req: {
    project: string
    mod: string
    lang: string
  }
  Res: JSONObject //动态格式
}
//
export const langStore = () => {
  const $l: LangApi['Res'] = {}

  return {
    $l,
    country: '',
    async getLang({project, mod, lang}: LangApi['Req']) {
      this.country = lang
      this.$l = await http.get(`https://multi-lang-api.yy.com/multiLangBig/${project}/${mod}/${lang}.json`)
    },
  }
}

export type TlangStore = ReturnType<typeof langStore>
