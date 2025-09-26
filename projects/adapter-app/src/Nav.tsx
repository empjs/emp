import styles from './Nav.module.css'

export const Nav = () => {
  // 简单的路径匹配来确定当前活动链接
  const isActive = (path: string) => window.location.pathname.includes(path)

  return (
    <nav className={styles.nav}>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://emp-share.empjs.dev/adapter-app"
        className={isActive('adapter-app') ? styles.activeLink : styles.link}
      >
        Home
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://emp-share.empjs.dev/adapter-vue2-host/"
        className={isActive('adapter-vue2-host') ? styles.activeLink : styles.link}
      >
        Vue2
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://emp-share.empjs.dev/adapter-vue3-host/"
        className={isActive('adapter-vue3-host') ? styles.activeLink : styles.link}
      >
        Vue3
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://emp-share.empjs.dev/adapter-host/"
        className={isActive('adapter-host') ? styles.activeLink : styles.link}
      >
        React
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/empjs/emp/tree/main/projects/adapter-app"
        className={styles.link}
      >
        Github
      </a>
    </nav>
  )
}
