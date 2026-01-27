import {shareGlobalName} from 'src/helper/config'
import {MFRuntime, MFSDK} from 'src/helper/moduleFederation'

export {MFRuntime, MFSDK}

window[shareGlobalName] = {
  MFRuntime,
  MFSDK,
}
