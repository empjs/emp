import {downloadDts} from 'src/helper/downloadDts'

class GetDts {
  async setup() {
    downloadDts()
  }
}
export default new GetDts()
