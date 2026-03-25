# Example: Material Shadow

Elevation-to-shadow mapping following [Material Design 3](https://m3.material.io/styles/elevation/overview).

## The Definition

### `material-shadow.module.scssdef`

<<< @/../examples/material-shadow/material-shadow.module.scssdef{scss}

## How It Works

1. `material-shadow()` maps a Material elevation level (0–5) to a CSS `box-shadow` value
2. Each level corresponds to a specific dp offset in the M3 spec
3. Shadows use a two-layer model: key shadow (directional) + ambient shadow (omnidirectional)
4. The `$color` parameter controls the shadow base color with adjustable opacity per layer

## Elevation Levels

| Level | dp | Usage | Shadow |
|-------|-----|-------|--------|
| 0 | 0 | Surface | `none` |
| 1 | 1 | Cards, navigation | Key + ambient, small offset |
| 2 | 3 | Menus, FABs | Key + ambient, medium offset |
| 3 | 6 | Snackbars | Key + ambient, larger offset |
| 4 | 8 | Drawers, sheets | Key + ambient, large offset |
| 5 | 12 | Dialogs, modals | Key + ambient, largest offset |

## Usage Examples

### No elevation

```scss
material-shadow(0)   // none
```

Level 0 is a flat surface with no shadow.

### Medium elevation

```scss
material-shadow(2)
// 0 1px 2px rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15)
```

Level 2 — suitable for menus and FABs.

### Custom shadow color

```scss
material-shadow(4, {color.shadow.base})
// 0 2px 3px rgba(...), 0 6px 10px 4px rgba(...)
```

Pass a token ref for the shadow base color — useful for themed or tinted shadows.

## DTCG Extension

```json
{
  "elevation": {
    "level-2": {
      "$value": "0 1px 2px rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15)",
      "$extensions": {
        "org.dtcg-formulas": {
          "formula": "material-shadow(2)",
          "definition": "tokens/functions/material-shadow/material-shadow.module.scssdef#material-shadow"
        }
      }
    }
  }
}
```

Note: no `$type` is needed — `$value` is a CSS shadow string, not a DTCG typed value.
