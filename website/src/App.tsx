const githubRepository = 'https://github.com/empjs/emp'
const githubSkillDir = 'https://github.com/empjs/emp/tree/v4/skills/emp'
const githubSkillBlob = 'https://github.com/empjs/emp/blob/v4/skills/emp'

const skillDocuments = [
  {
    href: `${githubSkillBlob}/SKILL.md`,
    path: 'skills/emp/SKILL.md',
  },
  {
    href: `${githubSkillBlob}/references/project-setup.md`,
    path: 'skills/emp/references/project-setup.md',
  },
  {
    href: `${githubSkillBlob}/references/module-federation.md`,
    path: 'skills/emp/references/module-federation.md',
  },
  {
    href: `${githubSkillBlob}/references/plugins.md`,
    path: 'skills/emp/references/plugins.md',
  },
  {
    href: `${githubSkillBlob}/references/validation-release.md`,
    path: 'skills/emp/references/validation-release.md',
  },
] as const

const foundations = [
  {
    code: 'Rs',
    detail: 'Rust 构建内核',
    name: 'Rspack 2.1.3',
    tone: 'rspack',
  },
  {
    code: 'MF',
    detail: '官方联邦运行时',
    name: 'Module Federation 2.7',
    tone: 'federation',
  },
  {
    code: 'TS',
    detail: '稳定类型基线',
    name: 'TypeScript 7.0',
    tone: 'typescript',
  },
  {
    code: 'RC',
    detail: '按需启用',
    name: 'React Compiler',
    tone: 'react',
  },
] as const

export function App() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <a
          className="brand-lockup"
          href={githubRepository}
          rel="noreferrer"
          target="_blank"
        >
          <img
            alt="EMP"
            height="52"
            src="/emp-federation-fox-mark.png"
            width="52"
          />
          <span>EMP</span>
        </a>

        <nav aria-label="主导航" className="top-nav">
          <a href={githubSkillDir} rel="noreferrer" target="_blank">
            Skills
          </a>
          <a
            className="github-nav"
            href={githubRepository}
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </a>
        </nav>
      </header>

      <main className="page-content">
        <section className="hero-section">
          <div className="hero-visual">
            <img
              alt="EMP Federation Fox"
              height="512"
              src="/emp-federation-fox-mark.png"
              width="512"
            />
          </div>

          <div className="hero-copy">
            <h1>EMP</h1>
            <p className="hero-eyebrow">AGENT-FIRST</p>
            <p className="hero-tagline">高性能、微前端构建</p>

            <div className="hero-actions">
              <div className="skill-action">
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
                <span className="skill-path">skills/emp</span>
              </div>

              <a
                className="github-action"
                href={githubRepository}
                rel="noreferrer"
                target="_blank"
              >
                <span aria-hidden="true" className="github-mark">
                  GH
                </span>
                GitHub
              </a>
            </div>
          </div>
        </section>

        <section className="foundation-section" aria-labelledby="foundation-title">
          <h2 id="foundation-title">技术底座</h2>
          <div className="foundation-list">
            {foundations.map((foundation) => (
              <div className="foundation-row" key={foundation.name}>
                <span
                  aria-hidden="true"
                  className={`foundation-icon foundation-icon-${foundation.tone}`}
                >
                  {foundation.code}
                </span>
                <strong>{foundation.name}</strong>
                <span className="foundation-divider" />
                <span className="foundation-detail">{foundation.detail}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>© 2026 EMP · AGENT-FIRST</p>
        <div aria-label="Skill 文档" className="skill-doc-links">
          {skillDocuments.map((document) => (
            <a
              href={document.href}
              key={document.path}
              rel="noreferrer"
              target="_blank"
            >
              {document.path}
            </a>
          ))}
        </div>
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
