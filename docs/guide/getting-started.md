# Getting Started

## Installation

```bash
npm install @dtcg-formulas/parser @dtcg-formulas/registry
```

## Parse a Definition File

```ts
import { parse } from '@dtcg-formulas/parser';
import { readFileSync } from 'node:fs';

const source = readFileSync('tokens/functions/radius.module.scssdef', 'utf-8');
const module = parse(source);

console.log(module.frontmatter.module); // "radius"
console.log(module.functions[0].name);  // "radius"
```

## Register Functions

```ts
import { createRegistry } from '@dtcg-formulas/registry';
import { parse } from '@dtcg-formulas/parser';

const registry = createRegistry();
// Built-ins (round, clamp, min, max) are pre-registered

const mod = parse(source);
for (const fn of mod.functions) {
  registry.register('tokens/functions/radius.module.scssdef', fn.name, fn);
}

// Resolve by definition ref
const radius = registry.resolve(
  'tokens/functions/radius.module.scssdef#radius'
);
```

## Writing Definition Files

See the [.module.scssdef specification](/spec/scssdef) for the full format reference.
