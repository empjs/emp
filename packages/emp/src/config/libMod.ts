import {buildLibType} from 'src/types'
import {Configuration} from 'webpack'

//
class LibMod {
  entry: string[] = []
  formats: buildLibType[] = []
  name = ''
  externals?: Configuration['externals']
  // 集成 build.outDir
  private outDir = 'dist'
  filename: any = (format: string) => `${format}/[name]`
  constructor() {}
}

export default LibMod
