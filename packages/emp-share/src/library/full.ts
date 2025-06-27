import 'core-js/stable/global-this'
import 'core-js/stable/object/entries'
import {reactAdapter} from 'src/adapter'
import {shareGlobalName} from 'src/helper/config'
import {MFRuntime, MFSDK} from 'src/helper/moduleFederation'
import {EMPRuntime} from 'src/runtime'

const runtime = new EMPRuntime({MFRuntime: MFRuntime as any, MFSDK})
export {MFRuntime, MFSDK, reactAdapter, runtime}

window[shareGlobalName] = {
  MFRuntime,
  MFSDK,
  reactAdapter,
  // vueAdapter,
  runtime,
}
