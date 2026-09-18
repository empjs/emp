import {useState} from 'react'
import {createRoot} from 'react-dom/client'
import styles from './App.module.css'

const migrations = [
  ['build.useESM', "build.format: 'script'"],
  ['build.polyfill.browserslist', 'build.targets'],
  ['build.devtool', 'build.sourcemap.js'],
  ['css.prifixName', 'css.prefixName'],
  ['pluginReact.splickChunks', 'pluginReact.splitChunks'],
]

function App() {
  const [count, setCount] = useState(0)
  const compatibilityApis = [Object.entries({ready: true}).length, [1, [2]].flat().length].join(':')

  return (
    <main className={styles.page} data-testid="legacy-config-page">
      <h1>Legacy configuration compatibility works</h1>
      <p data-testid="compatibility-apis">Polyfill APIs: {compatibilityApis}</p>
      <ul className={styles.list}>
        {migrations.map(([legacy, canonical]) => (
          <li key={legacy}>
            <code>{legacy}</code> → <code>{canonical}</code>
          </li>
        ))}
      </ul>
      <button className={styles.button} data-testid="counter" type="button" onClick={() => setCount(value => value + 1)}>
        Count: {count}
      </button>
      <div className={styles.remProbe} data-testid="rem-probe" />
    </main>
  )
}

createRoot(document.getElementById('emp-root')!).render(<App />)
