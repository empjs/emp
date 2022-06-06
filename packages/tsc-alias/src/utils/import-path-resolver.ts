/**
 * @file
 *
 * Import statements come in a lot of flavors, so having a single
 * regex that can capture all of those with minimal side effects
 * is trickly. In this file this regex is constructed from multiple parts.
 *
 * Using a named captured group (supported in ES2018/Node 10+)
 * to allow arbitrary complexity of the regex without worrying
 * about messing up indexing.
 *
 * Meant to match ESM/CommonJS import patterns.
 *
 * ⚠ Can match content of strings and comments!
 *
 * @example
 * // Examples of import statements that must be matched
 * // (Note that there could be newlines between tokens.)
 * const module = require('some/path')
 * import module from 'some/path'
 * import "some/path"
 * import theDefault, {namedExport} from 'some/path'
 * const asyncImport = await import('some/path')
 * export * from 'some/path';
 */

/** */
import normalizePath = require('normalize-path');
import { existsSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { StringReplacer } from '../interfaces';

const anyQuote = `["']`;
const pathStringContent = `[^"'\r\n]+`;
const importString = `(?:${anyQuote}${pathStringContent}${anyQuote})`;

// Separate patterns for each style of import statement,
// wrapped in non-capturing groups,
// so that they can be strung together in one big pattern.
const funcStyle = `(?:\\b(?:import|require)\\s*\\(\\s*${importString}\\s*\\))`;
const globalStyle = `(?:\\bimport\\s+${importString})`;
const fromStyle = `(?:\\bfrom\\s+${importString})`;
const moduleStyle = `(?:\\bmodule\\s+${importString})`;

const importRegexString = `(?:${[
  funcStyle,
  globalStyle,
  fromStyle,
  moduleStyle
].join(`|`)})`;

class ImportPathResolver {
  constructor(public source: string, readonly sourcePath: string) {}

  get sourceDir() {
    return dirname(this.sourcePath);
  }

  /**
   * Replace all source import paths, using a replacer
   * function (a la `String.prototype.replace(globalRegex,replacer)`)
   */
  replaceSourceImportPaths(replacer: StringReplacer) {
    this.source = this.source.replace(
      ImportPathResolver.newImportStatementRegex('g'),
      replacer
    );
    return this;
  }

  /**
   * For a JavaScript code string, find all local import paths
   * and resolve them to full filenames (including the .js extension).
   * If no matching file is found for a path, leave it alone.
   */
  resolveFullImportPaths() {
    this.replaceSourceImportPaths((importStatement) => {
      // Find substring that is just quotes
      const importPathMatch = importStatement.match(newStringRegex());
      if (!importPathMatch) {
        return importStatement;
      }
      const { path, pathWithQuotes } = importPathMatch.groups;
      const fullPath = normalizePath(this.resolveFullPath(path));
      return importStatement.replace(
        pathWithQuotes,
        pathWithQuotes.replace(path, fullPath)
      );
    });
    return this;
  }

  /**
   * Given an import path, resolve the full path (including extension).
   * If no corresponding file can be found, return the original path.
   */
  private resolveFullPath(importPath: string) {
    if (importPath.match(/\.js$/)) {
      return importPath;
    }
    // Try adding the extension (if not obviously a directory)
    if (!importPath.match(/[/\\]$/)) {
      const asFilePath = `${importPath}.js`;
      if (existsSync(resolve(this.sourceDir, asFilePath))) {
        return asFilePath;
      }
    }
    // Assume the path is a folder; try adding index.js
    let asFilePath = join(importPath, 'index.js');
    if (importPath.startsWith('./') && !asFilePath.startsWith('./')) {
      asFilePath = './' + asFilePath;
    }
    return existsSync(resolve(this.sourceDir, asFilePath))
      ? asFilePath
      : importPath;
  }

  static newStringRegex() {
    return new RegExp(
      `(?<pathWithQuotes>${anyQuote}(?<path>${pathStringContent})${anyQuote})`
    );
  }

  static newImportStatementRegex(flags = '') {
    return new RegExp(importRegexString, flags);
  }

  static resolveFullImportPaths(code: string, path: string) {
    return new ImportPathResolver(code, path).resolveFullImportPaths().source;
  }

  static replaceSourceImportPaths(
    code: string,
    path: string,
    replacer: StringReplacer
  ) {
    return new ImportPathResolver(code, path).replaceSourceImportPaths(replacer)
      .source;
  }
}

// Export aliases for the static functions
// to make usage more friendly.
export const resolveFullImportPaths = ImportPathResolver.resolveFullImportPaths;
export const newImportStatementRegex =
  ImportPathResolver.newImportStatementRegex;
export const replaceSourceImportPaths =
  ImportPathResolver.replaceSourceImportPaths;
export const newStringRegex = ImportPathResolver.newStringRegex;
