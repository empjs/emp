export type TailwindcssOptimizeOptions =
  | boolean
  | {
      minify?: boolean
    }

export type TailwindcssOptions = {
  base?: string
  optimize?: TailwindcssOptimizeOptions
}
