const githubRepository = 'https://github.com/empjs/emp'
const githubSkillDir = 'https://github.com/empjs/emp/tree/v4/skills/emp'
const rspackLogo = 'https://assets.rspack.rs/rspack/rspack-logo.svg'

const foundations = [
  {name: 'Rspack 2', tone: 'rspack'},
  {name: 'Module Federation 2', tone: 'federation'},
  {name: 'TypeScript 7', tone: 'typescript'},
  {name: 'React Compiler', tone: 'react'},
] as const

type FoundationTone = (typeof foundations)[number]['tone']

function GitHubIcon() {
  return (
    <svg aria-hidden="true" className="github-mark" viewBox="0 0 24 24">
      <path
        d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.88c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.82a9.6 9.6 0 0 1 2.5.34c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86V21c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
        fill="currentColor"
      />
    </svg>
  )
}

function FoundationIcon({tone}: {tone: FoundationTone}) {
  if (tone === 'rspack') {
    return <img alt="" className="foundation-logo" src={rspackLogo} />
  }

  if (tone === 'typescript') {
    return (
      <span aria-hidden="true" className="typescript-mark">
        TS
      </span>
    )
  }

  if (tone === 'federation') {
    return (
      <svg aria-hidden="true" className="foundation-logo federation-mark" viewBox="0 0 64 64">
        <path d="m32 7 21 12v25L32 57 11 44V19L32 7Z" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="m12 19 20 12 21-12M32 31v26" fill="none" stroke="currentColor" strokeWidth="4" />
        <circle cx="32" cy="31" fill="currentColor" r="5" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" className="foundation-logo react-mark" viewBox="0 0 64 64">
      <circle cx="32" cy="32" fill="currentColor" r="5" />
      <ellipse cx="32" cy="32" fill="none" rx="27" ry="10" stroke="currentColor" strokeWidth="3" />
      <ellipse
        cx="32"
        cy="32"
        fill="none"
        rx="27"
        ry="10"
        stroke="currentColor"
        strokeWidth="3"
        transform="rotate(60 32 32)"
      />
      <ellipse
        cx="32"
        cy="32"
        fill="none"
        rx="27"
        ry="10"
        stroke="currentColor"
        strokeWidth="3"
        transform="rotate(120 32 32)"
      />
    </svg>
  )
}

export function App() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand-lockup" href={githubRepository} rel="noreferrer" target="_blank">
          <img alt="EMP" height="52" src="/emp-federation-fox-mark.png" width="52" />
          <span>EMP</span>
        </a>

        <nav aria-label="主导航" className="top-nav">
          <a href={githubSkillDir} rel="noreferrer" target="_blank">
            Skills
          </a>
          <a className="github-nav" href={githubRepository} rel="noreferrer" target="_blank">
            GitHub
          </a>
        </nav>
      </header>

      <main className="page-content">
        <section className="hero-section">
          <div className="hero-visual">
            <img alt="EMP Federation Fox" height="512" src="/emp-federation-fox-mark.png" width="512" />
          </div>

          <div className="hero-copy">
            <h1>EMP</h1>
            <p className="hero-eyebrow">AGENT-FIRST</p>
            <p className="hero-tagline">高性能、微前端构建</p>

            <div className="hero-actions">
              <a
                aria-label="Use $emp"
                className="primary-action"
                href={githubSkillDir}
                rel="noreferrer"
                target="_blank"
              >
                <span aria-hidden="true" className="terminal-mark">
                  &gt;_
                </span>
                <span>Use $emp</span>
              </a>

              <a className="github-action" href={githubRepository} rel="noreferrer" target="_blank">
                <GitHubIcon />
                GitHub
              </a>
            </div>
          </div>
        </section>

        <section className="foundation-section" aria-labelledby="foundation-title">
          <h2 className="sr-only" id="foundation-title">
            技术底座
          </h2>
          <div className="foundation-list">
            {foundations.map(foundation => (
              <div className={`foundation-card foundation-card-${foundation.tone}`} key={foundation.name}>
                <FoundationIcon tone={foundation.tone} />
                <strong>{foundation.name}</strong>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>© 2026 EMP · AGENT-FIRST</p>
        <nav aria-label="页脚导航" className="footer-nav">
          <a href={githubSkillDir} rel="noreferrer" target="_blank">
            Skills
          </a>
          <a href={githubRepository} rel="noreferrer" target="_blank">
            GitHub
          </a>
        </nav>
      </footer>
    </div>
  )
}
