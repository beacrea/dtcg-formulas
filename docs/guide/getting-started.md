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

## Register an Adapter

Non-builtin functions (adapters) follow the same parse-then-register flow. Here's how to register the color-names adapter:

```ts
import { parse } from '@dtcg-formulas/parser';
import { createRegistry } from '@dtcg-formulas/registry';
import { readFileSync } from 'node:fs';

const registry = createRegistry();
// Built-ins (round, clamp, min, max) are already registered

const colorNamesSrc = readFileSync(
  'tokens/functions/color-names/color-names.module.scssdef',
  'utf-8',
);
const colorNamesMod = parse(colorNamesSrc);

for (const fn of colorNamesMod.functions) {
  registry.register(
    'tokens/functions/color-names/color-names.module.scssdef',
    fn.name,
    fn,
  );
}

// Now resolvable by definition ref
const colorName = registry.resolve(
  'tokens/functions/color-names/color-names.module.scssdef#color-name',
);
```

## Writing Definition Files

See the [.module.scssdef specification](/spec/scssdef) for the full format reference.
