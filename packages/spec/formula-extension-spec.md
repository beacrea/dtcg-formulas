# `org.dtcg-formulas` DTCG Extension Specification

## 1. Purpose

This specification defines a vendor-namespaced `$extensions` convention for preserving computed-value provenance in DTCG design token files.

The extension allows a DTCG token to declare:

* which function produced its resolved `$value`
* the exact call expression used
* the source definition file and function name
* the syntax version of the definition format

This metadata is optional. A token with or without this extension remains a valid DTCG token.

---

## 2. Namespace

The extension key is:

```
org.dtcg-formulas
```

It lives inside the standard DTCG `$extensions` object on any token.

---

## 3. Compatibility principles

### 3.1 Resolved `$value` is canonical

Every output token must contain a resolved DTCG `$value`. The formula extension is supplementary metadata for provenance, validation, and regeneration. It never replaces `$value`.

### 3.2 Extensions are vendor-namespaced

Formula metadata lives under `org.dtcg-formulas` per the DTCG vendor extension convention. Toolchains that do not understand this extension must ignore it without error.

### 3.3 Output values must remain DTCG-compliant

If a token is typed as a DTCG `dimension`, its resolved `$value` must match DTCG unit constraints. The formula layer may be more expressive internally, but emitted DTCG output must remain standards-compliant.

---

## 4. Extension shape

### 4.1 Required fields (minimal form)

```json
{
  "$extensions": {
    "org.dtcg-formulas": {
      "syntax": "scssdef@0.1",
      "definition": "tokens/functions/radius.module.scssdef#radius",
      "call": "radius({typography.scale.typescale-15}, {shape.ratio.button}, 1px)"
    }
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `syntax` | `string` | Definition format and version. Must match pattern `scssdef@{semver-major.minor}`. |
| `definition` | `string` | Path to the `.module.scssdef` file and function name, separated by `#`. Path is relative to the token file's repository root. |
| `call` | `string` | The complete function call expression with resolved or referenced arguments. Token references use DTCG `{path.to.token}` syntax. |

### 4.2 Optional fields (rich form)

```json
{
  "$extensions": {
    "org.dtcg-formulas": {
      "syntax": "scssdef@0.1",
      "definition": "tokens/functions/radius.module.scssdef#radius",
      "call": "radius({typography.scale.typescale-15}, {shape.ratio.button}, 1px)",
      "arguments": {
        "size": "{typography.scale.typescale-15}",
        "ratio": "{shape.ratio.button}",
        "step": { "value": 1, "unit": "px" },
        "mode": "nearest"
      },
      "dependencies": [
        "typography.scale.typescale-15",
        "shape.ratio.button"
      ]
    }
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `arguments` | `object` | Structured argument map keyed by parameter name (without `$` prefix). Values are token references, literals, or structured dimension objects. |
| `dependencies` | `string[]` | Explicit list of token paths this formula depends on. Enables dependency graph construction without parsing the call string. |

The minimal form (three required fields) is the recommended public convention for v0.

---

## 5. Syntax version

The `syntax` field uses the format:

```
scssdef@{major}.{minor}
```

The version tracks the `.module.scssdef` specification version, not the consuming toolchain version. This allows toolchains to know whether they can parse the referenced definition.

Current version: `scssdef@0.1`

---

## 6. Definition path format

The `definition` field uses the format:

```
{relative-path}#{function-name}
```

* The path is relative to the repository root (not the token file location).
* The fragment (`#function-name`) identifies the specific function within the module.
* Paths must use forward slashes regardless of OS.

Example:

```
tokens/functions/math.module.scssdef#snap
```

---

## 7. Call expression format

The `call` field contains a function call expression that:

* uses the function name from the definition
* passes arguments positionally (matching the function signature)
* may include DTCG token references in `{path.to.token}` syntax
* may include literal values (numbers, dimensions, identifiers)
* may include inline arithmetic expressions

Examples:

```
snap(1.2 * {typography.scale.typescale-10}, 1px, ceil)
radius({typography.scale.typescale-15}, {shape.ratio.button}, 1px)
```

The call expression is a symbolic invocation, not executable code. Consuming toolchains resolve it against the definition and token graph.

---

## 8. Placement

The extension may appear on any DTCG token that has a computed `$value`.

```json
{
  "shape": {
    "$type": "dimension",
    "$value": "12px",
    "$description": "md corner radius = round(0.6 x typescale-15).",
    "$extensions": {
      "org.dtcg-formulas": {
        "syntax": "scssdef@0.1",
        "definition": "tokens/functions/radius.module.scssdef#radius",
        "call": "radius({typography.scale.typescale-15}, {shape.ratio.button}, 1px)"
      }
    }
  }
}
```

The extension must not appear at the file level or group level — only on individual tokens that have a `$value`.

---

## 9. Validation expectations

Compliant toolchains should validate:

* all three required fields are present
* `syntax` matches the expected version pattern
* `definition` path resolves to an existing `.module.scssdef` file
* the fragment references a function that exists in that file
* `call` uses the correct function name
* argument count matches the function signature (accounting for defaults)
* if `dependencies` is present, all paths resolve to tokens in the graph

---

## 10. Relationship to `com.underline.dtcg`

The `org.dtcg-formulas` extension supersedes the earlier `com.underline.dtcg` `formula` field for computed-value provenance. The older convention stored a single `formula` string without definition references or syntax versioning.

Migration path:

| Before | After |
|--------|-------|
| `"com.underline.dtcg": { "formula": "math(ceil(...))" }` | `"org.dtcg-formulas": { "syntax": "scssdef@0.1", "definition": "...#snap", "call": "snap(...)" }` |

The `com.underline.dtcg` namespace continues to be used for file-level DTCG spec exception governance. Only the token-level `formula` field moves to the new namespace.

---

## 11. Summary

`org.dtcg-formulas` provides a minimal, structured convention for documenting how a DTCG token's `$value` was computed. It preserves provenance without replacing DTCG semantics, and it connects resolved tokens back to their reusable function definitions.

The extension should remain narrow and metadata-oriented. If it starts trying to encode evaluation semantics, it has drifted from its purpose.
