import('./bootstrap')

class TestTSclassName {
  constructor() {
    console.log('TestTSclassName')
  }
}
console.log('TestTSclassName.name', TestTSclassName.name, TestTSclassName.constructor.name)
