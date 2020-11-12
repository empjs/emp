const {cli} = require('../../../__tests__/helper')

let result = {}
beforeAll(async () => {
  result = await cli('emp -h', './packages/emp-cli')
  // console.log('result', result)
})

describe('@efox/emp-cli', () => {
  test('data code return 0', async () => {
    expect(result.code).toBe(0)
  })
  test('print return @efox/emp-cli', async () => {
    expect(result.stdout).toEqual(expect.stringMatching(/@efox\/\emp-cli/))
  })
})
