# Example: Color Names

This example demonstrates human-readable color naming using the [meodai/color-names](https://github.com/meodai/color-names) dataset (30 000+ named colors), adapted for DTCG formula definitions.

## The Definition

### `color-names.module.scssdef`

<<< @/../examples/color-names/color-names.module.scssdef{scss}

## How It Works

1. `color-name()` takes a hex color value or a token reference that resolves to a color
2. The adapter performs a nearest-neighbor lookup against the color-names dataset
3. Returns the closest human-readable name as a plain string

This is useful for generating accessible labels, semantic token aliases, or documentation annotations from raw hex values.

## Usage Examples

### Direct hex

```scss
color-name(#ff6347)   // Tomato
```

Standard CSS named color — exact match in the dataset.

### Novelty hex

```scss
color-name(#bada55)   // BadAss
```

The dataset includes community-submitted names for well-known hex values.

### Token reference

```scss
color-name({palette.brand.primary})   // Ultramarine
```

Pass a token ref — the resolver dereferences it to a hex value before lookup.

## DTCG Extension

```json
{
  "color": {
    "brand": {
      "primary-name": {
        "$value": "Ultramarine",
        "$extensions": {
          "org.dtcg-formulas": {
            "formula": "color-name({palette.brand.primary})",
            "definition": "tokens/functions/color-names/color-names.module.scssdef#color-name"
          }
        }
      }
    }
  }
}
```

Note: no `$type` is needed here — `$value` is a plain string, not a DTCG typed value.

## Dataset Reference

The [meodai/color-names](https://github.com/meodai/color-names) repository provides:

- **30 000+** crowd-sourced color names
- Multiple dataset variants (best-of, short names, full corpus)
- Nearest-color matching via perceptual distance (Delta E)
- Available as npm package (`color-name-list`) or raw JSON
