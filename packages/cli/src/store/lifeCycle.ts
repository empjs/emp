export type LifeCycleOptions = Partial<LifeCycle>
export class LifeCycle {
  op: LifeCycleOptions = {}
  constructor(op: LifeCycleOptions = {}) {
    this.op = op
  }
  /**
   * 获取 empOptions 之后、初始化 empConfig 之前
   */
  async afterGetEmpOptions() {
    if (this.op.afterGetEmpOptions) await this.op.afterGetEmpOptions()
  }
  /**
   * RspackPlugin 插件执行之前
   */
  async beforePlugin() {
    if (this.op.beforePlugin) await this.op.beforePlugin()
  }
  /**
   * RspackPlugin 插件执行之后
   */
  async afterPlugin() {
    if (this.op.afterPlugin) await this.op.afterPlugin()
  }
  /**
   * RspackModule 插件执行之后
   */
  async beforeModule() {
    if (this.op.beforeModule) await this.op.beforeModule()
  }
  /**
   * RspackModule 插件执行之后
   */
  async afterModule() {
    if (this.op.afterModule) await this.op.afterModule()
  }
  /**
   * empPlugin 插件执行之前
   */
  async beforeEmpPlugin() {
    if (this.op.beforeEmpPlugin) await this.op.beforeEmpPlugin()
  }
  /**
   * empPlugin 插件执行之后
   */
  async afterEmpPlugin() {
    if (this.op.afterEmpPlugin) await this.op.afterEmpPlugin()
  }
  /**
   * 产物构建完成前
   */
  async beforeBuild() {
    if (this.op.beforeBuild) await this.op.beforeBuild()
  }
  /**
   * 产物构建完成后
   */
  async afterBulid() {
    if (this.op.afterBulid) await this.op.afterBulid()
  }
  /**
   * devServer启动前
   */
  async beforeDevServe() {
    if (this.op.beforeDevServe) await this.op.beforeDevServe()
  }
  /**
   * devServer启动后
   */
  async afterDevServe() {
    if (this.op.afterDevServe) await this.op.afterDevServe()
  }
  /**
   * server启动前
   */
  async beforeServe() {
    if (this.op.beforeServe) await this.op.beforeServe()
  }
  /**
   * server启动后
   */
  async afterServe() {
    if (this.op.afterServe) await this.op.afterServe()
  }
}
