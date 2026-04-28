# @dtcg-formulas/parser

Parser for `.module.scssdef` definition files used by [`dtcg-formulas`](https://dtcg-formulas.org) — a documentation-first, pluggable formula layer for DTCG design tokens.

## Install

```bash
npm install @dtcg-formulas/parser
```

## Usage

```ts
import { parse } from '@dtcg-formulas/parser';
import { readFileSync } from 'node:fs';

const source = readFileSync('tokens/functions/radius.module.scssdef', 'utf-8');
const mod = parse(source);

console.log(mod.frontmatter.module); // "math"
console.log(mod.functions[0].name);  // "snap"
```

`parse(source)` returns a `ParsedModule`:

```ts
interface ParsedModule {
  frontmatter: ModuleFrontmatter;   // YAML frontmatter (module, title, summary, ...)
  functions: FunctionDeclaration[]; // SassDoc + signature parsed for each function
}
```

See the [API reference](https://dtcg-formulas.org/api/parser) for the full type surface and the [`.module.scssdef` spec](https://dtcg-formulas.org/spec/scssdef) for the file format.

## What this is

Phase 1 of the `dtcg-formulas` project. Pairs with [`@dtcg-formulas/registry`](https://www.npmjs.com/package/@dtcg-formulas/registry). The resolver, CLI, and executable adapters land in 0.2.0+; see the [roadmap](https://dtcg-formulas.org/guide/roadmap).

## License

MIT
