# Roadmap

## Phase 0 — Specification :white_check_mark:

* Publish project brief
* Publish `.module.scssdef` spec
* Publish `org.dtcg-formulas` extension spec draft
* Publish minimal function registry contract
* Example `.module.scssdef` files (radius, math)

## Phase 1 — Core Implementation (current)

* Implement `.module.scssdef` parser
* Implement minimal function registry
* Implement scalar resolver
* Ship built-in math functions (`snap`, `radius`, `clamp`, `mix`)

## Phase 2 — Integration

* Ship docs generator from `.module.scssdef` metadata
* Ship Style Dictionary plugin for `org.dtcg-formulas` resolution
* ~~Ship Leonardo scalar adapter example (`leonardo.color`)~~ :white_check_mark:
* ~~Ship color-names adapter example~~ :white_check_mark:
* ~~Ship modular-scale built-in~~ :white_check_mark:
* ~~Ship shade/tint adapter~~ :white_check_mark:
* ~~Ship fluid-size adapter~~ :white_check_mark:
* ~~Ship material-shadow adapter~~ :white_check_mark:

## Phase 3 — Expansion

* Grow the adapter catalog (spacing scales, typography, motion)
* Publish adapter authoring guide
* Evaluate generator/recipe model for one-to-many token derivation
* Revisit structured extension metadata (`arguments`, `dependencies`)
* Align with DTCG token operations developments
* Consider formal expression grammar
