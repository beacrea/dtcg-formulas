# dtcg-formulas

[![@dtcg-formulas/parser](https://img.shields.io/npm/v/@dtcg-formulas/parser?label=%40dtcg-formulas%2Fparser)](https://www.npmjs.com/package/@dtcg-formulas/parser)
[![@dtcg-formulas/registry](https://img.shields.io/npm/v/@dtcg-formulas/registry?label=%40dtcg-formulas%2Fregistry)](https://www.npmjs.com/package/@dtcg-formulas/registry)
[![@dtcg-formulas/spec](https://img.shields.io/npm/v/@dtcg-formulas/spec?label=%40dtcg-formulas%2Fspec)](https://www.npmjs.com/package/@dtcg-formulas/spec)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

A documentation-first, pluggable formula layer for [DTCG](https://www.designtokens.org/tr/drafts/format/) design tokens.

Define reusable token functions once, reference them from DTCG `$extensions`, and let a build step resolve the compute as each token's `$value`. The pipeline is tool-agnostic at its core, with first-class integrations for Style Dictionary, Terrazzo, and bare JSON builds.

## What this is

1. **`.module.scssdef`** — a Sass-inspired definition language for reusable token functions
2. **`org.dtcg-formulas`** — a DTCG `$extensions` convention for preserving computed-value provenance
3. **A function registry and resolver** — pluggable resolution for scalar token formulas

## What this is not

- Not executable Sass
- Not a replacement for DTCG
- Not a general-purpose expression engine

## Documentation

**[dtcg-formulas.org](https://dtcg-formulas.org)**

- [Concepts](https://dtcg-formulas.org/guide/concepts) — DTCG recap, why formulas, how this fits
- [Authoring a Formula](https://dtcg-formulas.org/guide/authoring-a-formula) — walkthrough
- [Integrations](https://dtcg-formulas.org/guide/integrations) — bare JSON, Style Dictionary, Terrazzo
- [Architecture / Public Readiness](https://dtcg-formulas.org/architecture/public-readiness) — design rationale and phased roadmap

## Status

**0.1.0 released on npm.** Parser, registry, and spec packages are publishable and installable today as the metadata foundation. The resolver (executable compute), CLI (`compile` / `lint` / `check`), and executable adapters land in 0.2.0–0.3.0. See the [Roadmap](https://dtcg-formulas.org/guide/roadmap) for the full picture.

## Pipeline at a glance

```
 author .module.scssdef  ──▶  reference in DTCG $extensions  ──▶  lint  ──▶  compile
    (definition layer)          (token layer)                   (preflight)   (writes $value)
```

Today: author and reference work. Lint and compile land in 0.2.0 alongside `@dtcg-formulas/resolver` and `@dtcg-formulas/cli`.

## Install

```bash
npm install @dtcg-formulas/parser @dtcg-formulas/registry
```

## Quick look

### Define a function (`math.module.scssdef`)

```scss
---
module: math
title: Math Utilities
summary: General-purpose snapping and rounding functions.
---

/// @name snap
/// @summary Snap a value to a step.
/// @param $value <number|dimension|ref> The value to snap.
/// @param $step <number|dimension|ref> The snap interval.
/// @param $mode <nearest|floor|ceil> The rounding mode.
/// @returns <number|dimension>
@function snap($value, $step: 1px, $mode: nearest) {
  @return round($value, $step, $mode);
}
```

### Reference it in a DTCG token

```json
{
  "shape": {
    "$type": "dimension",
    "$value": "12px",
    "$extensions": {
      "org.dtcg-formulas": {
        "formula": "radius({typography.scale.typescale-15}, {shape.ratio.button}, 1px)",
        "definition": "tokens/functions/radius.module.scssdef#radius"
      }
    }
  }
}
```

`$value` stays resolved and DTCG-compliant. The extension preserves how it was computed.

## Packages

| Package | Status | Description |
|---------|--------|-------------|
| `@dtcg-formulas/parser` | **0.1.0** (released) | `.module.scssdef` parser |
| `@dtcg-formulas/registry` | **0.1.0** (released) | Function registry |
| `@dtcg-formulas/spec` | **0.1.0** (released) | Specifications (`.module.scssdef`, extension, registry) |
| `@dtcg-formulas/resolver` | 0.2.0 | Formula resolver (pure core) |
| `@dtcg-formulas/builtins` | 0.2.0 | Executable JS implementations for math built-ins |
| `@dtcg-formulas/cli` | 0.2.0 | `compile`, `lint`, `check` verbs |
| `@dtcg-formulas/adapter-*` | 0.3.0 | Executable adapter packages (leonardo, color-names, composite, etc.) |
| `@dtcg-formulas/style-dictionary-plugin` | 0.3.0 | Style Dictionary 4.x integration |
| `@dtcg-formulas/docs` | 0.3.0 | Docs generator from `.module.scssdef` metadata |
| `@dtcg-formulas/terrazzo-plugin` | 0.4.0+ | Terrazzo integration |

See the docs site's [Functions](https://dtcg-formulas.org/examples/) page for the full catalog of built-ins and adapters.

## Examples

| Example | Description |
|---------|-------------|
| `examples/radius/` | `snap()` and `radius()` functions |
| `examples/builtins/` | `clamp`, `mix`, `modular-scale` built-ins |
| `examples/leonardo-color/` | Leonardo contrast-aware color generation |
| `examples/compositing/` | Porter-Duff alpha compositing |
| `examples/contrast/` | APCA-based optimal foreground selection |
| `examples/color-names/` | Named color lookup |
| `examples/shade-tint/` | Shade and tint derivation |
| `examples/fluid-size/` | Fluid responsive sizing |
| `examples/material-shadow/` | Material elevation shadows |
| `examples/outline-radius/` | Outline corner radius compensation |

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the development loop, how to add a formula, and the release process.

## License

MIT
