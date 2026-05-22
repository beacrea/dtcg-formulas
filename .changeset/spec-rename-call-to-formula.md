---
'@dtcg-formulas/spec': patch
---

Rename the `org.dtcg-formulas` extension call-string key from `"call"` to `"formula"`. The README, every example, and every user-facing doc page already used `"formula"`; the spec source was the only holdout. This is a clarifying alignment, not a wire-format break: the syntax version stays at `scssdef@0.1` because no public tooling consumed either key at runtime in 0.1.0.

Tools and authors should now use `"formula"`. The `"call"` key is not supported.
