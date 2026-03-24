# FAQ

## Is this executable Sass?

No. `.module.scssdef` is Sass-*inspired*, not Sass-executable. It uses familiar syntax as a documentation and interface layer. If you feed it to a Sass compiler, you will be disappointed.

## Does this replace DTCG?

No. `$value` remains the canonical resolved token value. The `org.dtcg-formulas` extension is optional provenance metadata.

## Why not just use Style Dictionary transforms?

Style Dictionary transforms operate at build time but don't preserve provenance in the token file itself. `dtcg-formulas` makes the formula visible, documentable, and portable.

## Can I use this with tools other than Style Dictionary?

Yes. The specs are tool-agnostic. The Style Dictionary plugin is one reference integration.

## Why the `org.` prefix?

The extension key `org.dtcg-formulas` follows the DTCG vendor extension convention. The `org.` prefix is backed by the `dtcg-formulas.org` domain.
