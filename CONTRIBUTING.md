# Contributing to dtcg-formulas

Thanks for your interest. This guide covers the dev loop, how to add a formula, and how releases work.

## Dev loop

```bash
git clone https://github.com/beacrea/dtcg-formulas
cd dtcg-formulas
npm install

npm run build         # build all packages (tsup)
npm test              # run unit tests (vitest)
npm run typecheck     # tsc --noEmit
npm run check         # biome lint + format check
npm run format        # auto-format with biome

npm run docs:dev      # local docs site
```

Node 20 or 22 is supported.

## Adding a new formula

1. **Decide if it's a built-in or an adapter.** Built-ins are general-purpose math/color helpers maintained inside this repo (`packages/registry`). Adapters wrap a domain-specific external library and live in their own `@dtcg-formulas/adapter-*` package (0.3.0+).
2. **Write the `.module.scssdef`** under `examples/<name>/`. Required: YAML frontmatter (`module`, `title`, `summary`), SassDoc comments per parameter, `@function` signature, `@return` expression. See [`examples/builtins/clamp.module.scssdef`](./examples/builtins/clamp.module.scssdef) for a minimal reference.
3. **Add a parser test** under `packages/parser/__tests__/parse.test.ts` that loads and asserts the parsed shape.
4. **Add a docs page** at `docs/examples/<name>.md` matching the structure of [`docs/examples/composite.md`](./docs/examples/composite.md) or [`docs/examples/modular-scale.md`](./docs/examples/modular-scale.md): summary, the embedded `.module.scssdef` via `<<<`, "How It Works", "Usage Examples", "DTCG Extension".
5. **Update the sidebar** in [`docs/.vitepress/config.mts`](./docs/.vitepress/config.mts) to include the new page.
6. **Add a changeset** with `npm run changeset` describing the user-facing impact.

## PR conventions

- One logical change per PR.
- Include a Changeset (`npm run changeset`) for any user-visible change. Releases will not pick up changes that don't have one.
- All checks must pass: `test`, `typecheck`, `check` (biome), `build`.
- Reference the issue or PR number in your commit message body when applicable.

## Releases

Releases are managed by [Changesets](https://github.com/changesets/changesets). The flow is:

1. Author a changeset alongside your PR (`npm run changeset`). It captures which packages changed and at what semver level.
2. On merge to `main`, the release workflow opens (or updates) a "Version Packages" PR that bumps versions and updates `CHANGELOG.md` files.
3. Merging the Version Packages PR publishes the new versions to npm.

Maintainers need the `NPM_TOKEN` secret configured in the GitHub repo for the publish step to succeed.

## Architecture

The full design rationale and phased roadmap is in [`docs/architecture/public-readiness.md`](./docs/architecture/public-readiness.md). New contributors are encouraged to read it before proposing structural changes.

## Code of Conduct

This project follows the [Contributor Covenant](./CODE_OF_CONDUCT.md).

## Security

To report a security issue, see [`SECURITY.md`](./SECURITY.md).
