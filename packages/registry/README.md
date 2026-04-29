# @dtcg-formulas/registry

Function declaration registry for [`dtcg-formulas`](https://dtcg-formulas.org). Stores parsed function declarations and pre-loads built-in math functions.

## Install

```bash
npm install @dtcg-formulas/registry @dtcg-formulas/parser
```

## Usage

```ts
import { createRegistry } from '@dtcg-formulas/registry';
import { parse } from '@dtcg-formulas/parser';
import { readFileSync } from 'node:fs';

const registry = createRegistry();
// Built-ins (round, clamp, min, max) are pre-registered at the `builtins#` namespace.

const mod = parse(readFileSync('tokens/functions/radius.module.scssdef', 'utf-8'));
for (const fn of mod.functions) {
  registry.register('tokens/functions/radius.module.scssdef', fn.name, fn);
}

const decl = registry.resolve('tokens/functions/radius.module.scssdef#radius');
```

## API

```ts
interface Registry {
  register(modulePath: string, functionName: string, declaration: FunctionDeclaration): void;
  resolve(definitionRef: string): FunctionDeclaration | null;
  list(): string[];
}

function createRegistry(): Registry;
```

See the [API reference](https://dtcg-formulas.org/api/registry) for full details and the [registry contract](https://dtcg-formulas.org/spec/registry-contract) for the underlying spec.

## What this is

Phase 1 of the `dtcg-formulas` project. The registry is metadata-only today; executable JS implementations for built-ins ship in [`@dtcg-formulas/builtins`](https://dtcg-formulas.org/guide/roadmap) (0.2.0).

## License

MIT
