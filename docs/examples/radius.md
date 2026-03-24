# Example: Radius + Shape Tokens

This example demonstrates deriving button border-radius tokens from font sizes using a proportional ratio.

## The Definitions

### `math.module.scssdef`

<<< @/../examples/radius/math.module.scssdef{scss}

### `radius.module.scssdef`

<<< @/../examples/radius/radius.module.scssdef{scss}

## How It Works

1. `radius()` takes a font size and multiplies by a ratio (e.g., 0.6)
2. The result is snapped to a 1px grid via `snap()`
3. `snap()` delegates to the built-in `round()` function

## Token Output

With `shape.ratio.button = 0.6` and typescale base 16px / ratio 1.067:

| Size | Font px | Shape (radius) | Slot-min-size |
|------|---------|-----------------|---------------|
| xs   | 14.05   | 8px             | 17px          |
| sm   | 16.00   | 10px            | 20px          |
| md   | 19.44   | 12px            | 24px          |
| lg   | 23.61   | 14px            | 29px          |
| xl   | 28.68   | 17px            | 35px          |
| 2xl  | 32.65   | 20px            | 40px          |
| 3xl  | 39.67   | 24px            | 48px          |

## DTCG Extension

```json
{
  "shape": {
    "button": {
      "md": {
        "$value": "12px",
        "$type": "dimension",
        "$extensions": {
          "org.dtcg-formulas": {
            "formula": "radius({typography.scale.15}, {shape.ratio.button})",
            "definition": "tokens/functions/radius.module.scssdef#radius"
          }
        }
      }
    }
  }
}
```
