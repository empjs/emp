export const plugins = {
  autoprefixer(o = {}) {
    return [require.resolve('autoprefixer'), o]
  },
  pxtorem(o = {}) {
    o = {
      ...{
        rootValue: 16,
        unitPrecision: 5,
        propList: ['*'],
        selectorBlackList: [],
        replace: true,
        mediaQuery: false,
        minPixelValue: 0,
      },
      ...o,
    }
    return [require.resolve('postcss-pxtorem'), o]
  },

  pxtovw(o = {}) {
    o = {
      ...{
        unitToConvert: 'px',
        viewportWidth: 320,
        viewportHeight: 568, // not now used; TODO: need for different units and math for different properties
        unitPrecision: 5,
        viewportUnit: 'vw',
        fontViewportUnit: 'vw', // vmin is more suitable.
        selectorBlackList: [],
        propList: ['*'],
        minPixelValue: 1,
        mediaQuery: false,
        replace: true,
        landscape: false,
        landscapeUnit: 'vw',
        landscapeWidth: 568,
      },
      ...o,
    }
    return [require.resolve('./pxtovw.cjs'), o]
  },
}
