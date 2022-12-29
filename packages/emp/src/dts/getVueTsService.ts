import {createProgram} from 'vue-tsc'
import ts from 'typescript'
import {getFileNames} from './getTSConfig'

const cache: {
  languageService?: ts.LanguageService
  cwd: string
} = {cwd: ''}

function getVueTsService(options: ts.CompilerOptions, cwd: string) {
  if (cache.languageService && cache.cwd === cwd) {
    return cache.languageService
  }
  cache.cwd = cwd

  const rootFileNames = getFileNames(cwd).filter(fileName => fileName.endsWith('.vue'))

  const host = ts.createCompilerHost(options, undefined)

  const program = createProgram({
    rootNames: rootFileNames,
    options,
    host,
  })

  const service = program.__vue.languageService.__internal__.languageService
  cache.languageService = service

  return service
}

export {getVueTsService}
