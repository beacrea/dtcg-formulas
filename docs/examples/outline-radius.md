# Example: Outline Radius

Compute the outer-edge radius of an offset CSS outline's visual silhouette. Use this to drive the corner radius of a compensating rectangle in design tools (most commonly Figma) that cannot natively render `outline-offset`.

## The Definition

### `outline-radius.module.scssdef`

<<< @/../examples/outline-radius/outline-radius.module.scssdef{scss}

## How It Works

1. `outline-radius()` takes the inner element's `border-radius`, the `outline-offset`, and the `outline-width`.
2. Returns `$inner + $offset + $width` — the outer radius the browser renders when the outline wraps the offset inner corner.

Modern browsers compute this automatically; the formula exists so **design tools** can match the exact silhouette by drawing a compensating rounded rectangle around the element. Front-end consumers should ignore the resulting token — the browser handles it.

## Usage Examples

### Standard focus ring

```scss
outline-radius(20px, 4px, 2px)   // → 26px
```

A 20px inner radius with a 4px offset and 2px outline ring renders with a 26px outer radius.

### Small control

```scss
outline-radius(8px, 4px, 2px)   // → 14px
```

### Sharp-cornered element

```scss
outline-radius(0px, 4px, 2px)   // → 6px
```

Even with zero inner radius, the offset outline still renders rounded.

## DTCG Extension

```json
{
  "focus-ring": {
    "outer-radius": {
      "$value": "26px",
      "$type": "dimension",
      "$extensions": {
        "org.dtcg-formulas": {
          "formula": "outline-radius({shape.radius.button}, {focus-ring.offset}, {focus-ring.width})",
          "definition": "tokens/functions/outline-radius/outline-radius.module.scssdef#outline-radius"
        }
      }
    }
  }
}
```

## See Also

- [Radius + Shape](./radius.md) — the base radius adapter. `outline-radius()` wraps it for outline compensation; `radius()` is for the element itself.
