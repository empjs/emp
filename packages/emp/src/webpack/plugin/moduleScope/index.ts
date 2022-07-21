import path from 'path'
import os from 'os'

import chalk from 'chalk'

export default class ModuleScopePlugin {
  private readonly appSources: string[]

  private readonly allowedFiles: Set<string>

  constructor(appSrc: string, allowedFiles: string[] = []) {
    this.appSources = Array.isArray(appSrc) ? appSrc : [appSrc]
    this.allowedFiles = new Set(allowedFiles)
  }

  apply(compiler: any): void {
    const {appSources} = this
    compiler.hooks.file.tapAsync('ModuleScopePlugin', (request: any, contextResolver: any, callback: any) => {
      // Unknown issuer, probably webpack internals
      if (!request.context.issuer) {
        return callback()
      }
      if (
        // If this resolves to a node_module, we don't care what happens next
        request.descriptionFileRoot.indexOf('/node_modules/') !== -1 ||
        request.descriptionFileRoot.indexOf('\\node_modules\\') !== -1 ||
        // Make sure this request was manual
        !request.__innerRequest_request
      ) {
        return callback()
      }
      /*
       * Resolve the issuer from our appSrc and make sure it's one of our files
       * Maybe an indexOf === 0 would be better?
       */
      if (
        appSources.every(appSrc => {
          const relative = path.relative(appSrc, request.context.issuer)
          // If it's not in one of our app src or a subdirectory, not our request!
          return relative.startsWith('../') || relative.startsWith('..\\')
        })
      ) {
        return callback()
      }
      const requestFullPath = path.resolve(path.dirname(request.context.issuer), request.__innerRequest_request)
      if (this.allowedFiles.has(requestFullPath)) {
        return callback()
      }
      /*
       * Find path from src to the requested file
       * Error if in a parent directory of all given appSources
       */
      if (
        appSources.every(appSrc => {
          const requestRelative = path.relative(appSrc, requestFullPath)
          return requestRelative.startsWith('../') || requestRelative.startsWith('..\\')
        })
      ) {
        const scopeError = new Error(
          `${
            `You attempted to import ${chalk.cyan(
              request.__innerRequest_request,
            )} which falls outside of the project ${chalk.cyan('src/')} directory. ` +
            `Relative imports outside of ${chalk.cyan('src/')} are not supported.`
          }${os.EOL}You can either move it inside ${chalk.cyan(
            'src/',
          )}, or add a symlink to it from project's ${chalk.cyan('node_modules/')}.`,
        )
        Object.defineProperty(scopeError, '__module_scope_plugin', {
          value: true,
          writable: false,
          enumerable: false,
        })
        console.log(request.context.issuer, request.relativePath)
        return callback(scopeError, request)
      }

      return callback()
    })
  }
}
