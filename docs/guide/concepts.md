# Concepts

Before writing formulas, it helps to have a shared mental model for three things: how DTCG tokens work, where formulas fit inside them, and why this library is structured the way it is.

## DTCG tokens in 60 seconds

A **design token** in [DTCG](https://www.designtokens.org/tr/drafts/format/) is a JSON object with at least a `$value`, and optionally a `$type`, `$description`, and `$extensions`:

```json
{
  "shape": {
    "radius": {
      "button": {
        "$type": "dimension",
        "$value": "8px"
      }
    }
  }
}
```

Tokens can reference other tokens with `{path.to.token}` syntax:

```json
{
  "$type": "dimension",
  "$value": "{shape.radius.button}"
}
```

DTCG tools are expected to resolve references so that the final `$value` is always a concrete, standards-compliant value. The DTCG spec itself does **not** define a way to compute derived values — e.g. "this radius should be the button font size times a ratio." That's the gap `dtcg-formulas` fills.

## Why formulas?

Teams that derive tokens from rules rather than hard-coded values end up in one of three places:

1. **Hidden in proprietary tooling.** The rule only exists inside a Figma plugin or a design-ops script. It's not portable.
2. **Encoded in ad hoc scripts.** A Node script builds one version of `tokens.json` from a source-of-truth elsewhere. The formula is lost at the boundary.
3. **Collapsed into resolved values.** The rule ran once, the number was written down, and now nobody remembers where `10px` came from.

`dtcg-formulas` lets you keep the derivation **inside the token itself**, as metadata under the `org.dtcg-formulas` extension, without breaking DTCG compliance.

## How a formula is stored

The canonical `$value` stays resolved and standards-compliant. The formula lives under `$extensions.org.dtcg-formulas`:

```json
{
  "shape": {
    "radius": {
      "button": {
        "$type": "dimension",
        "$value": "10px",
        "$extensions": {
          "org.dtcg-formulas": {
            "formula": "radius({typography.scale.12}, {shape.ratio.button})",
            "definition": "tokens/functions/radius.module.scssdef#radius"
          }
        }
      }
    }
  }
}
```

Three things to note:

- **`$value` is authoritative.** Any DTCG-aware tool can read this file without knowing anything about formulas.
- **`formula` is a call string.** Token references use the same `{dotted.path}` syntax as DTCG aliases.
- **`definition` is a file pointer.** It points at a `.module.scssdef` function the `formula` is calling.

## What a `.module.scssdef` file is

A `.module.scssdef` file is a **Sass-inspired definition language** — not executable Sass — that declares a reusable formula:

```scss
---
module: radius
title: Shape Radius
summary: Proportional radius derived from size and ratio.
---

/// @name radius
/// @summary Compute proportional radius from size and ratio.
/// @param $size <dimension|ref> Base size reference.
/// @param $ratio <number|ref> Unitless ratio in (0, 1].
/// @returns <dimension>
@function radius($size, $ratio) {
  @return $size * $ratio;
}
```

Three layers, all meaningful:

1. **Frontmatter** (YAML) — module-level metadata: name, title, summary, category, tags.
2. **Doc comments** (`///`) — SassDoc-style tags that document the function: `@name`, `@summary`, `@param`, `@returns`, `@example`, `@constraints`, `@since`.
3. **Signature + return** — a Sass-like declaration that names the parameters, their defaults, and a symbolic `@return` expression.

The library parses these into a typed AST. The return expression is treated as metadata today; in 0.2.0, adapter packages will pair each definition with a JS implementation that the resolver can execute.

## The three layers, from authoring to build

`dtcg-formulas` cleanly separates three concerns, each backed by its own package:

| Layer | Package | What it does |
|-------|---------|--------------|
| **Definition** | `@dtcg-formulas/parser` | Parses `.module.scssdef` files into an AST |
| **Registry** | `@dtcg-formulas/registry` | Holds function declarations; lookup by `path#name` |
| **Resolution** | `@dtcg-formulas/resolver` *(0.2.0)* | Walks a DTCG token tree, resolves refs, invokes functions, writes `$value` |

This separation matters because it keeps the authoring surface (metadata) independent from the execution surface (adapters). The same definition can be consumed by a CLI, a Style Dictionary plugin, or editor tooling without any of them re-implementing the parse-and-validate path.

## Built-ins vs. adapters

Two kinds of functions exist in the registry:

- **Built-ins** — general-purpose, library-maintained functions that ship pre-registered. Math and basic color operations: `round`, `clamp`, `min`, `max`, `mix`, `modular-scale`, `shade`, `tint`, `fluid-size`, `composite`.
- **Adapters** — domain-specific functions that wrap an external library or algorithm. Contrast-aware color (`leo()` wraps Adobe Leonardo), named colors (`color-name()` wraps meodai/color-names), Material shadows, and so on.

The distinction is more about maintenance than capability: built-ins evolve with the library itself; adapters often pin to an external version and live in their own packages (0.3.0+).

## DTCG compliance rules

- **Resolved `$value` is canonical.** After a build, every token must have a concrete `$value`. The formula extension is optional metadata.
- **Extensions are vendor-namespaced.** All formula metadata lives under `$extensions.org.dtcg-formulas`. The `org.` prefix is backed by the `dtcg-formulas.org` domain.
- **Output values must remain DTCG-compliant.** A token typed `dimension` must emit a valid DTCG dimension value. The formula layer may be expressive internally, but what lands in `$value` plays by DTCG's rules.

## What comes next

If you're ready to write your first formula, head to [Authoring a Formula](./authoring-a-formula). If you want to see how this plugs into an existing build, see [Integrations](./integrations). If you're curious about the architectural direction, the full analysis is in [Architecture / Public Readiness](/architecture/public-readiness).
