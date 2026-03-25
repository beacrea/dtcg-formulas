# Roadmap

## Phase 0 — Specification :white_check_mark:

- Publish project brief
- Publish `.module.scssdef` spec
- Publish `org.dtcg-formulas` extension spec draft
- Publish minimal function registry contract
- Example `.module.scssdef` files (radius, math)

## Phase 1 — Core Implementation (current)

- [x] Implement `.module.scssdef` parser ([#1](https://github.com/beacrea/dtcg-formulas/issues/1))
- [x] Implement function registry ([#2](https://github.com/beacrea/dtcg-formulas/issues/2))
- [ ] Implement scalar resolver ([#3](https://github.com/beacrea/dtcg-formulas/issues/3))
- [x] Ship built-in clamp definition ([#4](https://github.com/beacrea/dtcg-formulas/issues/4))
- [x] Ship built-in mix definition ([#5](https://github.com/beacrea/dtcg-formulas/issues/5))

## Phase 2 — Integration

- Ship docs generator from `.module.scssdef` metadata
- Ship Style Dictionary plugin for `org.dtcg-formulas` resolution
- [x] Ship Leonardo color definition + docs ([#8](https://github.com/beacrea/dtcg-formulas/issues/8))
- [x] Ship color-names adapter definition + docs
- [x] Ship modular-scale built-in definition + docs
- [x] Ship shade/tint adapter definition + docs
- [x] Ship fluid-size adapter definition + docs
- [x] Ship material-shadow adapter definition + docs

## Phase 3 — Expansion

- Grow the adapter catalog (spacing scales, typography, motion)
- Publish adapter authoring guide
- Evaluate generator/recipe model for one-to-many token derivation
- Revisit structured extension metadata (`arguments`, `dependencies`)
- Align with DTCG token operations developments
- Consider formal expression grammar
