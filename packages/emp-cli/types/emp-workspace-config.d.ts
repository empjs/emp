interface IWorkSpaceConfig {
  /** @pullConfig获取远程声明文件配置 远程声明文件地址， 会自动同步到当前项目 types 目录 */
  pullConfig: Record<string, string>
  /** @pushConfig分发本地声明文件配置
   * 生成声明文件后@localPath，
   * 会自动分发到远程目录@remotePath */
  pushConfig: {
    localPath: Record<string, string>
    remotePath: Array<string>
  }
}
