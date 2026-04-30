# Public Readiness

This document is the north-star analysis for `dtcg-formulas` as a public, installable companion pipeline for DTCG tokens. It names the objective, compares the project to prior art, enumerates the gaps between today and that objective, and proposes a phased rollout.

## Objective

Any developer whose design system uses DTCG-latest-spec-compliant tokens should be able to:

1. Pull this project into their pipeline in a streamlined way (one or two `npm install`s).
2. Use the `$extensions.org.dtcg-formulas` syntax to define computed token functions directly inside their tokens.
3. Run a build step that lints the formula syntax and writes the computed result back as each token's `$value`.

The result is a companion pipeline to modern DTCG — tool-agnostic at its core, with first-class integrations (Style Dictionary, Terrazzo, raw JSON in/out) layered on top, so design engineers and front-end engineers can take advantage of useful computed functions defined inside the tokens themselves.

## Design principles

- **Tool-agnostic core.** A pure resolver works on DTCG JSON in/out, with no hard dependency on Style Dictionary or any one build system.
- **Streamlined DX.** Install one package, point at `tokens.json`, get computed tokens. Clear errors with codes and spans. Preflight (`lint`) and build (`compile`) are separate verbs.
- **Education built in.** The repo teaches: how DTCG works, why formulas, how to author one, how to integrate.
- **Extendable.** Adapter packages plug in via a documented contract. Style Dictionary and Terrazzo integrations are thin wrappers over the core, not the core itself.

## Where this project sits

DTCG reached its [first stable Format Module v1](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/) in October 2025. The ecosystem has converged on JSON tokens with `$value` / `$type` / `$extensions`, multi-file support, theming, and modern color (Display P3, Oklch, CSS Color 4). The compiler/build layer is well covered:

- **[Style Dictionary 4.x](https://styledictionary.com/info/dtcg/)** — DTCG-native build with transitive transforms, plugin-friendly transforms/formats/actions.
- **[Terrazzo](https://github.com/terrazzoapp/terrazzo)** (formerly Cobalt) — DTCG-native compiler with `@terrazzo/parser` core and `@terrazzo/cli` thin wrapper.
- **[design-tokens-format-module](https://github.com/nclsndr/design-tokens-format-module)** — TypeScript reference parser/validator with alias resolution.
- **[Tokens Studio](https://tokens.studio/)** — authoring surface that emits DTCG.

What none of these standardize is a way to **define computed token formulas inside the tokens themselves**. They resolve aliases, evaluate basic math expressions in some cases, but don't preserve formula provenance, don't share function definitions across tools, and don't have a vocabulary for higher-order operations like contrast-aware color, modular scales, or alpha compositing.

That's the gap `dtcg-formulas` fills: an authoring-time formula layer + an execution layer that any DTCG consumer can plug into.

## Prior-art architectures we lean on

- **[Dart Sass](https://sass-lang.com/documentation/js-api/)** — lexer → parser → AST → visitor-based evaluator, exposed as both CLI and JS API (`compile`, `compileString`, async variants). Validates the "pure core + thin wrappers" split we're recommending. The visitor pattern is also the right shape for our resolver.
- **Style Dictionary** — token traversal with [transitive transforms](https://styledictionary.com/info/architecture/) that run after reference resolution. This is the right hook point for our SD plugin: the resolver runs as a transitive preprocessor, after SD has resolved DTCG aliases but before platform-specific format generation.
- **Terrazzo** — `@terrazzo/parser` JS core + `@terrazzo/cli` thin wrapper. Closest analogue for the CLI shape we want, and proves a tool-agnostic DTCG compiler has market demand.

## Gap analysis

Tagging gaps by impact on the public-use objective:

### Blockers for 0.1.0 (publishable) — :white_check_mark: resolved

These were the blockers before the first publish. Kept here as a record; all resolved as of [0.1.0 on npm](https://www.npmjs.com/org/dtcg-formulas).

- ~~**No npm publication.** Every package is `private: true` at `0.0.0`. Nothing is installable.~~
- ~~**No CJS build.** TypeScript-only output is fine for ESM consumers but breaks CJS callers.~~
- ~~**No `publishConfig`, repo/bugs/homepage/keywords.** Required for a credible npm presence.~~
- ~~**Workspace dep uses `*` not `workspace:*`.** Will publish a broken graph.~~
- ~~**No CI for tests/lint/typecheck.** Only a Pages deploy exists today.~~
- **No CHANGELOG / release process.** No automated versioning; can't communicate changes.
- **No CONTRIBUTING / SECURITY / CODE_OF_CONDUCT.** Standard bar for a public OSS library.
- **No lint/format config.** Style isn't enforced; PRs from outside contributors will drift.

### Blockers for 0.2.0 (the compiler)

- **No resolver.** `@dtcg-formulas/resolver` is a stub. The library cannot compute `$value` from a formula. This is the single biggest blocker against the stated objective.
- **No CLI.** `dtcg-formulas compile | lint | check` does not exist.
- **No executable built-ins.** `round`, `clamp`, `min`, `max`, `mix` are metadata only.
- **No diagnostics-first error model.** Parser throws plain strings. Public users will demand codes, spans, and stable error contracts.
- **No JSON Schema for `org.dtcg-formulas`.** Editor validation, the future `lint` command, and downstream tools all need this.

### Important for 0.3.0 (integrations)

- **No adapter executability contract.** Adapters like `leo()`, `composite()`, `optimal-foreground()`, `material-shadow()` are metadata only. They need a documented `implement(args, ctx)` contract and shipped JS implementations.
- **No Style Dictionary plugin implementation.** The package exists as a stub.
- **No docs generator.** Site is hand-curated; should be derivable from `.module.scssdef` metadata.

### Nice-to-have

- **Spec/docs minor inconsistency.** The README/spec use `"call"` for the formula string; doc examples use `"formula"`. Pick one (recommend `"formula"`, since that's what's already in user-facing docs) and align the spec.
- **Editor LSP.** Once the JSON Schema and diagnostic codes are stable, an LSP becomes straightforward.
- **Generator/recipe model.** One-to-many token derivation isn't in v0; revisit when the scalar story is solid.

## Recommended architecture

Five packages, cleanly separated:

```
@dtcg-formulas/parser     parses .module.scssdef files
@dtcg-formulas/registry   stores function declarations
@dtcg-formulas/resolver   pure core: walks DTCG, resolves refs, invokes impls, writes $value
@dtcg-formulas/builtins   executable JS for math built-ins (paired with definitions)
@dtcg-formulas/cli        thin CLI: compile | lint | check
```

Plus opt-in adapter packages (`@dtcg-formulas/adapter-leonardo`, `-color-names`, `-composite`, `-optimal-foreground`, `-material-shadow`, etc.) and integration wrappers (`@dtcg-formulas/style-dictionary-plugin`, `@dtcg-formulas/terrazzo-plugin`).

### Adapter packaging contract

Every adapter package exports two things:

```ts
import scssdefSource from './leonardo.module.scssdef?raw';

export const definition = parse(scssdefSource);

export function implement(args, ctx) {
  // Pure JS implementation of the function.
  // args: positional arguments, already resolved to literals.
  // ctx: { tokenPath, registry, diagnostics }
  // Returns the computed value.
}
```

Adapters are **opt-in dependencies** for consumers — nobody pays for Leonardo unless they actually use `leo()`. The resolver auto-loads adapters listed in its config and routes calls by function name.

### Resolver contract

```ts
import { compile } from '@dtcg-formulas/resolver';

const { tokens, diagnostics } = await compile(input, {
  definitions: ['tokens/functions/**/*.module.scssdef'],
  adapters: ['@dtcg-formulas/adapter-leonardo'],
});
```

Pure function: same input, same diagnostics, same output. No I/O beyond what's in the config. No SD or Terrazzo dependencies in the core.

### CLI verbs

- **`compile`** — full resolution; writes a new tokens file with computed `$value`s.
- **`lint`** — preflight only; parses every formula, validates against the registry, checks references and arity, never executes a formula. Adapter packages don't need to be installed for `lint` to run.
- **`check`** — dry-run compile; produces the full diagnostic report without writing output. Useful for CI.

Separating `lint` from `compile` is deliberate: preflight should be cheap, fast, and adapter-free so a CI job can fail-fast on syntax problems without pulling in heavy color or contrast engines.

## Preflight contract

`dtcg-formulas lint` guarantees, without executing any formula:

1. The input JSON parses.
2. The token tree is valid DTCG.
3. Every `$extensions.org.dtcg-formulas` entry is well-formed (`formula`, `definition`, optional `syntax`).
4. Every `definition` ref resolves to a registered function.
5. The `formula` call string parses.
6. The call's arity and argument shapes match the registered declaration.
7. Every `{path.to.token}` reference inside the call resolves to a token in the tree.
8. No cycles exist in the reference graph.

Anything that requires running a function (e.g. checking that `clamp(min, mid, max)` actually has `min <= max`) is reported by `compile` or `check`, not `lint`.

## Error model

Every diagnostic carries:

```ts
interface Diagnostic {
  code: string;        // 'DTCG-FORMULAS-L107'
  severity: 'error' | 'warning';
  message: string;
  span?: { file: string; line: number; column: number; length: number };
  hint?: string;
  docsUrl?: string;    // points at /guide/troubleshooting#code
}
```

Code prefixes:

- `P###` — parse (`.module.scssdef`)
- `L###` — lint / preflight
- `R###` — resolve (execution)
- `V###` — DTCG `$value` validation

Mirrors how dart-sass and TypeScript publish diagnostics. The full code reference lives in [Troubleshooting](/guide/troubleshooting).

## Versioning & release

- Semver per package.
- Internal deps use `workspace:*` (or pinned `workspace:^X.Y.Z`).
- Changesets owns the release flow: every PR adds a `.changeset/*.md` describing user-facing impact, and a release workflow opens a Version PR that bumps versions, updates `CHANGELOG.md` files, and publishes to npm on merge.
- `@dtcg-formulas/spec` versions the syntax (`scssdef@0.1`, `extension@0.1`) independently of the runtime packages.

## Phased rollout

| Version | Ships | Public DX |
|---|---|---|
| **0.1.0** *(released)* | Published `parser` + `registry` + `spec`, full education surface, architecture analysis, CI, release plumbing | Authoring + registration + documentation. No execution yet. |
| **0.2.0** | `resolver` + `builtins` + `cli` (compile/lint/check), JSON Schema, diagnostics-first errors | **End-to-end DX is real.** Bare-JSON consumers can install one CLI and compile their tokens. |
| **0.3.0** | Executable adapter packages (leonardo, color-names, composite, optimal-foreground, material-shadow), Style Dictionary plugin, docs generator | Color and contrast adapters ship. SD users get a turnkey integration. |
| **0.4.0+** | Remaining adapters, Terrazzo plugin, editor LSP, generator/recipe exploration | Full ecosystem coverage; editor-grade authoring. |

## Open questions

- **Namespaced calls.** Should `leonardo.color(...)` be first-class in the parser, or always rewritten to `leo(...)`? Affects how adapters declare themselves.
- **Inline expressions.** Should the resolver support expressions beyond function calls (`{a.b} + 4px`) in v0, or stay strict-call-only? (Per [vision.md](../vision) open question #3.)
- **Adapter testing.** How do we test adapters that wrap non-deterministic external engines (color rounding, LCH gamut clipping)? Snapshot? Tolerance bands?
- **Spec/docs key alignment.** Spec source under `packages/spec/formula-extension-spec.md` uses `"call"`; user-facing docs settled on `"formula"`. Decision pending: align the spec to match `"formula"` in a 0.1.x patch, or migrate docs back to `"call"`. Either way, decide before 0.2.0 publishes any tooling that hardcodes the key name.
