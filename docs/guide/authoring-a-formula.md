# Authoring a Formula

This walkthrough takes you from zero to a working formula: write a `.module.scssdef`, document it, reference it from a DTCG token, and preview how it will be linted and resolved by the upcoming compiler.

It uses a small but realistic example — a `snap-to-grid` function that rounds a value to the nearest grid step.

## 1. Decide what you're defining

Before writing anything, answer three questions:

1. **Is it a scalar function?** One call, one value. That's what v0 supports. Generators that emit multiple tokens from one call are out of scope for now.
2. **Is it pure?** Given the same inputs, always returns the same output. No I/O, no global state, no randomness.
3. **Does a built-in already cover it?** See the [Functions](/examples/) list. Prefer reusing `clamp()`, `mix()`, or `modular-scale()` over writing a new one.

If the answer is yes/yes/no, proceed.

## 2. Write the definition file

Create `tokens/functions/grid/grid.module.scssdef` in your project:

```scss
---
module: grid
title: Grid Utilities
summary: Snapping and alignment helpers for grid-aligned token derivation.
category: foundations
since: 0.1.0
tags: [grid, spacing, rounding]
---

/// @name snap-to-grid
/// @summary Snap a dimension to the nearest grid step.
/// @description Rounds `$value` to the nearest multiple of `$step`. Useful for
///   deriving spacing tokens that must fall on a consistent grid.
/// @param $value <dimension|ref> The value to snap.
/// @param $step <dimension|ref> The grid step.
/// @returns <dimension>
/// @constraints $step > 0
/// @example snap-to-grid(15.6px, 4px) → 16px
/// @example snap-to-grid({spacing.raw.small}, {grid.step}) → 8px
/// @since 0.1.0
@function snap-to-grid($value, $step) {
  @return round($value, $step, nearest);
}
```

Three things to get right:

- **Frontmatter is required.** `module`, `title`, `summary` are mandatory. The parser rejects files that omit them.
- **Every parameter needs a `@param` doc.** The parser merges doc params with the signature; a missing doc is an error.
- **`@returns` is required.** This is the declared return type the linter will check against when the formula is called.

## 3. Parse and register it

At build time, you load and register the file:

```ts
import { parse } from '@dtcg-formulas/parser';
import { createRegistry } from '@dtcg-formulas/registry';
import { readFileSync } from 'node:fs';

const registry = createRegistry();
// round/clamp/min/max are pre-registered as built-ins

const src = readFileSync('tokens/functions/grid/grid.module.scssdef', 'utf-8');
const mod = parse(src);

for (const fn of mod.functions) {
  registry.register('tokens/functions/grid/grid.module.scssdef', fn.name, fn);
}

// Now resolvable:
registry.resolve('tokens/functions/grid/grid.module.scssdef#snap-to-grid');
```

You now have a registered, documented, portable formula definition.

## 4. Reference it from a DTCG token

Edit your `tokens.json` to derive a value via the formula:

```json
{
  "grid": {
    "step": { "$type": "dimension", "$value": "4px" }
  },
  "spacing": {
    "raw": {
      "small": { "$type": "dimension", "$value": "15.6px" }
    },
    "snapped": {
      "small": {
        "$type": "dimension",
        "$value": "16px",
        "$extensions": {
          "org.dtcg-formulas": {
            "formula": "snap-to-grid({spacing.raw.small}, {grid.step})",
            "definition": "tokens/functions/grid/grid.module.scssdef#snap-to-grid"
          }
        }
      }
    }
  }
}
```

Note that `$value` is already `16px`. DTCG compliance is maintained even if no consumer knows what `dtcg-formulas` is — the file is a valid DTCG token set today.

## 5. Preflight (coming in 0.2.0)

Once the `@dtcg-formulas/cli` package lands, you'll be able to lint the file before running a full compile:

```bash
npx dtcg-formulas lint tokens.json
```

`lint` validates — without executing any formula:

- The JSON parses and the overall shape is valid DTCG.
- Every `org.dtcg-formulas` entry is well-formed (`formula`, `definition`, and optional `syntax` present).
- Every `definition` ref resolves to a registered function.
- The `formula` call string parses.
- The call's arity and argument shapes match the registered declaration.
- Every `{path.to.token}` reference in the call exists in the token tree.
- No cycles exist in the reference graph.

Preflight is fast, deterministic, and requires no adapter packages. It's what you run in CI on every PR. See [Troubleshooting](./troubleshooting) for the full diagnostic code reference.

## 6. Compile (coming in 0.2.0)

Once you're satisfied the tree is well-formed:

```bash
npx dtcg-formulas compile tokens.json -o tokens.resolved.json
```

`compile` walks the tree, evaluates every `org.dtcg-formulas` call against the registered implementations, writes the result to `$value`, and leaves the provenance extension intact. The output is a DTCG-compliant file where every computed `$value` matches its formula.

For adapter functions that depend on external engines (Leonardo, material-shadow), install the matching adapter package — e.g. `npm install @dtcg-formulas/adapter-leonardo` — before running `compile`. The resolver loads adapters from the registry.

## 7. Check your work before 0.2.0 ships

Until the CLI lands, you can still validate everything the library can validate today:

- Parse: `parse(source)` throws a readable error for malformed files.
- Register: `registry.register(...)` throws on duplicates.
- Resolve: `registry.resolve(ref)` returns `null` for unknown refs, so you can spot typos before they become runtime bugs.

Write a small `validate.mjs` script in your repo that parses every `.module.scssdef` file, registers them, and iterates over every `$extensions.org.dtcg-formulas` entry in your token tree to assert the `definition` resolves. That's a preview of what `lint` will do out of the box.

## Next steps

- [Integrations](./integrations) — wire this into Style Dictionary, Terrazzo, or a bare JSON pipeline.
- [Troubleshooting](./troubleshooting) — common failure modes and their fixes.
- [.module.scssdef spec](/spec/scssdef) — the full reference for the definition format.
