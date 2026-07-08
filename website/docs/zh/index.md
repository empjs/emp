# EMP v4

<div class="emp-home">
  <section class="emp-hero" data-section="hero">
    <div class="emp-hero-copy">
      <div class="emp-kicker">
        <img src="/emp-v4-logo.png" alt="EMP v4 logo" />
        <span>Rspack 2 · Module Federation 2 · Agent-First</span>
      </div>
      <h2>让微前端工程从配置、联邦、类型到发布验收保持一条主线。</h2>
      <p>
        EMP v4 是面向大型前端体系的构建入口。它把 Rspack 2、Module Federation 2、类型声明、插件生态和真实验收收束到熟悉的 EMP 配置模型里，让 host、remote、shared、manifest 和 release gates 有清晰边界。
      </p>
      <div class="emp-actions">
        <a href="/guide/quick-start.html">开始接入</a>
        <a href="/examples/apps-matrix.html">查看验收矩阵</a>
      </div>
    </div>
    <div class="emp-command-panel" aria-label="EMP v4 command flow">
      <div class="emp-command-topline">
        <span>emp.config.ts</span>
        <strong>v4 release path</strong>
      </div>
      <div class="emp-code-lines" aria-label="EMP v4 configuration preview">
        <span><em>import</em> {defineConfig} <em>from</em> '@empjs/cli'</span>
        <span><em>import</em> {pluginRspackEmpShare} <em>from</em> '@empjs/share'</span>
        <span></span>
        <span><em>export default</em> defineConfig({</span>
        <span>  plugins: [</span>
        <span>    pluginRspackEmpShare({</span>
        <span>      name: 'host',</span>
        <span>      exposes: {'./App': './src/App'},</span>
        <span>      remotes: {mfApp: 'mfApp@/mf-manifest.json'},</span>
        <span>    }),</span>
        <span>  ],</span>
        <span>})</span>
      </div>
      <div class="emp-command-rail">
        <span>dev</span>
        <span>build</span>
        <span>dts</span>
        <span>acceptance</span>
      </div>
    </div>
  </section>

  <section class="emp-metrics" data-section="metrics" aria-label="EMP v4 website metrics">
    <div class="emp-metric">
      <strong>26 篇中文文档</strong>
      <span>快速开始、配置、核心能力、插件、迁移、FAQ 全部中文化。</span>
    </div>
    <div class="emp-metric">
      <strong>7 个插件包</strong>
      <span>React、Vue 2、Vue 3、Tailwind CSS 4、PostCSS、Lightning CSS、Stylus。</span>
    </div>
    <div class="emp-metric">
      <strong>14 个示例应用</strong>
      <span>覆盖 host、remote、adapter、Rspack 2、Vue、React 和 CSS 场景。</span>
    </div>
    <div class="emp-metric">
      <strong>5 类发布门禁</strong>
      <span>workflow、rules、website build、CI verify、empbuild 形成验收证据。</span>
    </div>
  </section>

  <section class="emp-architecture" data-section="architecture">
    <div class="emp-section-heading">
      <span>Architecture</span>
      <h2>四层能力把微前端链路串起来</h2>
      <p>从创建项目到发布前验收，v4 保持一套可解释、可测试、可迁移的工程路径。</p>
    </div>
    <div class="emp-architecture-grid">
      <article class="emp-layer">
        <span>01</span>
        <h3>CLI Orchestration</h3>
        <p>@empjs/cli 读取 EMP 配置，驱动开发服务、构建、预览和 Agent-First 创建流程。</p>
        <a href="/guide/commands.html">查看命令</a>
      </article>
      <article class="emp-layer">
        <span>02</span>
        <h3>Federation Runtime</h3>
        <p>@empjs/share 封装 Module Federation 2 的 host、remote、shared、manifest 和运行时加载。</p>
        <a href="/core/module-federation.html">理解联邦</a>
      </article>
      <article class="emp-layer">
        <span>03</span>
        <h3>Plugin Surface</h3>
        <p>框架、CSS、质量插件以小包形式接入，避免业务项目直接维护底层 Rspack 细节。</p>
        <a href="/plugins/index.html">浏览插件</a>
      </article>
      <article class="emp-layer">
        <span>04</span>
        <h3>Acceptance Proof</h3>
        <p>示例应用、规则测试和发布门禁共同证明 v4 能覆盖真实微前端边界。</p>
        <a href="/release/gates.html">核对门禁</a>
      </article>
    </div>
  </section>

  <section class="emp-journeys" data-section="journeys">
    <div class="emp-section-heading">
      <span>Journeys</span>
      <h2>按你当前的问题进入文档</h2>
      <p>首页不只是目录，而是把常见决策路径提前摆出来。</p>
    </div>
    <div class="emp-journey-grid">
      <a class="emp-journey" href="/guide/quick-start.html">
        <strong>新项目接入</strong>
        <span>环境基线、安装、最小配置和第一条构建命令。</span>
      </a>
      <a class="emp-journey" href="/core/dts.html">
        <strong>类型声明治理</strong>
        <span>联邦 DTS、运行时类型包和 host 侧消费边界。</span>
      </a>
      <a class="emp-journey" href="/config/emp-share.html">
        <strong>联邦配置核对</strong>
        <span>name、exposes、remotes、shared 和 manifest 的配置入口。</span>
      </a>
      <a class="emp-journey" href="/migration/v4.html">
        <strong>v3 到 v4 迁移</strong>
        <span>保留 EMP 使用习惯，同时迁到 Rspack / MF 2 基线。</span>
      </a>
    </div>
  </section>

  <section class="emp-release" data-section="release">
    <div class="emp-release-copy">
      <span>Release Evidence</span>
      <h2>官网本身也纳入发布验收</h2>
      <p>
        v4 官网不是静态宣传页。它需要和仓库规则、示例矩阵、LLMS 输出、sitemap 以及发布门禁一起提供可复跑证据。
      </p>
    </div>
    <div class="emp-release-list">
      <a href="/release/index.html"><span>01</span>发布流程与职责边界</a>
      <a href="/release/gates.html"><span>02</span>发布前必须通过的命令</a>
      <a href="/examples/apps-matrix.html"><span>03</span>示例应用覆盖矩阵</a>
      <a href="/llms.txt"><span>04</span>AI 可读文档索引</a>
    </div>
  </section>
</div>
