import styles from './App.module.scss'

const App = (props: {name?: string; debug?: boolean; status?: string}) => {
  console.log('props', props)
  if (props.debug) {
    console.log('debug ', props.debug)
  }
  return (
    <div>
      <h1>
        Provider {props.name ? props.name : ''} Status: {props.status ? props.status : ''}
      </h1>
    </div>
  )
}
export default App

export const Layout = (props: {children: React.ReactNode}) => {
  return (
    <div className={styles.layout}>
      <h1>runtime layout {Math.random()}</h1>
      {props.children}
    </div>
  )
}
