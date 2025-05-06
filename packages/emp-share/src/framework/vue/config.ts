export const externalVue = (o: any, globalVal: string) => {
  o = Object.assign(o, {
    vue: `${globalVal}.Vue`,
    'vue-router': `${globalVal}.VueRouter`,
  })
  return o
}
