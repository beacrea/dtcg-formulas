# Example: mix Built-in

The `mix` function blends two colors by a weighted ratio.

## Definition

<<< @/../examples/builtins/mix.module.scssdef{scss}

## Usage in Tokens

```json
{
  "color": {
    "surface": {
      "subtle": {
        "$value": "#f2f2f2",
        "$type": "color",
        "$extensions": {
          "org.dtcg-formulas": {
            "formula": "mix(white, {color.neutral.200}, 0.8)",
            "definition": "builtins#mix"
          }
        }
      }
    }
  }
}
```

## Behavior

| Expression | Result |
|-----------|--------|
| `mix(#ff0000, #0000ff, 0.5)` | `#800080` (equal blend) |
| `mix(white, black, 0.25)` | `#bfbfbf` (25% white) |
| `mix(white, black, 1.0)` | `white` (all first color) |
| `mix(white, black, 0.0)` | `black` (all second color) |
