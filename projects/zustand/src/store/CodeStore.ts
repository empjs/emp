import create from 'zustand'
import axios from 'axios'
import {devtools} from 'zustand/middleware'
interface CodeStoreType {
  code: string
  fetchRemote: () => void
  cleanCode: () => void
}
const useCodeStore = create<CodeStoreType>()(
  devtools(set => ({
    code: '',
    cleanCode() {
      set({code: ''})
    },
    async fetchRemote() {
      const {data} = await axios.get(
        'https://unpkg.bdgamelive.com/webupload/gfe/mobx-react-lite@3.2.2/umd/mobxreactlite.umd.production.min.js',
      )
      set({code: data})
    },
  })),
)

export default useCodeStore
