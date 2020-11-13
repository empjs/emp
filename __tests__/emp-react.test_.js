/* const {cli} = require('./helper')

let result = {}
beforeAll(async () => {
  result = await cli('emp dev', './projects/demo1')
  console.log('result', result)
}, 100000)

describe('@efox/emp-react', () => {
  test('data code return 0', async () => {
    expect(result.code).toBe(0)
  })
})
 */
var exec = require('child_process').exec
test('render', async done => {
  await exec('emp dev --open=false', './projects/demo1', (err, out) => {
    console.log(err, out)
    // expect(...some file to be created);
    done()
  })
})
