# Integrations

`dtcg-formulas` is designed to be **tool-agnostic**. The core is a pure resolver that takes DTCG JSON in and writes computed `$value`s back — no hard dependency on any particular build system. Integrations are thin wrappers over that core.

Three recipes cover the common cases.

::: tip Availability
The bare-JSON and CLI paths land in 0.2.0. The Style Dictionary plugin lands in 0.3.0. The Terrazzo plugin is on the 0.4.0+ track. This page documents the shape each integration will take so you can plan adoption.
:::

## 1. Bare JSON pipeline (any Node build)

Use this when you don't have — or don't want — a larger build framework. It's the most direct path: a Node script that compiles one file to another.

```ts
// build-tokens.mjs
import { compile } from '@dtcg-formulas/resolver'; // 0.2.0
import { readFileSync, writeFileSync } from 'node:fs';

const input = JSON.parse(readFileSync('tokens.json', 'utf-8'));

const { tokens, diagnostics } = await compile(input, {
  definitions: ['tokens/functions/**/*.module.scssdef'],
  // optional adapters, pulled from @dtcg-formulas/adapter-* packages
  adapters: ['@dtcg-formulas/adapter-leonardo'],
});

if (diagnostics.some((d) => d.severity === 'error')) {
  for (const d of diagnostics) {
    console.error(`${d.code} ${d.severity}: ${d.message}`);
  }
  process.exit(1);
}

writeFileSync('tokens.resolved.json', JSON.stringify(tokens, null, 2));
```

Or skip the script and use the CLI directly:

```bash
npx dtcg-formulas compile tokens.json -o tokens.resolved.json
npx dtcg-formulas lint tokens.json           # preflight only
npx dtcg-formulas check tokens.json          # dry-run with full diagnostic report
```

This is the integration path the library optimizes for. Every other integration is a thin wrapper over this same core.

## 2. Style Dictionary

[Style Dictionary](https://styledictionary.com/) consumers pull in `@dtcg-formulas/style-dictionary-plugin`, which registers a **transitive preprocessor** that runs after SD resolves token aliases but before platform-specific transforms.

```ts
// style-dictionary.config.ts (Style Dictionary 4.x, ESM)
import StyleDictionary from 'style-dictionary';
import { register } from '@dtcg-formulas/style-dictionary-plugin'; // 0.3.0

register(StyleDictionary, {
  definitions: ['tokens/functions/**/*.module.scssdef'],
  adapters: ['@dtcg-formulas/adapter-leonardo'],
});

export default {
  source: ['tokens/**/*.json'],
  preprocessors: ['dtcg-formulas'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [{ destination: 'variables.css', format: 'css/variables' }],
    },
  },
};
```

Because formulas resolve **before** platform transforms, every SD format — CSS variables, iOS, Android, whatever — sees the computed `$value` and nothing else. Provenance in `$extensions.org.dtcg-formulas` is preserved for any format that wants to emit it.

See [Style Dictionary DTCG docs](https://styledictionary.com/info/dtcg/) for how SD handles the underlying DTCG syntax.

## 3. Terrazzo

[Terrazzo](https://terrazzo.app/) ships its own DTCG-native compiler. The `@dtcg-formulas/terrazzo-plugin` hooks into its parser phase so formulas resolve before Terrazzo's built-in plugins (CSS, Sass, JS/TS) generate output.

```ts
// terrazzo.config.ts (0.4.0+)
import { defineConfig } from '@terrazzo/cli';
import dtcgFormulas from '@dtcg-formulas/terrazzo-plugin';
import css from '@terrazzo/plugin-css';

export default defineConfig({
  tokens: 'tokens.json',
  plugins: [
    dtcgFormulas({
      definitions: ['tokens/functions/**/*.module.scssdef'],
      adapters: ['@dtcg-formulas/adapter-leonardo'],
    }),
    css({ filename: 'tokens.css' }),
  ],
});
```

## Choosing an integration

| You have... | Use |
|---|---|
| A Node build and no token-processing framework | **Bare JSON** pipeline (CLI or resolver API) |
| An existing Style Dictionary 4.x setup | **Style Dictionary plugin** |
| An existing Terrazzo setup | **Terrazzo plugin** |
| A different build tool | **Bare JSON** via the resolver API — wrap it in a script that fits your framework |

All four paths share the same core and the same diagnostics. Switching later is a config change, not a rewrite.

## Adapter packages

Any integration that resolves formulas calling contrast-aware color (`leo()`), named colors (`color-name()`), material shadows, etc. needs the matching adapter package installed at runtime:

```bash
npm install @dtcg-formulas/adapter-leonardo      # 0.3.0
npm install @dtcg-formulas/adapter-color-names   # 0.3.0
npm install @dtcg-formulas/adapter-material-shadow  # 0.3.0
```

Adapters are opt-in to keep the core small and deterministic. Install only what your token set actually calls.

## Next steps

- [Authoring a Formula](./authoring-a-formula) — add your own custom functions.
- [Troubleshooting](./troubleshooting) — diagnose integration issues.
- [Architecture / Public Readiness](/architecture/public-readiness) — the full rationale for this integration model.
