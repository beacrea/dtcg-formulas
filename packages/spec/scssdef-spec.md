# SCSS Definition Modules (`.module.scssdef`) Specification

## 1. Purpose

This specification defines a documentation-first, Sass-inspired declaration format for reusable token functions.

The format is intended to:

* provide a compact authoring surface for abstract token functions
* preserve familiar Sass function syntax
* support module and function metadata for generated documentation
* express symbolic return formulas without requiring runtime Sass execution
* serve as an interface-definition layer for token build systems

This format is not intended to be executable Sass.

---

## 2. Design goals

### 2.1 Primary goals

The format must:

* feel familiar to authors who already use Sass
* remain significantly more abstract than TypeScript object factories
* support structured documentation metadata
* be easy to parse deterministically
* support symbolic composition of functions
* remain portable across token pipelines

### 2.2 Non-goals

The format does not attempt to:

* replace Sass as a stylesheet language
* support general-purpose programming constructs
* define build-time evaluation semantics in this specification
* define token compilation, resolution, validation, or platform export behavior

Those concerns belong to the consuming toolchain.

---

## 3. File format

A definition module uses the file extension:

```txt
.module.scssdef
```

Each file consists of two top-level sections in this order:

1. YAML front matter
2. Sass-like declaration body

### 3.1 Required structure

```scss
---
module: radius
title: Radius Utilities
summary: Declarative radius and snapping function definitions.
---

/// Function docs...
@function radius($size, $ratio, $step: 1px, $mode: nearest) {
  @return snap($size * $ratio, $step, $mode);
}
```

---

## 4. Front matter

Front matter defines module-level metadata.

### 4.1 Required keys

* `module`: canonical module identifier
* `title`: human-readable module title
* `summary`: short module summary

### 4.2 Optional keys

* `description`: longer markdown-compatible description
* `category`: classification such as `foundations`, `color`, `spacing`, or `radius`
* `since`: initial version identifier
* `deprecated`: deprecation message or boolean
* `tags`: list of strings
* `see`: list of related modules or concepts

### 4.3 Example

```yaml
---
module: radius
title: Radius Utilities
summary: Declarative radius and snapping function definitions.
description: |
  Defines abstract Sass-like functions used by the token build pipeline.
  These definitions are documentation-first and are not executed directly.
category: foundations
since: 1.0.0
tags:
  - radius
  - math
  - tokens
see:
  - math
  - size
---
```

---

## 5. Declaration body

The declaration body contains one or more documented `@function` declarations.

Each function declaration consists of:

1. a SassDoc-style documentation block
2. a function signature
3. a symbolic `@return` expression

No other top-level constructs are part of the core spec.

---

## 6. Allowed syntax subset

This specification intentionally supports only a constrained subset of Sass-like syntax.

### 6.1 Allowed constructs

* doc comments beginning with `///`
* `@function` declarations
* positional parameters
* default parameter values
* `@return` statements
* variable references such as `$size`
* arithmetic expressions within `@return`
* nested function calls within `@return`
* scalar literals such as numbers, dimensions, percentages, identifiers, and strings

### 6.2 Disallowed constructs

The following constructs are outside spec and must not appear in a compliant file:

* `@if`
* `@else`
* `@each`
* `@for`
* `@while`
* `@use`
* `@forward`
* `@mixin`
* `@include`
* selectors of any kind
* property declarations
* interpolation
* maps, lists, or general Sass data structures as executable structures
* side effects or assignment semantics
* multiple statements inside a function body other than a single symbolic `@return`

This is a declaration language, not a programming language.

---

## 7. Function documentation model

Function metadata is expressed with SassDoc-style doc comments placed immediately above the function.

### 7.1 Required documentation tags

Each function must include:

* `@name`
* `@summary`
* `@param` for every parameter
* `@returns`

### 7.2 Recommended documentation tags

A function should include these when applicable:

* `@description`
* `@constraints`
* `@example`
* `@since`
* `@deprecated`
* `@see`

### 7.3 Parameter notation

Recommended format:

```txt
@param $name <type> Description
```

Example:

```txt
@param $ratio <number> Unitless ratio in the range (0, 1].
```

### 7.4 Return notation

Recommended format:

```txt
@returns <type>
```

Example:

```txt
@returns <dimension>
```

---

## 8. Type notation

Type notation in this spec is descriptive, not executable.

Recommended primitive type labels:

* `<number>`
* `<dimension>`
* `<percentage>`
* `<string>`
* `<identifier>`
* `<ref>`

Recommended union notation:

* `<number|dimension|ref>`
* `<nearest|floor|ceil>`

These type expressions are documentation metadata only. They do not define evaluation rules.

---

## 9. Function signature rules

### 9.1 Naming

Function names should be:

* concise
* semantic
* lowercase camelCase or lowercase simple identifiers

Preferred examples:

* `snap`
* `radius`
* `clamp`
* `mix`

Avoid verbose implementation names unless needed for clarity.

### 9.2 Parameters

Parameters must use Sass-style variable notation:

```scss
$size
$ratio
$step
```

Parameters may define default values:

```scss
$step: 1px
$mode: nearest
```

### 9.3 Overloading

Function overloading is not part of the core format.

A function name should have one canonical declaration per module unless a future extension explicitly adds overload semantics.

---

## 10. Return expression rules

The function body must contain exactly one symbolic `@return` statement.

### 10.1 Allowed return expression content

A return expression may include:

* parameter references
* scalar literals
* arithmetic operators such as `+`, `-`, `*`, `/`
* nested function calls
* parentheses for grouping

### 10.2 Symbolic meaning

The return expression describes intent and composition.

It is not defined here as executable Sass and must be treated by consuming systems as a symbolic declaration.

### 10.3 Examples

Valid:

```scss
@return snap($size * $ratio, $step, $mode);
```

```scss
@return clamp($min, $preferred, $max);
```

Invalid:

```scss
$temp: $size * $ratio;
@return snap($temp, $step, $mode);
```

Invalid because intermediate assignment is outside the allowed subset.

---

## 11. Example module

```scss
---
module: radius
title: Radius Utilities
summary: Declarative radius and snapping function definitions.
description: |
  Defines abstract Sass-like functions used by the token build pipeline.
  These definitions are documentation-first and are not executed directly.
category: foundations
since: 1.0.0
tags:
  - radius
  - math
  - tokens
---

/// @name snap
/// @summary Snap a value to a step.
/// @description Aligns a resolved value to a predictable increment.
/// @param $value <number|dimension|ref> The value to snap.
/// @param $step <number|dimension|ref> The snap interval.
/// @param $mode <nearest|floor|ceil> The rounding mode.
/// @returns <number|dimension>
/// @example snap(15.6px, 1px, nearest)
/// @example snap(size.controlMd, 1px)
@function snap($value, $step: 1px, $mode: nearest) {
  @return round($value, $step, $mode);
}

/// @name radius
/// @summary Compute a proportional radius.
/// @description Uses a size-times-ratio formula and then snaps the result.
/// @param $size <dimension|ref> Base size used to derive the radius.
/// @param $ratio <number> Unitless ratio in the range (0, 1].
/// @param $step <dimension|ref> Snap interval.
/// @param $mode <nearest|floor|ceil> Rounding mode.
/// @returns <dimension>
/// @constraints $ratio > 0
/// @constraints $ratio <= 1
/// @example radius(size.controlMd, 0.35, 1px)
/// @example radius(size.cardLg, 0.08, 1px, floor)
@function radius($size, $ratio, $step: 1px, $mode: nearest) {
  @return snap($size * $ratio, $step, $mode);
}
```

---

## 12. Recommended relationship to token usage

This format defines reusable functions.

Token values should reference these functions through a simpler token authoring surface, such as a YAML or JSON value string.

Example:

```yaml
radius:
  control-md:
    value: radius(size.control-md, 0.35, 1px)
    summary: Medium control radius
```

This split is intentional:

* `.module.scssdef` defines the function interface and documentation
* token files consume those definitions using compact expressions

---

## 13. Validation expectations

Validation behavior is not standardized here, but compliant toolchains should be able to validate at least:

* front matter presence and structure
* required function doc tags
* parameter/doc consistency
* a single `@return` statement per function
* disallowed syntax
* unresolved parameter references inside `@return`

Toolchains may additionally validate semantic concerns such as:

* duplicate function names
* type mismatches
* invalid default values
* invalid documented constraints

---

## 14. Compatibility guidance

This format should be treated as Sass-inspired, not Sass-executable.

Consumers should not assume compatibility with a Sass compiler.

If interoperability with real Sass is desired, it should be handled by a separate translation layer rather than by expanding this spec until it becomes accidental Sass.

That road ends in a swamp.

---

## 15. Minimal compliance checklist

A file is minimally compliant if it:

* uses the `.module.scssdef` extension
* begins with valid YAML front matter
* defines at least one documented `@function`
* includes required function doc tags
* uses only allowed syntax constructs
* contains exactly one symbolic `@return` per function

---

## 16. Future extension points

The following may be added in later revisions without breaking the core model:

* namespaced module imports
* overload declarations
* richer type notation
* generic constraint annotations
* machine-readable doc tags
* formal expression grammar
* translation targets for Sass, JSON, or token graph formats

These are intentionally deferred.

---

## 17. Summary

`.module.scssdef` is a documentation-first, Sass-inspired declaration format for token functions.

It exists to preserve the ergonomics of Sass function authoring while keeping definitions abstract, parseable, and metadata-rich.

The format should remain narrow, legible, and interface-oriented. Once it starts trying to be executable Sass, it has missed the point.
