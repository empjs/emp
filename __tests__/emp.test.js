const {cli} = require('./helper')

describe('@efox/emp-cli', () => {
  test('emp-cli command return 0', async () => {
    let result = await cli('emp -h', './packages/emp-cli')
    // console.log('result', result)
    expect(result.code).toBe(0)
  })
})
