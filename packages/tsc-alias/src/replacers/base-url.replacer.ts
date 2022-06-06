/**
 * @file
 *
 * The baseUrl replacer replaces the import statement
 * with the baseUrl + import statement location.
 */

/** */
import normalizePath = require('normalize-path');
import { dirname, relative } from 'path';
import { AliasReplacerArguments } from '../interfaces';
import { newStringRegex } from '../utils';

export default function replaceBaseUrlImport({
  orig,
  file,
  config
}: AliasReplacerArguments): string {
  const requiredModule = orig.match(newStringRegex())?.groups?.path;
  config.output.assert(
    typeof requiredModule == 'string',
    `Unexpected import statement pattern ${orig}`
  );

  // Check if import is already resolved.
  if (requiredModule.startsWith('.')) {
    return orig;
  }

  // If there are files matching the target, resolve the path.
  if (
    config.pathCache.existsResolvedAlias(`${config.outPath}/${requiredModule}`)
  ) {
    let relativePath: string = normalizePath(
      relative(
        dirname(file),
        config.pathCache.getAbsoluteAliasPath(config.outPath, '')
      )
    );
    if (!relativePath.startsWith('.')) {
      relativePath = './' + relativePath;
    }

    const index = orig.indexOf(requiredModule);
    const newImportScript =
      orig.substring(0, index) + relativePath + '/' + orig.substring(index);

    const modulePath = newImportScript.match(newStringRegex()).groups.path;
    return newImportScript.replace(modulePath, normalizePath(modulePath));
  }
  return orig;
}
