# Function Registry Contract

## 1. Purpose

This document defines the minimal contract for a function registry in the `dtcg-formulas` ecosystem.

A registry is responsible for:

* storing function definitions parsed from `.module.scssdef` files
* resolving function names to their declarations
* supporting both built-in and custom function families

---

## 2. Registry interface

A registry must support the following operations:

### 2.1 Register a function

```
register(modulePath: string, functionName: string, declaration: FunctionDeclaration): void
```

Associates a parsed function declaration with a `modulePath#functionName` key.

### 2.2 Resolve a function

```
resolve(definitionRef: string): FunctionDeclaration | null
```

Accepts a definition reference in the format `path/to/module.module.scssdef#functionName` and returns the declaration, or null if not found.

### 2.3 List functions

```
list(): DefinitionRef[]
```

Returns all registered definition references.

---

## 3. Function declaration shape

A `FunctionDeclaration` must include at minimum:

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Function name |
| `parameters` | `Parameter[]` | Ordered list of parameters |
| `returnExpression` | `string` | The symbolic `@return` expression body |
| `metadata` | `FunctionMetadata` | Parsed doc comment metadata |

A `Parameter` must include:

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Parameter name (without `$`) |
| `type` | `string \| null` | Documented type annotation |
| `default` | `string \| null` | Default value expression |
| `description` | `string` | Parameter description |

---

## 4. Custom function adapters

The registry should support custom functions that are not defined in `.module.scssdef` files but are implemented by external adapters.

A custom adapter must provide:

```
evaluate(args: ResolvedArgument[]): ResolvedValue
```

Custom functions must be:

* scalar and one-to-one (one input set, one output value)
* pure and deterministic
* optionally namespaced (e.g., `leonardo.color`)

---

## 5. Built-in functions

The following functions should be available in any compliant registry without explicit registration:

| Function | Description |
|----------|-------------|
| `round` | Round a value to a step with mode (nearest/floor/ceil) |
| `clamp` | Constrain a value between min and max |
| `min` | Return the smaller of two values |
| `max` | Return the larger of two values |

These correspond to CSS/Sass math built-ins and require no `.module.scssdef` definition.

---

## 6. Summary

The registry contract is intentionally minimal. It connects parsed definitions to the resolver without prescribing storage, caching, or lifecycle concerns. Implementations may add indexing, validation, or hot-reload as needed.
