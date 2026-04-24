# Example: Composite

Alpha compositing adapter for resolving translucent colors against an opaque canvas. Use it when a semantic color applies an alpha modifier to a palette color and you need the effective visible color for downstream computation — most commonly, feeding a contrast selector like `leo()` or `optimal-foreground()`.

## The Definition

### `composite.module.scssdef`

<<< @/../examples/compositing/composite.module.scssdef{scss}

## How It Works

1. `composite()` takes a translucent source color, an alpha in `[0, 1]`, and an opaque canvas.
2. Returns the **fully opaque** result of the Porter-Duff *over* operator: `mix($color, $canvas, $alpha)`.
3. The result is what the eye actually sees — the translucent color as it renders on that specific canvas.

Because the result is opaque, it can be passed directly into contrast algorithms (APCA, WCAG 2) that expect solid colors.

## Usage Examples

### Low-alpha overlay on a light canvas

```scss
composite(#767676, 0.1, #e6e6e6)   // → #dbdbdb
```

A 10% gray veil over an off-white surface settles just slightly darker than the canvas.

### Low-alpha overlay on a dark canvas

```scss
composite(#c8c8c8, 0.05, #111111)   // → #1a1a1a
```

A 5% light gray over near-black barely lifts the canvas.

### Composing then contrasting (the common pattern)

```scss
leo(composite({palette.gray.500}, 0.1, {semantic.surface.canvas}), optimal-foreground)
```

First composite the translucent semantic background over the theme canvas, then let `leo()` pick the APCA-optimal foreground for that effective color. Pairing `composite()` with `optimal-foreground()` is the cleanest equivalent that uses only explicit references:

```scss
optimal-foreground(
  composite({palette.gray.500}, 0.1, {semantic.surface.canvas}),
  {palette.absolute.white},
  {palette.absolute.black}
)
```

## DTCG Extension

```json
{
  "semantic": {
    "surface": {
      "muted-effective": {
        "$value": "#dbdbdb",
        "$type": "color",
        "$extensions": {
          "org.dtcg-formulas": {
            "formula": "composite({palette.gray.500}, 0.1, {semantic.surface.canvas})",
            "definition": "tokens/functions/compositing/composite.module.scssdef#composite"
          }
        }
      }
    }
  }
}
```

The token's `$value` remains a plain DTCG color string; the provenance in `$extensions.org.dtcg-formulas` preserves how it was derived.

## See Also

- [Leonardo Color](./leonardo.md) — use `composite()` output as the background for contrast-aware palette generation.
- [Optimal Foreground](./optimal-foreground.md) — the companion adapter for picking an accessible foreground against a composited surface.
