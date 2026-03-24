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
- Ship Leonardo scalar adapter example (`leonardo.color`)

## Phase 3 — Expansion

- Evaluate generator/recipe model for one-to-many token derivation
- Revisit structured extension metadata (`arguments`, `dependencies`)
- Align with DTCG token operations developments
- Consider formal expression grammar
