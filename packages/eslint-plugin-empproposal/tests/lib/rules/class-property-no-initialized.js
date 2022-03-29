const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/class-property-no-initialized');

new RuleTester({
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'module'
  }
}).run('doerme', rule, {
  valid: [
    `class A {
      foo = 'Alice'
    }`,
    `class A {
      foo = () => {}
    }`,
    `class A {
      static foo = 'Alice'
    }`,
    `class A {
      static foo = () => {}
    }`,
    `class A {
      foo = undefined
    }`,
    `class A {
      foo = null
    }`,
    `class A {
      static foo = undefined
    }`,
    `class A {
        static foo = null
    }`,
    `class A {
        static foo = null
        name = null
        testname = undefined
    }`,
  ],
  invalid: [
    {
      code: `
        class A {
          foo
        }
      `,
      errors: [{
        message: 'emplint: \'foo\' has no initializer and is not definitely assigned in the constructor。'
      }]
    },
    {
      code: `
        class A {
          static foo
        }
      `,
      errors: [{
        message: 'emplint: \'foo\' has no initializer and is not definitely assigned in the constructor。'
      }]
    },
    {
      code: `
        class A {
            age = 13
            gender = '男'
            foo
            name
            testname
            constructor() {
                this.foo = null
                this.name = 'hello'
            }
        }
        `,
      errors: [{
        message: 'emplint: \'testname\' has no initializer and is not definitely assigned in the constructor。'
      }]
    }
  ]
});
