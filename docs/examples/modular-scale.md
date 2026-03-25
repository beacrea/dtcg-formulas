# Example: Modular Scale

Built-in function for computing values on a modular (geometric) typographic scale.

## The Definition

### `modular-scale.module.scssdef`

<<< @/../examples/builtins/modular-scale.module.scssdef{scss}

## How It Works

1. `modular-scale()` takes a step, a base value, and a ratio
2. Returns `$base * pow($ratio, $step)` — a geometric progression
3. Step 0 = base, positive steps scale up, negative steps scale down

This is the foundation for consistent typographic and spacing scales.

## Common Ratios

| Name | Ratio | Interval |
|------|-------|----------|
| Minor second | 1.067 | 15:16 |
| Major second | 1.125 | 8:9 |
| Minor third | 1.2 | 5:6 |
| **Major third** | **1.25** | **4:5** (default) |
| Perfect fourth | 1.333 | 3:4 |
| Perfect fifth | 1.5 | 2:3 |
| Golden ratio | 1.618 | 1:phi |

## Usage Examples

### Base value (step 0)

```scss
modular-scale(0, 16px, 1.25)   // 16px
```

Step 0 always returns the base.

### Scale up

```scss
modular-scale(3, 16px, 1.25)   // 31.25px
```

Three steps up the major third scale.

### Scale down

```scss
modular-scale(-1, 16px, 1.25)   // 12.8px
```

Negative steps produce smaller values.

## DTCG Extension

```json
{
  "type": {
    "size": {
      "lg": {
        "$value": "31.25px",
        "$type": "dimension",
        "$extensions": {
          "org.dtcg-formulas": {
            "formula": "modular-scale(3, 16px, 1.25)",
            "definition": "tokens/functions/builtins/modular-scale.module.scssdef#modular-scale"
          }
        }
      }
    }
  }
}
```
