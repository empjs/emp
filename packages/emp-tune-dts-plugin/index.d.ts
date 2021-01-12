interface Options {
  output: string
  path: string
  name: string
  isDefault: boolean
}

export declare const tuneType: (
  createPath: string,
  createName: string,
  isDefault: string,
  operation: (newFileData: string) => void,
) => void

export declare const generateType: (_options: Options) => void

export declare class TuneDtsPlugin {
  options: Options
  constructor(options: Options)
}
