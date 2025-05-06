const win: any = window
win.__VUE_PROD_DEVTOOLS__ = process.env.NODE_ENV !== 'production'
win.__VUE_HMR_RUNTIME__ = win.__VUE_HMR_RUNTIME__
  ? win.__VUE_HMR_RUNTIME__
  : {
      createRecord: function () {},
      reload: function () {},
    }
