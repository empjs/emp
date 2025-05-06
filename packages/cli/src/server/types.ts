export interface DevServerType {
  beforeCompiler: (rspackConfig: any) => Promise<void>
}
