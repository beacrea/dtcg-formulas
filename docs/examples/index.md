# Functions

`dtcg-formulas` ships a growing catalog of formula definitions: **built-in functions** that cover common math and color operations, plus **computation adapters** that connect to external libraries for domain-specific work.

## Built-in Functions

Built-ins are pre-registered in the registry. They wrap CSS/Sass intrinsics and require no external dependencies.

| Function | Domain | Description |
|----------|--------|-------------|
| [`clamp`](/examples/clamp) | Math | Constrain a value between minimum and maximum bounds |
| [`mix`](/examples/mix) | Color | Blend two colors by a weighted ratio |

## Computation Adapters

Adapters are domain-specific functions backed by external libraries. Parse their `.module.scssdef`, then register them in your pipeline.

| Adapter | Domain | Library | Description |
|---------|--------|---------|-------------|
| [`radius`](/examples/radius) | Shape | -- | Proportional radius from size and ratio |
| [`leonardo`](/examples/leonardo) | Color | [Adobe Leonardo](https://leonardocolor.io/) | Contrast-aware palette color generation |
| [`color-name`](/examples/color-names) | Color | [meodai/color-names](https://github.com/meodai/color-names) | Human-readable color naming via nearest match |

## Adding Your Own

Any `.module.scssdef` file that follows the [scssdef specification](/spec/scssdef) can be parsed and registered as an adapter. The workflow:

1. Author a `.module.scssdef` with frontmatter + function declaration
2. Parse it with `@dtcg-formulas/parser`
3. Register the functions in a `@dtcg-formulas/registry` instance
4. Wire up an evaluate callback that delegates to your library

See the [Registry Contract](/spec/registry-contract) for the full interface.
