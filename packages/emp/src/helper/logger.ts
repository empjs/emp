import {Logger} from 'tslog'

const logger = new Logger({
  name: 'EMP',
  minLevel: 'debug',
  displayDateTime: false,
  displayFunctionName: false,
})

export default logger
