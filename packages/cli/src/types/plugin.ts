import type {GlobalStore} from 'src/store'
export type EMP3PluginType = {
  name: string
  rsConfig: (store: GlobalStore) => Promise<void>
}
export type EMP3PluginFnType = (o: any) => EMP3PluginType
