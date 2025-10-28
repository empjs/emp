import type { Input } from 'postcss';

/**
 * postcss-pxtorem 配置选项
 */
export interface PxToRemOptions {
  rootValue?: number | ((input: Input) => number);
  unitPrecision?: number;
  propList?: string[];
  selectorBlackList?: Array<string | RegExp>;
  replace?: boolean;
  mediaQuery?: boolean;
  minPixelValue?: number;
  exclude?: string | RegExp | ((file: string) => boolean);
  unit?: string;
}

export type TailwindcssOptions = {
    pxToRemOptions?: PxToRemOptions
}