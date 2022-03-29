const requireIndex = require('requireindex')

module.exports = {
  rules: requireIndex(`${__dirname}/lib/rules`),
  configs: {
    recommended: {
      parser: 'babel-eslint',
      parserOptions: {
        ecmaVersion: 9,
        sourceType: 'module',
      },
      plugins: ['empproposal'],
      rules: {},
    },
  },
}
