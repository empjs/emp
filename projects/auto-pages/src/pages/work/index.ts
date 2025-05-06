console.log('work page!ldkfj', process.env.mode)

if (process.env.mode === 'development') {
  if (module.hot) {
    module.hot.accept()
  }
}
