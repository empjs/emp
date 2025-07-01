const remoteContainer: any = {}
export async function loadComponent({url, scope, module}: any) {
  await createJSScript(url)
  if (!remoteContainer[scope]) {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    //
    await __webpack_init_sharing__('default')
    console.log('scope', scope, Object.keys(window[scope]))
    const container: any = window[scope] // or get the container somewhere else
    // Initialize the container, it may provide shared modules
    console.log('container __hasinit', container.__hasinit)
    if (!container.__hasinit) {
      container.__hasinit = true
      await container.init(__webpack_share_scopes__.default)
    }
    remoteContainer[scope] = {
      url,
      container,
      scope,
      module: {},
    }
    console.warn(`=== __webpack_init_sharing__ ${scope}===`)
  }
  if (!remoteContainer[scope].module[module]) {
    const factory = await remoteContainer[scope].container.get(module)
    const Module = factory()
    remoteContainer[scope].module[module] = Module
    console.warn(`=== __webpack_init_sharing__ ${scope} - ${module}===`)
  }
  return remoteContainer[scope].module[module]
}

const loadingJSStatus: any = {}
const queueLoadTasks: Array<any> = []
const getTasks = (url: string) => {
  const finds = queueLoadTasks.filter(data => data.url === url)
  return finds
}
const addTasks = (url: string, resolve: any) => {
  queueLoadTasks.push({url, resolve})
}
const createJSScript = async (url: string) => {
  url = url?.split('?')[0]
  return new Promise(resolve => {
    if (loadingJSStatus[url] && loadingJSStatus[url].status === 2) {
      // 正在加载，加入队列
      addTasks(url, resolve)
    } else if (loadingJSStatus[url] && loadingJSStatus[url].status === 0) {
      // 已经加载完毕
      resolve(loadingJSStatus[url].element) // 直接返回
    } else {
      //第一次

      loadingJSStatus[url] = {status: 2} //正在加载
      const element = document.createElement('script')
      element.src = url
      element.type = 'text/javascript'
      element.async = true

      element.onload = () => {
        console.log(`Dynamic Script Loaded: ${url}`)
        loadingJSStatus[url] = {status: 0, element} //  加载完成
        const tasks = getTasks(url) || []
        while (tasks.length > 0) {
          //返回队列里的
          const task = tasks.shift()
          task.resolve(element)
        }
        resolve(element)
      }

      element.onerror = () => {
        console.error(`Dynamic Script Error: ${url}`)
        loadingJSStatus[url] = {status: -1} //加载失败
        const tasks = getTasks(url) || []
        while (tasks.length > 0) {
          //返回队列里的
          const task = tasks.shift()
          task.resolve(null)
        }
        resolve(null)
      }

      document.head.appendChild(element)
    }
  })
}
