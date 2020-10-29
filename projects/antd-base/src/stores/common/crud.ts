import {useLocalStore} from 'mobx-react-lite'
import {message} from 'antd'
interface CrudAction {
  create?: any
  update?: any
  del?: any
  request?: any
  extend?: any
}
export const crudStore = function (crud: CrudAction) {
  return () => {
    const selectRow: React.ReactText[] = []
    const list: any[] = []
    const SUCCESS_CODE = 1
    const pageIndex: string | number = 1 // 默认起始页码
    const pageSize: string | number = 10 // 默认条数
    const visibleRuleModal = false
    const opt: any = {}
    return {
      page: pageIndex, //*必须
      pageSize, //*必须
      list, //*必须
      loading: false, // 可选
      count: 0, // *必须 服务器没返回可以设置一个最大值
      selectRow, // 可选 批量选择逻辑 固定名称
      visibleRuleModal,
      opt,
      setOpt(val: any) {
        // 设置获取列表默认条件
        this.opt = val
      },
      async nextPage({page = pageIndex, pageSize = 10, opt = {}}) {
        this.page = page || this.page
        this.pageSize = pageSize || this.pageSize
        this.loading = true
        this.opt = opt && JSON.stringify(opt) != '{}' ? opt : this.opt
        const {code, data} = await crud.request({
          pageIndex: this.page,
          pageSize: this.pageSize,
          ...this.opt,
        })
        // if (code === SUCCESS_CODE) {
        //   this.list = data.list || []
        //   this.count = data.totalCout || 0
        // }
        this.list = data.list || []
        this.count = data.totalCout || 0
        this.loading = false
      },
      ...crud.extend,
      //重新加载数据
      async reloadQueryList() {
        await this.nextPage({page: this.page, pageSize: this.pageSize, opt: this.opt})
      },
      // 批量选择逻辑 固定名称 可选
      onSelectChange(d: React.ReactText[]) {
        this.selectRow = d
      },
      // 删除数据
      async removeItem(data: any) {
        // try {
        const {code, msg} = await crud.del(data)
        if (code === SUCCESS_CODE) {
          await this.nextPage({page: pageIndex, pageSize: this.pageSize, opt: this.opt})
          message.success('删除成功')
        } else {
          message.error(msg)
        }
        // } catch (e) {
        //   message.error(e.msg)
        // }
      },
      // 新增数据
      async addItem(data: any) {
        // try {
        const {code, msg} = await crud.create(data)
        if (code === SUCCESS_CODE) {
          await this.nextPage({page: pageIndex, pageSize: this.pageSize, opt: this.opt})
          message.success('新增成功')
        } else {
          message.error(msg)
        }
        // } catch (e) {
        //   message.error(e.msg)
        // }
      },
      // 更新数据
      async updateItem(data: any) {
        // try {
        const {code, msg} = await crud.update(data)
        if (code === SUCCESS_CODE) {
          await this.nextPage({page: pageIndex, pageSize: this.pageSize, opt: this.opt})
          message.success('修改成功')
        } else {
          message.error(msg)
        }
      },
    }
  }
}
export const useCrudStore = (action: CrudAction) => useLocalStore(crudStore(action))
