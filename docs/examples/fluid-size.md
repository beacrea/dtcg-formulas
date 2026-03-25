# Example: Fluid Size

Viewport-responsive sizing via CSS `clamp()` generation. Inspired by [utopia.fyi](https://utopia.fyi/).

## The Definition

### `fluid-size.module.scssdef`

<<< @/../examples/fluid-size/fluid-size.module.scssdef{scss}

## How It Works

`fluid-size()` generates a CSS `clamp()` expression that scales linearly between a minimum and maximum size across a viewport range:

```
slope     = (max - min) / (maxVP - minVP)
intercept = min - slope * minVP
result    = clamp(min, intercept + slope * 100vw, max)
```

### Worked example

For `fluid-size(16px, 24px)` with defaults (320px–1200px viewport):

```
slope     = (24 - 16) / (1200 - 320) = 0.00909
intercept = 16 - 0.00909 * 320 = 13.09px
result    = clamp(16px, 0.909vw + 13.09px, 24px)
```

## Usage Examples

### Default viewport range

```scss
fluid-size(16px, 24px)
// clamp(16px, 0.909vw + 13.09px, 24px)
```

Uses 320px–1200px viewport range.

### Custom viewport range

```scss
fluid-size(14px, 18px, 375px, 1440px)
// clamp(14px, 0.376vw + 12.59px, 18px)
```

Narrower size range, wider viewport range.

### Token references

```scss
fluid-size({type.size.min}, {type.size.max})
// clamp(...)
```

Pass token refs — the resolver dereferences them to dimensions before computing.

## DTCG Extension

```json
{
  "type": {
    "size": {
      "body": {
        "$value": "clamp(16px, 0.909vw + 13.09px, 24px)",
        "$extensions": {
          "org.dtcg-formulas": {
            "formula": "fluid-size(16px, 24px)",
            "definition": "tokens/functions/fluid-size/fluid-size.module.scssdef#fluid-size"
          }
        }
      }
    }
  }
}
```

Note: no `$type` is needed here — `$value` is a CSS clamp expression string, not a DTCG typed value.
