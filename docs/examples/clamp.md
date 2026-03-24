# Example: clamp Built-in

The `clamp` function constrains a value between minimum and maximum bounds — a direct mapping to CSS `clamp()`.

## Definition

<<< @/../examples/builtins/clamp.module.scssdef{scss}

## Usage in Tokens

```json
{
  "spacing": {
    "responsive": {
      "$value": "16px",
      "$type": "dimension",
      "$extensions": {
        "org.dtcg-formulas": {
          "formula": "clamp(8px, {spacing.base}, 24px)",
          "definition": "builtins#clamp"
        }
      }
    }
  }
}
```

## Behavior

| Expression | Result |
|-----------|--------|
| `clamp(8px, 12px, 24px)` | `12px` (within bounds) |
| `clamp(8px, 4px, 24px)` | `8px` (clamped to min) |
| `clamp(8px, 32px, 24px)` | `24px` (clamped to max) |
