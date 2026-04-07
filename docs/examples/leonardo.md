# Example: Leonardo Color

This example demonstrates contrast-aware color generation using [Adobe Leonardo](https://leonardocolor.io/), adapted for DTCG formula definitions.

## The Definition

### `color.module.scssdef`

<<< @/../examples/leonardo-color/color.module.scssdef{scss}

## How It Works

1. `leo()` takes a color family ref (or raw hex) and a target contrast ratio
2. Leonardo generates a color that hits the specified contrast against the background surface
3. Supports two modes:
   - **Family mode** — pass a `{palette.family.*}` ref; the resolver extracts the key color and default background from the family group
   - **Direct mode** — pass a raw color value with an explicit `$background`

## Usage Examples

### Minimal — family mode (2 args)

```scss
leo({palette.family.blue}, 4.5)   → #4f6afc
```

Family ref resolves key color + background automatically. Contrast target 4.5 meets WCAG AA for normal text.

### Background override (3 args)

```scss
leo({palette.family.blue}, 2.89, #1a1a2e)   → #8fa4ff
```

Dark background surface — lower contrast ratio is appropriate for large text or decorative elements.

### Maximal — direct mode (4 args)

```scss
leo(#4f6afc, 4.5, #ffffff, apca)   → #4f6afc
```

Raw hex input, explicit background, APCA contrast model. Useful when working outside the palette system.

## DTCG Extension

```json
{
  "color": {
    "action": {
      "primary": {
        "$value": "#4f6afc",
        "$type": "color",
        "$extensions": {
          "org.dtcg-formulas": {
            "formula": "leo({palette.family.blue}, 4.5)",
            "definition": "tokens/functions/leonardo-color/color.module.scssdef#leo"
          }
        }
      }
    }
  }
}
```

## Contrast Models

| Model | Description | When to use |
|-------|-------------|-------------|
| `apca` | Advanced Perceptual Contrast Algorithm (default) | Perceptually accurate contrast — accounts for Helmholtz–Kohlrausch effect on saturated colors |
| `wcag2` | WCAG 2.x luminance contrast ratio | Legacy compliance, achromatic-only contexts |
| `wcag3` | WCAG 3 draft algorithm | Experimental — tracks W3C draft |

> **Why APCA is the default**: WCAG2's luminance model ignores chromaticity, producing systematically wrong contrast predictions for saturated midtone colors (blue, red, green 400-700 range). APCA accounts for the Helmholtz-Kohlrausch effect — saturated colors appear darker than their luminance suggests — and produces perceptually correct text color selections. See ADR-001 in DSYS-418.
