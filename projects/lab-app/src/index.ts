import('./bootstrap')

import {MFApi} from '@astro/yyapi'
import {empRuntime} from '@astro-ui/emp'

empRuntime.init({})
MFApi.impl.init()
