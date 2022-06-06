import { PathCache, TrieNode } from './utils';

export interface IRawTSConfig {
  extends?: string;
  compilerOptions?: ITSConfig;
  'tsc-alias'?: {
    replacers?: ReplacerOptions;
    resolveFullPaths?: boolean;
    verbose?: boolean;
  };
}

export type PathLike = {
  [key: string]: string[];
};

export type StringReplacer = (importStatement: string) => string;

export interface ITSConfig {
  baseUrl?: string;
  outDir?: string;
  declarationDir?: string;
  paths?: PathLike;
  replacers?: ReplacerOptions;
  resolveFullPaths?: boolean;
  verbose?: boolean;
}

export interface IProjectConfig {
  configFile: string;
  baseUrl: string;
  outDir: string;
  configDir: string;
  outPath: string;
  confDirParentFolderName: string;
  hasExtraModule: boolean;
  configDirInOutPath: string;
  relConfDirPathInOutPath: string;
  pathCache: PathCache;
}

export interface IConfig extends IProjectConfig {
  output: IOutput;
  aliasTrie: TrieNode<Alias>;
  replacers: AliasReplacer[];
}

export interface ReplaceTscAliasPathsOptions {
  configFile?: string;
  outDir?: string;
  declarationDir?: string;
  watch?: boolean;
  verbose?: boolean;
  resolveFullPaths?: boolean;
  replacers?: string[];
  output?: IOutput;
  aliasTrie?: TrieNode<Alias>;
}

export interface Alias {
  shouldPrefixMatchWildly: boolean;
  prefix: string;
  paths: AliasPath[];
}

export interface AliasPath {
  basePath: string;
  path: string;
  isExtra: boolean;
}

export interface AliasReplacerArguments {
  orig: string;
  file: string;
  config: IConfig;
}

export type AliasReplacer = (args: AliasReplacerArguments) => string;

export interface ReplacerOptions {
  [key: string]: {
    enabled: boolean;
    file?: string;
  };
}

export interface IOutput {
  /**
   * verbose value sets if the output should act verbose.
   */
  verbose: boolean;
  /**
   * info logs a message on the info level.
   * @param {string} message message to log.
   */
  info(message: string): void;
  /**
   * error logs a message on the error level and may exit the process.
   * @param {string} message message to log.
   * @param {boolean} exitProcess if process should exit after this error.
   */
  error(message: string, exitProcess?: boolean): void;
  /**
   * clear clears the displayed logs.
   */
  clear(): void;
  /**
   * assert claim an assertion when it fails an error is logged
   * and the process exited.
   * @param {unknown} claim assertion that is being claimed.
   * @param {string} message message to log when claim fails.
   */
  assert(claim: unknown, message: string): void;
}
