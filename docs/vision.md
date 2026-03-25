# DTCG Formulas — Project Brief

## 1. Working name

**dtcg-formulas**
A documentation-first, pluggable formula layer for DTCG design tokens.

---

## 2. One-line summary

`dtcg-formulas` provides a Sass-like definition language and a DTCG extension convention for documenting, preserving, and resolving computed token formulas while keeping `$value` resolved and standards-compliant.

---

## 3. Problem statement

DTCG provides a strong interoperable format for resolved token values, but it does not currently standardize how computed token formulas should be defined, documented, preserved, or exchanged.

In practice, teams want to:

* derive tokens from formulas rather than hardcoding every value
* preserve the formula that produced a resolved token value
* generate documentation for computed token functions
* share formula definitions across tools and pipelines
* support custom computed domains beyond basic math, such as contrast-aware color generation

Today, these concerns are usually handled in one of three bad ways:

1. hidden inside proprietary tooling
2. encoded as ad hoc scripts with no portable metadata
3. collapsed into raw resolved values, losing provenance entirely

`dtcg-formulas` exists to fill that gap without replacing DTCG.

---

## 4. Core thesis

A design token should be able to contain:

* a **resolved DTCG `$value`**
* an optional **formula provenance extension**
* a reference to a **reusable function definition**
* enough metadata to regenerate, validate, and document the computed value

The project separates:

* **interoperable token output** from
* **authoring-time formula definitions**

This keeps DTCG output boring and portable while still preserving how the value was derived.

---

## 5. Goals

### 5.1 Primary goals

The project should:

* preserve computed-value provenance in a DTCG-compatible way
* define a compact, Sass-like syntax for reusable formula definitions
* support human-readable documentation metadata for formulas
* keep `$value` as the canonical resolved token value
* allow custom function families beyond Sass semantics
* support pluggable resolution backends
* be practical to adopt in real design system build pipelines

### 5.2 Secondary goals

The project should also:

* provide a reference parser for formula definition modules
* provide a reference extension schema for DTCG tokens
* provide a minimal function registry model
* support examples for scalar math and contrast-aware color functions

---

## 6. Non-goals

The project does not attempt to:

* replace DTCG as the canonical token format
* redefine how DTCG `$value` works
* standardize token compilation for the whole ecosystem
* become a full programming language
* become executable Sass
* become a general-purpose expression engine for arbitrary application logic
* solve every one-to-many token generation workflow in v0

This is a narrow infrastructure layer, not a new religion.

---

## 7. Project model

`dtcg-formulas` has three main layers.

### 7.1 Definition layer

Reusable functions are defined in `.module.scssdef` files. These files include:

* YAML front matter for module metadata
* SassDoc-style comments for function metadata
* Sass-like function declarations
* a symbolic `@return` expression

These files define formula interfaces and documentation. They are not executable Sass.

### 7.2 Token layer

DTCG token files keep `$value` resolved and standards-compliant. A vendor-namespaced `$extensions` entry stores formula provenance:

* the formula call string
* the referenced function definition
* the syntax version
* optional structured arguments or dependency metadata

### 7.3 Resolution layer

A resolver consumes:

* the formula definition
* the formula call
* token references
* registered custom functions

It then validates and computes the resolved `$value`. This layer is pluggable and intentionally decoupled from the authoring surface.

---

## 8. DTCG compatibility principles

### 8.1 Resolved `$value` is canonical

Every output token must contain a resolved DTCG `$value`. The formula extension is optional metadata for provenance, validation, and regeneration.

### 8.2 Extensions are vendor-namespaced

Formula metadata must live under a vendor-specific key in `$extensions`. Working key: `org.dtcg-formulas`.

### 8.3 Output values must remain DTCG-compliant

If a token is emitted as a DTCG `dimension`, its resolved unit must match official DTCG constraints. The formula layer may be more expressive internally, but emitted DTCG output must remain standards-compliant.

---

## 9. Proposed formula extension model

See `packages/spec/formula-extension-spec.md` for the full specification.

---

## 10. Custom function model

The function system must go beyond Sass built-ins. The registry should support functions that are:

* scalar and one-to-one
* pure and deterministic
* optionally namespaced
* implemented by adapters rather than language-level hacks

Examples: `snap(...)`, `radius(...)`, `clamp(...)`, `mix(...)`, `modular-scale(...)`, `leonardo.color(...)`, `color-name(...)`, `shade(...)`, `tint(...)`, `fluid-size(...)`, `material-shadow(...)`

---

## 11. Scalar functions vs generators

### 11.1 Scalar functions

A scalar function resolves to a single token value.

### 11.2 Generators or recipes

A generator produces multiple values or token groups from one definition. Generators should not be forced into the same primitive shape as scalar functions in v0. V0 focuses on scalar functions first.

---

## 12. MVP scope

### 12.1 Specifications

* `.module.scssdef` specification
* `org.dtcg-formulas` extension specification
* minimal function registry contract

### 12.2 Packages

* `@dtcg-formulas/spec`
* `@dtcg-formulas/parser`
* `@dtcg-formulas/registry`
* `@dtcg-formulas/resolver`
* `@dtcg-formulas/docs`

### 12.3 Built-in functions

* `snap`
* `radius`
* `clamp`
* `mix`

### 12.4 External adapter demos

* `leonardo.color`
* `color-names`
* `shade-tint`
* `fluid-size`
* `material-shadow`

### 12.5 Example projects

* radius example
* spacing example
* Leonardo color example
* color-names example
* shade-tint example
* fluid-size example
* material-shadow example

---

## 13. Repository structure

See the actual repo layout. Summary:

```
/packages/spec/          Specifications
/packages/parser/        Parser (stub)
/packages/registry/      Registry (stub)
/packages/resolver/      Resolver (stub)
/packages/docs/          Docs generator (stub)
/packages/style-dictionary-plugin/  SD integration (stub)
/examples/radius/        Radius + math example
/examples/spacing/       Spacing example (stub)
/examples/leonardo-color/ Leonardo color example
/docs/                   Project docs
```

---

## 14. Relationship to existing tools

The project should align with, not replace:

* DTCG for canonical token structure
* Style Dictionary as a likely initial backend
* Leonardo as a contrast-aware color computation engine
* existing token tooling that can preserve unknown DTCG extensions

---

## 15. Open questions

* Should the public extension key remain `org.dtcg-formulas` or use a project-specific domain?
* Should the extension eventually support structured argument metadata by default?
* Should the resolver support inline expressions beyond function calls in v0?
* How should scalar functions reference external engines in a portable way?
* When should generator recipes be introduced, and in what artifact shape?

---

## 16. Risks

### 16.1 Over-design risk

Mitigation: keep the syntax narrow, keep `$value` resolved, focus on scalar functions in v0.

### 16.2 Ecosystem drift risk

Mitigation: align with DTCG extension rules, document provenance rather than redefine token meaning.

### 16.3 Tooling complexity risk

Mitigation: prioritize the parser, extension spec, and one resolver path first.

---

## 17. Initial roadmap

See `docs/roadmap.md`.

---

## 18. Summary

`dtcg-formulas` should be a narrow, useful layer between token authoring and DTCG output. Its job is simple:

* define reusable computed token functions
* document them clearly
* preserve formula provenance in DTCG output
* resolve to standards-compliant token values

If it starts trying to become a full language runtime, it has already failed.
