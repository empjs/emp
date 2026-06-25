const win: any = window
const {runtime, reactAdapter} = win['EMP_SHARE_RUNTIME']
const entry = process.env.mfhost as string
// 实例化远程 emp
runtime.init({
  shared: reactAdapter.shared,
  remotes: [
    {
      name: 'mfHost',
      entry,
    },
  ],
  name: 'emp_window_demo',
})
export default runtime
