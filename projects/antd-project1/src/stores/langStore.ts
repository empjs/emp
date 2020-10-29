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
    // a: 'abcefgh',
    $l,
    country: '',
    async getLang({project, mod, lang}: LangApi['Req']) {
      this.country = lang
      // console.log(this.a)
      this.$l = await http.get(`https://api.github.com/users`)
    },
  }
}

export type TlangStore = ReturnType<typeof langStore>
