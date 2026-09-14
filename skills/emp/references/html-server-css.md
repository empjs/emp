# HTML Server Entries And CSS

Use this reference for application paths, page generation, multi-entry builds, dev-server behavior, Sass, Less, and CSS Modules naming.

## Contents

- [Application paths and pages](#application-paths-and-pages)
- [HTML](#html)
- [Entries](#entries)
- [Server](#server)
- [CSS](#css)
- [Acceptance](#acceptance)

## Application paths and pages

| Field | Default/behavior |
| --- | --- |
| `base` | Omitted values resolve output `publicPath` to `auto`; set a path or absolute asset origin when deployment requires it. |
| `appSrc` | `src`; source root used by entry and library path resolution. |
| `appEntry` | Application entry such as `index.tsx`; explicit `entries` supersede the single-entry path. |
| `autoDevBase` | Development-only reachable base URL derived from the dev server; useful for cross-device and federation testing. |
| `autoPages` | `true` discovers pages under `pages`; `{path}` selects another directory. |

## HTML

`html` extends `HtmlRspackPluginOptions`. EMP-owned or behavior-critical fields are:

| Field | Default/behavior |
| --- | --- |
| `html.template` | Custom template path. When absent, EMP supplies default meta tags and mount markup. |
| `html.favicon` | Favicon path. |
| `html.mountId` | `emp-root`; id of the generated application mount node. |
| `html.lang` | `zh-CN`. |
| `html.tags` | Extra `head` or `body` tag descriptors. |
| `html.templateParameters` | Values passed to the HTML template. |
| `html.cache` | Follows EMP cache unless explicitly overridden. |
| `html.title` | `EMP`. |
| `html.inject` | `body`. |
| `html.minify` | Enabled outside development. |
| `html.scriptLoading` | Derived from `build.format`: `defer` for script and `module` for ESM. Override only when output format remains consistent. |
| `html.meta` | EMP defaults when no custom template owns metadata. |
| `html.filename` | HtmlRspackPlugin output filename passthrough. |
| `html.publicPath` | Page-specific public path passthrough. |

Use inherited HtmlRspackPlugin options directly for fields not redefined by EMP. Verify the installed Rspack plugin type before relying on an uncommon passthrough option.

## Entries

`entries` maps entry filenames to per-page `HtmlType` options:

```ts
entries: {
  'info.ts': {title: 'Info'},
  'work/index.ts': {
    title: 'Work',
    template: 'src/work/index.html',
  },
}
```

Each entry may override HTML fields such as `title`, `template`, `filename`, tags, or public path. Confirm every expected HTML and JS artifact after a multi-entry build.

## Server

`server` extends the current Rspack dev-server configuration.

| Field | EMP default/behavior |
| --- | --- |
| `server.host` | `0.0.0.0`. |
| `server.port` | `8000`. |
| `server.open` | Enabled on macOS by default; set `false` in automation. |
| `server.hot` | `true`; framework plugins may coordinate their HMR setting with it. |
| `server.https` | Enable HTTPS using the accepted dev-server form. |
| `server.http2` | Legacy compatibility switch mapped internally to h2; avoid in new configs until a supported replacement is formalized. |
| `server.proxy` | Rspack dev-server proxy passthrough. |
| `server.headers` | Defaults include permissive CORS headers for federation development. |
| `server.historyApiFallback` | `true`. |
| `server.allowedHosts` | Defaults to `['all']`. |
| `server.static` | Defaults to serving `build.publicDir`. |
| `server.client` | Use for explicit browser/WebSocket client overrides. EMP derives a LAN WebSocket URL for unspecified hosts when possible. |
| `server.watchFiles` | Defaults to `src/**/*.html`. |

Treat every other inherited field as a raw Rspack dev-server passthrough and verify it against the installed version.

## CSS

| Field | Default/behavior |
| --- | --- |
| `css.sass.api` | Sass loader API passthrough. |
| `css.sass.sassOptions` | Sass implementation options. |
| `css.sass.mode` | `modern`; also accepts `default` or `legacy`. |
| `css.sass.implementation` | Custom Sass implementation object or module path. |
| `css.sass.webpackImporter` | Sass webpack importer switch. |
| `css.sass.warnRuleAsWarning` | Controls Sass warning routing; inherits `debug.warnRuleAsWarning` by default. |
| `css.sass.additionalData` | Prepended Sass source. |
| `css.less.lessOptions.javascriptEnabled` | `true` for common UI-library compatibility. |
| `css.less.lessOptions.math` | `always`; use `parens-division` or `strict` for stricter Less v4 behavior. |
| `css.prefixName` | Canonical CSS Modules className prefix. |
| `css.prifixName` | Deprecated spelling alias for `css.prefixName`. |

Framework or CSS transformation packages remain under `plugins`; read `plugins.md` for their option tables.

## Acceptance

- Build and list all expected entry HTML/JS/CSS assets.
- Inspect generated script attributes and public paths.
- Test proxy success and failure behavior in a browser when proxy configuration changes.
- Verify HMR from a LAN client when host, HTTPS, or WebSocket behavior changes.
- Assert CSS Modules className prefixes and visible computed styles for CSS changes.
