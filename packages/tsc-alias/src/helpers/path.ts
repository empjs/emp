/**
 * @file
 *
 * This file has all helperfunctions related to path resolution.
 */

/** */
import normalizePath = require('normalize-path');
import { sync } from 'globby';
import { normalize, relative } from 'path';
import { AliasPath, IProjectConfig } from '../interfaces';

/**
 * getProjectDirPathInOutDir finds the configDirInOutPath.
 * @param {string} outDir outDir loaded from tsconfig.
 * @param {string} projectDir  projectDir loaded from tsconfig.
 * @returns {string} the configDirInOutPath.
 */
function getProjectDirPathInOutDir(
  outDir: string,
  projectDir: string
): string | undefined {
  const posixOutput = outDir.replace(/\\/g, '/');
  const dirs = sync(
    [
      `${posixOutput}/**/${projectDir}`,
      `!${posixOutput}/**/${projectDir}/**/${projectDir}`,
      `!${posixOutput}/**/node_modules`
    ],
    {
      dot: true,
      onlyDirectories: true
    }
  );

  // Find the longest path
  return dirs.reduce(
    (prev, curr) =>
      prev.split('/').length > curr.split('/').length ? prev : curr,
    dirs[0]
  );
}

/**
 * relativeOutPathToConfigDir
 * Finds relative path access of configDir in outPath
 */
export function relativeOutPathToConfigDir(config: IProjectConfig) {
  config.configDirInOutPath = getProjectDirPathInOutDir(
    config.outPath,
    config.confDirParentFolderName
  );

  // Find relative path access of configDir in outPath
  if (config.configDirInOutPath) {
    config.hasExtraModule = true;
    const stepsbackPath = relative(config.configDirInOutPath, config.outPath);
    const splitStepBackPath = normalizePath(stepsbackPath).split('/');
    const nbOfStepBack = splitStepBackPath.length;
    const splitConfDirInOutPath = config.configDirInOutPath.split('/');

    let i = 1;
    const splitRelPath: string[] = [];
    while (i <= nbOfStepBack) {
      splitRelPath.unshift(
        splitConfDirInOutPath[splitConfDirInOutPath.length - i]
      );
      i++;
    }
    config.relConfDirPathInOutPath = splitRelPath.join('/');
  }
}

/**
 * findBasePathOfAlias finds a basepath for every AliasPath.
 * And checks if isExtra should be true or false.
 * @param {IProjectConfig} config config object with all config values.
 */
export function findBasePathOfAlias(config: IProjectConfig) {
  return (path: string) => {
    const aliasPath = { path } as AliasPath;
    if (normalize(aliasPath.path).includes('..')) {
      const tempBasePath = normalizePath(
        normalize(
          `${config.outDir}/` +
            `${
              config.hasExtraModule && config.relConfDirPathInOutPath
                ? config.relConfDirPathInOutPath
                : ''
            }/${config.baseUrl}`
        )
      );

      const absoluteBasePath = normalizePath(
        normalize(`${tempBasePath}/${aliasPath.path}`)
      );

      if (config.pathCache.existsResolvedAlias(absoluteBasePath)) {
        aliasPath.isExtra = false;
        aliasPath.basePath = tempBasePath;
      } else {
        aliasPath.isExtra = true;
        aliasPath.basePath = absoluteBasePath;
      }
    } else if (config.hasExtraModule) {
      aliasPath.isExtra = false;
      aliasPath.basePath = normalizePath(
        normalize(
          `${config.outDir}/` +
            `${config.relConfDirPathInOutPath}/${config.baseUrl}`
        )
      );
    } else {
      aliasPath.basePath = config.outDir;
      aliasPath.isExtra = false;
    }

    return aliasPath;
  };
}
