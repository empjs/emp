## Scope

- Changed areas:
- Protected areas not touched:
- User-visible behavior:

## Directory Boundary Check

- [ ] I did not modify `apps/**` or `website/**` unless this PR is explicitly about examples/sites/acceptance apps.
- [ ] I did not modify `packages/cdn-*` or `packages/lib-*` version lines unless explicitly requested.
- [ ] I did not create or continue `docs/superpowers/**`.
- [ ] I did not commit generated output, caches, or local indexes.

## Validation

- [ ] `pnpm workflow:check`
- [ ] `git diff --check`
- [ ] Relevant tests:
- [ ] `pnpm ci:verify` or reason not run:
- [ ] `pnpm empbuild` or reason not run:

## Release Safety

- [ ] CI workflow contains no `NODE_AUTH_TOKEN`, `npm publish`, or `release:publish`.
- [ ] Release scope excludes `apps/**` and `website/**`.
- [ ] Dry-run publish behavior was checked when release automation changed.

## Review

- [ ] CODEOWNERS review requested.
- [ ] Reviewer can reproduce the validation commands from this PR.
- [ ] Any skipped verification and residual risk is stated above.
