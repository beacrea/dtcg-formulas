# What is dtcg-formulas?

`dtcg-formulas` provides a Sass-like definition language and a DTCG extension convention for documenting, preserving, and resolving computed token formulas while keeping `$value` resolved and standards-compliant.

## The Problem

DTCG provides a strong interoperable format for resolved token values, but it does not currently standardize how computed token formulas should be defined, documented, preserved, or exchanged.

In practice, teams want to:

- **Derive tokens from formulas** rather than hardcoding every value
- **Preserve the formula** that produced a resolved token value
- **Generate documentation** for computed token functions
- **Share formula definitions** across tools and pipelines
- **Support custom domains** beyond basic math (contrast-aware color, spacing scales)

## The Solution

A design token should be able to contain:

- A **resolved DTCG `$value`** (always present, always compliant)
- An optional **formula provenance extension** (under `$extensions`)
- A reference to a **reusable function definition** (in `.module.scssdef` files)
- Enough metadata to **regenerate, validate, and document** the computed value

## Architecture

```
.module.scssdef files     DTCG token files
  (definitions)           ($value + $extensions)
       │                         │
       ▼                         ▼
   ┌────────┐             ┌────────────┐
   │ Parser │             │  Registry  │
   └───┬────┘             └─────┬──────┘
       │                        │
       └───────────┬────────────┘
                   ▼
              ┌──────────┐
              │ Resolver │  (Phase 2)
              └──────────┘
```

## Quick Example

A button's border radius derived from its font size:

```json
{
  "$value": "10px",
  "$type": "dimension",
  "$extensions": {
    "org.dtcg-formulas": {
      "formula": "radius({typography.scale.12}, {shape.ratio.button})",
      "definition": "tokens/functions/radius.module.scssdef#radius"
    }
  }
}
```

The definition file:

```scss
/// @name radius
/// @summary Compute proportional radius from size and ratio.
/// @param $size <dimension|ref> Base size reference.
/// @param $ratio <number|ref> Unitless ratio in (0, 1].
/// @returns <dimension>
@function radius($size, $ratio, $step: 1px, $mode: nearest) {
  @return snap($size * $ratio, $step, $mode);
}
```
