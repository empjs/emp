import loadScript from './loadScript'
export async function yyLogin(url?: string) {
  await loadScript('https://res.yy.com/libs/jquery/3.1.0/jquery.min.js')
  await loadScript('https://res.udb.duowan.com/js/oauth/udbsdk/proxy/udbsdkproxy.min.js')
  const {UDBSDKProxy}: any = window
  UDBSDKProxy?.openByFixProxy(url)
}
