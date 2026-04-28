# @dtcg-formulas/spec

Specifications for the `.module.scssdef` format and the `org.dtcg-formulas` DTCG extension.

This package ships only specification documents — no code. It is published so consumers and tooling can pin to a versioned copy of the formal specs.

- **[`.module.scssdef` format](https://dtcg-formulas.org/spec/scssdef)** — definition file syntax: frontmatter, SassDoc tags, function declarations.
- **[Formula extension](https://dtcg-formulas.org/spec/formula-extension)** — the `org.dtcg-formulas` DTCG `$extensions` convention.
- **[Registry contract](https://dtcg-formulas.org/spec/registry-contract)** — the minimum interface a registry implementation must satisfy.

## Versioning

The package version tracks the **wire format**: bump minor for additive changes, major for breaking changes to the syntax or extension shape. This is independent of runtime packages (`@dtcg-formulas/parser`, `@dtcg-formulas/registry`, etc.), which version against their own API surface.

## License

MIT
