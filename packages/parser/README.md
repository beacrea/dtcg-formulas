# @dtcg-formulas/parser

> Stub — not yet implemented.

Parses `.module.scssdef` files into structured function declarations. See `packages/spec/scssdef-spec.md` for the format specification.

## Planned API

```ts
import { parse } from '@dtcg-formulas/parser';

const module = parse(fs.readFileSync('math.module.scssdef', 'utf-8'));
// → { frontmatter: { module: 'math', ... }, functions: [{ name: 'snap', ... }] }
```
