# Example: Shade & Tint

Perceptually uniform color darkening and lightening via OKLCH, backed by [culori](https://culorijs.org/).

## The Definition

### `shade-tint.module.scssdef`

<<< @/../examples/shade-tint/shade-tint.module.scssdef{scss}

## How It Works

Both functions adjust lightness in OKLCH color space rather than mixing with black/white in sRGB:

- **`shade()`** — reduces the L (lightness) channel toward 0 (black)
- **`tint()`** — increases the L channel toward 1 (white)

### Why not just `mix(color, black)`?

RGB mixing shifts hue and saturation as a side effect. A blue mixed with black in sRGB will drift toward purple. OKLCH isolates lightness from chroma and hue, so shading a blue produces a darker blue — not a different color.

## Usage Examples

### Shade — darken

```scss
shade(#4f6afc, 0.3)               // #2a4ab1
shade({color.blue.500}, 0.5)       // #1a2a80
shade(#ff6347, 0)                  // #ff6347 (unchanged)
```

### Tint — lighten

```scss
tint(#4f6afc, 0.3)                 // #8fa4ff
tint({color.blue.500}, 0.5)        // #b8c8ff
tint(#ff6347, 0)                   // #ff6347 (unchanged)
```

Amount of `0` returns the input unchanged. Amount of `1` returns pure black (shade) or white (tint).

## DTCG Extension

```json
{
  "color": {
    "action": {
      "hover": {
        "$value": "#2a4ab1",
        "$type": "color",
        "$extensions": {
          "org.dtcg-formulas": {
            "formula": "shade({color.action.primary}, 0.3)",
            "definition": "tokens/functions/shade-tint/shade-tint.module.scssdef#shade"
          }
        }
      }
    }
  }
}
```
