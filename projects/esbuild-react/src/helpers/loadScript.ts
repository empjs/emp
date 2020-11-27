import loadjs from 'loadjs'
const loadScript = (url: string | string[]) => new Promise((resolve: any) => loadjs(url, resolve))
export default loadScript
