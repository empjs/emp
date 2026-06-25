console.log('work page!', process.env.mode)

if (process.env.mode === 'development') {
  if (module.hot) {
    module.hot.accept()
  }
}
