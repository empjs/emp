export const externalReact = (o: any, globalVal: string) => {
  o = Object.assign(o, {
    react: `${globalVal}.React`,
    'react-dom': `${globalVal}.ReactDOM`,
    'react-dom/client': globalVal,
    'react/jsx-runtime': globalVal,
    'react/jsx-dev-runtime': globalVal,
    'react-router-dom': `${globalVal}.ReactRouterDOM`,
  })
  return o
}
