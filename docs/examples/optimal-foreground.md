# Example: Optimal Foreground

Pick the candidate foreground color with the higher APCA perceptual contrast against a given background. This is the adapter for deriving `on_*` semantic tokens — the one that answers "should this surface use black text or white text?" without guessing.

## The Definition

### `optimal-foreground.module.scssdef`

<<< @/../examples/contrast/optimal-foreground.module.scssdef{scss}

## How It Works

1. `optimal-foreground()` takes a background and two candidate foregrounds (typically absolute white and absolute black).
2. Computes APCA Lc for each candidate against the background.
3. Returns whichever candidate has the greater `|Lc|` — the one the eye will actually read more easily.

APCA (the Accessible Perceptual Contrast Algorithm) accounts for the Helmholtz–Kohlrausch effect, so it handles saturated chromatic backgrounds more faithfully than WCAG 2's luminance ratio.

## When To Use It vs `leo()`

- **`optimal-foreground()`** is a narrow, explicit binary choice: light candidate or dark candidate against a known background. Everything it needs is in its arguments — a consumer can recompute the value from the formula alone.
- **`leo()`** is the full Leonardo palette engine. Use it when you want a whole contrast-aware palette or a target Lc value, not just "which of these two is more readable."

If you're deriving `on_` tokens for a two-tone foreground system (black-on-light, white-on-dark), `optimal-foreground()` is usually the right call.

## Usage Examples

### Light background → dark foreground

```scss
optimal-foreground({palette.gray.50}, {palette.absolute.white}, {palette.absolute.black})
// → {palette.absolute.black}
```

### Dark background → light foreground

```scss
optimal-foreground({palette.gray.700}, {palette.absolute.white}, {palette.absolute.black})
// → {palette.absolute.white}
```

### Composited background

```scss
optimal-foreground(
  composite({palette.gray.500}, 0.1, {semantic.surface.canvas}),
  {palette.absolute.white},
  {palette.absolute.black}
)
// → {palette.absolute.black}
```

Feed the result of `composite()` in directly — the contrast is computed against the opaque visible color, not the underlying palette entry.

### Mixed background

```scss
optimal-foreground(
  mix({palette.red.400}, {palette.orange.400}, 0.25),
  {palette.absolute.white},
  {palette.absolute.black}
)
// → {palette.absolute.black}
```

## DTCG Extension

```json
{
  "semantic": {
    "surface": {
      "muted": {
        "$type": "color",
        "$value": "#f5f5f5"
      },
      "on-muted": {
        "$type": "color",
        "$value": "#000000",
        "$extensions": {
          "org.dtcg-formulas": {
            "formula": "optimal-foreground({semantic.surface.muted}, {palette.absolute.white}, {palette.absolute.black})",
            "definition": "tokens/functions/contrast/optimal-foreground.module.scssdef#optimal-foreground"
          }
        }
      }
    }
  }
}
```

## See Also

- [Leonardo Color](./leonardo.md) — full palette generation when a single binary choice isn't enough.
- [Composite](./composite.md) — resolve a translucent background to its opaque visible color before picking a foreground.
