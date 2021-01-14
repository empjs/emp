import http from 'src/helpers/http'
import {useLocalStore} from 'mobx-react-lite'
import {type} from 'os'
import {constants} from 'buffer'
export const crudStore = () => {
  const selectRow: React.ReactText[] = []
  return {
    page: 1, //*必须
    pageSize: 10, //*必须
    list: [], //*必须
    loading: false, // 可选
    count: 0, // *必须 服务器没返回可以设置一个最大值
    selectRow, // 可选 批量选择逻辑 固定名称
    /**
     * nextPage 可以自定义名称
     * @param {page = 1, pageSize = 20}
     */
    async nextPage({page = 1, pageSize = 20}) {
      this.page = page || this.page
      this.pageSize = pageSize || this.pageSize
      this.loading = true
      const {list, count}: any = await http.get(`/data.json`)
      this.loading = false
      this.list = list
      this.count = count
    },
    // 批量选择逻辑 固定名称 可选
    onSelectChange(d: React.ReactText[]) {
      console.log(d)
      this.selectRow = d
    },
    async searchAction(e: any) {
      console.log(e)
      this.nextPage({
        page: 1,
        pageSize: 10,
      })
    },
    async editAction(e: any) {
      console.log(e)
    },
    async addAction(e: any) {
      console.log(e)
    },
  }
}
export const useCrudStore = () => useLocalStore(crudStore)
export type TcrudStore = ReturnType<typeof crudStore>

export const crudComponetStore = () => {
  type actionModal = {
    item: any
    show: boolean
  }
  const addModalInfo: actionModal = {
    item: {},
    show: false,
  }
  const actionModalList: actionModal[] = []
  return {
    addModalInfo,
    actionModalList,
    setAddModalInfo(val: actionModal) {
      this.addModalInfo = val
    },
    setActionList(index: number, val: actionModal) {
      this.actionModalList[index] = val
    },
    setActionListD(index: number) {
      this.actionModalList = Array(index).fill({
        item: {},
        show: false,
      })
    },
  }
}
export const useCrudComponetStore = () => useLocalStore(crudComponetStore)
export type TcrudComponetStore = ReturnType<typeof crudComponetStore>
