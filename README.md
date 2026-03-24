# dtcg-formulas

A documentation-first, pluggable formula layer for [DTCG](https://tr.designtokens.org/format/) design tokens.

## What this is

`dtcg-formulas` provides:

1. **`.module.scssdef`** — a Sass-inspired definition language for reusable token functions
2. **`org.dtcg-formulas`** — a DTCG `$extensions` convention for preserving computed-value provenance
3. **A function registry and resolver** — pluggable resolution for scalar token formulas

## What this is not

- Not executable Sass
- Not a replacement for DTCG
- Not a general-purpose expression engine

## Status

**Phase 0 — Specification only.** Parser, registry, and resolver are stubs.

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
        "syntax": "scssdef@0.1",
        "definition": "tokens/functions/radius.module.scssdef#radius",
        "call": "radius({typography.scale.typescale-15}, {shape.ratio.button}, 1px)"
      }
    }
  }
}
```

`$value` stays resolved and DTCG-compliant. The extension preserves how it was computed.

## Packages

| Package | Status | Description |
|---------|--------|-------------|
| `packages/spec` | Draft | Specifications (.module.scssdef, extension, registry) |
| `packages/parser` | Stub | .module.scssdef parser |
| `packages/registry` | Stub | Function registry |
| `packages/resolver` | Stub | Formula resolver |
| `packages/docs` | Stub | Documentation generator |
| `packages/style-dictionary-plugin` | Stub | Style Dictionary integration |

## Examples

| Example | Description |
|---------|-------------|
| `examples/radius/` | `snap()` and `radius()` functions with full .module.scssdef |
| `examples/spacing/` | Stub |
| `examples/leonardo-color/` | Stub |

## Docs

- [Project Brief](docs/vision.md)
- [Roadmap](docs/roadmap.md)
- [FAQ](docs/faq.md)

## License

MIT
