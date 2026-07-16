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

function FederationIcon() {
  return (
    <svg aria-hidden="true" className="federation-mark" viewBox="0 0 96 72">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
        <path d="m48 10 13 7.5v15L48 40l-13-7.5v-15L48 10Z" />
        <path d="m22 38 13 7.5v15L22 68 9 60.5v-15L22 38Zm52 0 13 7.5v15L74 68l-13-7.5v-15L74 38Z" />
        <path d="m35 25-13 13m39-13 13 13M35 53h26" />
      </g>
    </svg>
  )
}

function ReactIcon() {
  return (
    <svg aria-hidden="true" className="react-mark" viewBox="0 0 96 96">
      <circle cx="48" cy="48" fill="currentColor" r="5" />
      <g fill="none" stroke="currentColor" strokeWidth="4">
        <ellipse cx="48" cy="48" rx="40" ry="16" />
        <ellipse cx="48" cy="48" rx="40" ry="16" transform="rotate(60 48 48)" />
        <ellipse cx="48" cy="48" rx="40" ry="16" transform="rotate(120 48 48)" />
      </g>
    </svg>
  )
}

function FoundationIcon({tone}: {tone: FoundationTone}) {
  if (tone === 'rspack') return <img alt="" className="rspack-mark" src={rspackLogo} />
  if (tone === 'federation') return <FederationIcon />
  if (tone === 'typescript') return <span className="typescript-mark">TS</span>
  return <ReactIcon />
}

export function App() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <a aria-label="EMP 首页" className="brand-lockup" href="#top">
          <img alt="" height="64" src="/emp-federation-fox-mark.png" width="64" />
          <span>EMP</span>
        </a>
        <nav aria-label="主导航" className="top-nav">
          <a className="skills-nav" href={githubSkillDir} rel="noopener noreferrer" target="_blank">
            Skills
          </a>
          <a className="github-nav" href={githubRepository} rel="noopener noreferrer" target="_blank">
            GitHub
          </a>
        </nav>
      </header>

      <main className="hero-page" id="top">
        <section className="hero-layout" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="hero-eyebrow">
              <span className="eyebrow-pulse" aria-hidden="true" />
              EMP V4 / AGENT-NATIVE PLATFORM
            </p>
            <h1 id="hero-title">EMP</h1>
            <p className="hero-title">
              <span className="desktop-title">
                <strong>Agent Skill First</strong>
                <span>Enterprise Micro-Frontend Solution</span>
              </span>
              <span className="mobile-title">AGENT-FIRST</span>
            </p>
            <div className="hero-signals" aria-label="EMP 产品能力">
              <span>
                <b>01</b>
                Skill-native
              </span>
              <span>
                <b>02</b>
                Composable delivery
              </span>
            </div>
          </div>

          <div className="hero-visual">
            <span className="visual-tag visual-tag-top">MODULE ORCHESTRATION</span>
            <span className="visual-tag visual-tag-bottom">FEDERATED AT SCALE</span>
            <img
              alt="EMP Federation Fox 与联邦模块"
              height="768"
              src="/emp-federation-fox-mark-native.webp"
              width="768"
            />
          </div>

          <div className="hero-actions">
            <a className="github-action" href={githubRepository} rel="noopener noreferrer" target="_blank">
              <GitHubIcon />
              <span>Open GitHub</span>
            </a>
            <a className="skill-action" href={githubSkillDir} rel="noopener noreferrer" target="_blank">
              <span aria-hidden="true" className="terminal-mark">
                &gt;_
              </span>
              <span>
                Use <strong>$emp</strong>
              </span>
            </a>
          </div>

          <div className="foundation-area">
            <div className="foundation-heading">
              <p>ENGINEERED FOR THE MODERN WEB</p>
              <span>One platform. Composable at every boundary.</span>
            </div>
            <div className="foundation-grid" aria-label="EMP 技术栈">
              {foundations.map(foundation => (
                <article className={`foundation-card ${foundation.tone}`} key={foundation.name}>
                  <FoundationIcon tone={foundation.tone} />
                  <h2>{foundation.name}</h2>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
