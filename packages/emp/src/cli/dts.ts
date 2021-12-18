import {downloadDts} from 'src/helper/downloadDts'

class Dts {
  async setup() {
    downloadDts()
  }
}
export default new Dts()
