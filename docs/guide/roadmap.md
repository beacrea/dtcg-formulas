# Roadmap

The project is evolving toward a turnkey companion pipeline for DTCG tokens: install one package, point it at `tokens.json`, get computed `$value`s back. The roadmap below organizes that evolution by released version so consumers can plan adoption.

## Phase 0 — Specification :white_check_mark:

- Publish project brief
- Publish `.module.scssdef` spec
- Publish `org.dtcg-formulas` extension spec draft
- Publish minimal function registry contract
- Example `.module.scssdef` files (radius, math)

## Phase 1 — Core Implementation (current)

- [x] Implement `.module.scssdef` parser ([#1](https://github.com/beacrea/dtcg-formulas/issues/1))
- [x] Implement function registry ([#2](https://github.com/beacrea/dtcg-formulas/issues/2))
- [x] Ship built-in clamp definition ([#4](https://github.com/beacrea/dtcg-formulas/issues/4))
- [x] Ship built-in mix definition ([#5](https://github.com/beacrea/dtcg-formulas/issues/5))
- [x] Ship Leonardo color definition + docs ([#8](https://github.com/beacrea/dtcg-formulas/issues/8))
- [x] Ship color-names, modular-scale, shade/tint, fluid-size, material-shadow, composite, optimal-foreground, outline-radius definitions + docs

## 0.1.0 — Public-ready foundation (this track)

The goal is that the metadata surface is installable, versioned, and documented — but execution is still deferred. A consumer can parse, register, and document formulas today; compute comes in 0.2.0.

- Publish `@dtcg-formulas/parser`, `@dtcg-formulas/registry`, `@dtcg-formulas/spec` to npm
- Dual ESM + CJS builds via tsup, typed exports
- Release plumbing: Changesets, CI matrix (Node 20/22), release workflow
- Lint/format via Biome
- Education: concepts, authoring-a-formula, integrations, troubleshooting guides
- Architecture doc: full public-readiness analysis and phased rollout
- `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`

## 0.2.0 — Compute

The compiler lands. End-to-end DX becomes real for any DTCG consumer.

- [ ] `@dtcg-formulas/resolver` — pure, tool-agnostic core that walks a DTCG token tree, resolves `{path.to.token}` references, invokes function implementations, writes computed `$value` back, preserves `$extensions.org.dtcg-formulas` provenance
- [ ] `@dtcg-formulas/builtins` — executable JS implementations for math built-ins (round, clamp, min, max, mix, modular-scale, shade/tint, fluid-size)
- [ ] `@dtcg-formulas/cli` — thin CLI over the resolver: `compile`, `lint` (preflight formula syntax + registry validation), `check` (dry-run with full diagnostic report)
- [ ] Diagnostics-first error model: codes, spans, hints, docs links
- [ ] JSON Schema for the `org.dtcg-formulas` extension, published from `@dtcg-formulas/spec`

## 0.3.0 — Integrations and contrast adapters

- [ ] Executable adapter packages for color/contrast: `@dtcg-formulas/adapter-leonardo`, `@dtcg-formulas/adapter-color-names`, `@dtcg-formulas/adapter-composite`, `@dtcg-formulas/adapter-optimal-foreground`, `@dtcg-formulas/adapter-material-shadow`
- [ ] `@dtcg-formulas/style-dictionary-plugin` — thin wrapper over the resolver (transitive preprocessor)
- [ ] Docs generator from `.module.scssdef` metadata (the `@dtcg-formulas/docs` package)

## 0.4.0+ — Expansion

- [ ] Remaining adapter packages (spacing scales, typography, motion)
- [ ] `@dtcg-formulas/terrazzo-plugin`
- [ ] Editor LSP backed by the published JSON Schema + diagnostic codes
- [ ] Revisit generator/recipe model for one-to-many derivation
- [ ] Structured extension metadata (`arguments`, `dependencies`) when warranted
- [ ] Align with DTCG token operations developments
- [ ] Consider formal expression grammar

See [Architecture / Public Readiness](/architecture/public-readiness) for the full analysis that informs this roadmap.
