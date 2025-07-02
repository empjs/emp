import {chunk, isEqual, sum} from 'es-toolkit'

const data: any = {}
data.chunk = chunk([1, 2, 3, 4, 5, 6], 3)
data.sum = sum([1, 2, 3, 4, 5, 6, 6, 7, 7, 3])
data.isEqual = isEqual(1, '1')
document.body.innerHTML = JSON.stringify(data)
