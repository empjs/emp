class Testsss {
  static a
  c = 2
  static get impl() {
    if (!Testsss.a) {
      Testsss.a = new Testsss()
    }
    return Testsss.a
  }
}

class Testsss2 extends Testsss {
  constructor() {
    super()
  }
  static a
  c = 3
  static get impl() {
    if (!Testsss2.a) {
      Testsss2.a = new Testsss2()
    }
    return Testsss2.a
  }
}
console.info('Testsss', Testsss.impl.c, 2)
console.info('Testsss2', Testsss2.impl.c, 3)

// class ParantClass {
//   protected static a = 1
//   b = 2
// }
// class ChildClass extends ParantClass {
//   protected static a = 2
// }
// const c = new ChildClass()
// console.log(Date.now(), c.a, ParantClass.a, ChildClass.a)

// class Testsss {
//   protected a = 2
// }

// class Testsss2 extends Testsss {
//   protected a
//   getA() {
//     return this.a
//   }
// }

// const tttt = new Testsss2()
// console.info('tttt.getA()', tttt.getA())

const App = () => <div>demo</div>
export default App
