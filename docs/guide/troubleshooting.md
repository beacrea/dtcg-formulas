# Troubleshooting

Common failure modes, their root causes, and the fastest path to a fix. When the CLI lands in 0.2.0, every diagnostic below will carry a `DTCG-FORMULAS-*` code; this page is the reference.

## Diagnostic code categories

| Prefix | Meaning |
|---|---|
| `DTCG-FORMULAS-P###` | **Parse** errors — a `.module.scssdef` file failed to load into an AST |
| `DTCG-FORMULAS-L###` | **Lint / preflight** errors — something about the token tree or formula call is invalid, caught without executing anything |
| `DTCG-FORMULAS-R###` | **Resolve** errors — a formula ran but the result is invalid or the execution failed |
| `DTCG-FORMULAS-V###` | **Validation** errors — the emitted `$value` is not DTCG-compliant for the declared `$type` |

Every diagnostic includes a `severity` (`error` / `warning`), a `message`, a `span` pointing at the source location, and — where useful — a `hint` and a `docsUrl` back to this page.

## Parse errors (P)

### My `.module.scssdef` file won't parse

**Common causes:**

- Missing YAML frontmatter fences (`---`). The parser requires an opening and closing fence.
- Missing required frontmatter keys: `module`, `title`, `summary`.
- A `@function` block without a preceding `/// @name` marker. The parser splits by `/// @name`; anything before the first one is ignored.
- A function has no `@summary` or no `@returns`. Both are required.
- A `@param` documented that isn't in the signature, or a signature parameter without a matching `@param` doc.

**Fix:** the error message names the field or line. Open the file, add the missing piece, re-parse.

**Tip:** the radius and leonardo example files are good references. Copy one as a starting point.

## Lint / preflight errors (L)

These are caught by `dtcg-formulas lint tokens.json` (0.2.0) without executing any formula.

### A token's `org.dtcg-formulas.definition` can't be found

**Cause:** the `definition` path points at a `.module.scssdef` file that either doesn't exist or isn't included in the lint's `definitions` glob.

**Fix:** check your config passes the correct glob (e.g., `'tokens/functions/**/*.module.scssdef'`). Verify the `path#name` exactly matches a parsed module's path and a declared function.

### A token's `formula` call references an unknown function

**Cause:** the call string invokes a function (`my-fn(...)`) that isn't registered. Either you meant a built-in with a different name, or you forgot to register an adapter.

**Fix:** check the [Functions](/examples/) list. If it's your own function, confirm the definition file is in the lint glob.

### Arity mismatch

**Cause:** the call passes more or fewer arguments than the declaration defines (counting defaulted parameters as optional).

**Fix:** compare the call to the `@param` list in the definition. Remember that parameters with defaults (`$step: 1px`) are optional.

### Unresolved token reference

**Cause:** a `{path.to.token}` inside the formula call doesn't resolve to a token in the tree.

**Fix:** the diagnostic names the missing path. Fix the typo, or add the missing token.

### Reference cycle

**Cause:** token A's formula references token B, whose formula references A — directly or transitively.

**Fix:** break the cycle by moving one side to a literal value or restructuring the derivation. The diagnostic lists the full cycle path.

## Resolve errors (R)

Caught only by `dtcg-formulas compile` (0.2.0) because they require executing a formula.

### A built-in received an incompatible argument

**Cause:** e.g. `clamp()` got a string where it expected a number, or `mix()` got two colors with incompatible color-space components.

**Fix:** check the types of the arguments. The diagnostic will name which argument failed.

### An adapter threw an error

**Cause:** the adapter package (e.g., `@dtcg-formulas/adapter-leonardo`) raised an exception while computing.

**Fix:** the diagnostic wraps the adapter's error message and hints at likely causes. Check the adapter's own docs for argument constraints — Leonardo has specific requirements about ratio ranges, for instance.

### Adapter not installed

**Cause:** your tokens call `leo(...)`, `color-name(...)`, etc., but the matching `@dtcg-formulas/adapter-*` package isn't installed.

**Fix:** `npm install` the adapter and re-run.

## Validation errors (V)

### Computed `$value` doesn't match the declared `$type`

**Cause:** a token typed `dimension` got a `$value` that isn't a valid DTCG dimension (e.g., a bare number with no unit, or a color string).

**Fix:** either the formula is wrong for that type, or the `$type` on the token is wrong. The diagnostic shows the computed value and the declared type.

### Non-compliant DTCG output

**Cause:** the computed value isn't legal DTCG for that type even if it "makes sense" visually — e.g. a CSS-only unit for a type that DTCG doesn't allow there.

**Fix:** emit a value that meets DTCG's [Format Module](https://www.designtokens.org/tr/drafts/format/) rules for the declared type.

## General debugging tips

- **Run `lint` first.** Preflight is cheap, deterministic, and requires no adapter packages. Fix every L-code before worrying about R-codes.
- **Isolate one token.** If you're flooded with errors, comment out all tokens but one and get it clean, then re-enable incrementally.
- **Check your references.** Many errors reduce to a wrong `{path.to.token}` string. The DTCG dotted path must exactly match the token tree.
- **Look at the examples.** Every function on the [Functions](/examples/) page shows a real `org.dtcg-formulas` entry with matching `formula` and `definition` fields. Copy-paste and adapt.
- **File a diagnostic-doc issue.** If a diagnostic message doesn't tell you enough, that's a bug in our docs, not in your tokens. Open an issue with the diagnostic code.

## Until 0.2.0 ships

The `lint` and `compile` CLI commands referenced above land in 0.2.0. Until then, you can approximate preflight with a small script: parse each `.module.scssdef`, register every function, and iterate over every `$extensions.org.dtcg-formulas` in your token tree to assert `registry.resolve(definition)` isn't null. See [Authoring a Formula § step 7](./authoring-a-formula#_7-check-your-work-before-0-2-0-ships) for a template.
