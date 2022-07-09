export const filterPropList = {
  exact: function (list: any[]) {
    return list.filter(function (m: string) {
      return m.match(/^[^\*\!]+$/)
    })
  },
  contain: function (list: any[]) {
    return list
      .filter(function (m: string) {
        return m.match(/^\*.+\*$/)
      })
      .map(function (m: string) {
        return m.substr(1, m.length - 2)
      })
  },
  endWith: function (list: any[]) {
    return list
      .filter(function (m: string) {
        return m.match(/^\*[^\*]+$/)
      })
      .map(function (m: string) {
        return m.substr(1)
      })
  },
  startWith: function (list: any[]) {
    return list
      .filter(function (m: string) {
        return m.match(/^[^\*\!]+\*$/)
      })
      .map(function (m: string) {
        return m.substr(0, m.length - 1)
      })
  },
  notExact: function (list: any[]) {
    return list
      .filter(function (m: string) {
        return m.match(/^\![^\*].*$/)
      })
      .map(function (m: string) {
        return m.substr(1)
      })
  },
  notContain: function (list: any[]) {
    return list
      .filter(function (m: string) {
        return m.match(/^\!\*.+\*$/)
      })
      .map(function (m: string) {
        return m.substr(2, m.length - 3)
      })
  },
  notEndWith: function (list: any[]) {
    return list
      .filter(function (m: string) {
        return m.match(/^\!\*[^\*]+$/)
      })
      .map(function (m: string) {
        return m.substr(2)
      })
  },
  notStartWith: function (list: any[]) {
    return list
      .filter(function (m: string) {
        return m.match(/^\![^\*]+\*$/)
      })
      .map(function (m: string) {
        return m.substr(1, m.length - 2)
      })
  },
}

export function createPropListMatcher(propList: any) {
  const hasWild = propList.indexOf('*') > -1
  const matchAll = hasWild && propList.length === 1
  const lists = {
    exact: filterPropList.exact(propList),
    contain: filterPropList.contain(propList),
    startWith: filterPropList.startWith(propList),
    endWith: filterPropList.endWith(propList),
    notExact: filterPropList.notExact(propList),
    notContain: filterPropList.notContain(propList),
    notStartWith: filterPropList.notStartWith(propList),
    notEndWith: filterPropList.notEndWith(propList),
  }
  return function (prop: any) {
    if (matchAll) return true
    return (
      (hasWild ||
        lists.exact.indexOf(prop) > -1 ||
        lists.contain.some(function (m: any) {
          return prop.indexOf(m) > -1
        }) ||
        lists.startWith.some(function (m: any) {
          return prop.indexOf(m) === 0
        }) ||
        lists.endWith.some(function (m: any) {
          return prop.indexOf(m) === prop.length - m.length
        })) &&
      !(
        lists.notExact.indexOf(prop) > -1 ||
        lists.notContain.some(function (m: any) {
          return prop.indexOf(m) > -1
        }) ||
        lists.notStartWith.some(function (m: any) {
          return prop.indexOf(m) === 0
        }) ||
        lists.notEndWith.some(function (m: string | any[]) {
          return prop.indexOf(m) === prop.length - m.length
        })
      )
    )
  }
}
