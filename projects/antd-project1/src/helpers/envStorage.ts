import config from 'src/configs'
const prefix = config.env
const {localStorage}: any = window
export default {
  get(name: string) {
    name = `${prefix}_${name}`
    return localStorage.getItem(name)
  },
  set(name: string, value: any) {
    name = `${prefix}_${name}`
    localStorage.setItem(name, value)
  },
  getJSON(name: string) {
    name = `${prefix}_${name}`
    const value = localStorage.getItem(name) || null
    return value ? JSON.parse(value) : value
  },
  setJSON(name: string, value: any) {
    name = `${prefix}_${name}`
    value = JSON.stringify(value)
    localStorage.setItem(name, value)
  },
  remove(name: string) {
    name = `${prefix}_${name}`
    localStorage.removeItem(name)
  },
}
