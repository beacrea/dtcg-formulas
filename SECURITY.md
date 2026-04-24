# Security Policy

## Supported versions

Until 1.0, the latest minor release is the only supported line. Earlier versions will not receive backported fixes.

| Version | Supported |
|---|---|
| Latest 0.x | Yes |
| Older 0.x | No |

## Reporting a vulnerability

If you discover a security issue in any `dtcg-formulas` package, please report it privately via [GitHub's private vulnerability reporting](https://github.com/beacrea/dtcg-formulas/security/advisories/new) on this repository.

Please do **not** open a public issue for security reports.

Expect an initial response within 7 days. We will keep you updated on the progress of a fix and credit you in the release notes once a fix is published, unless you prefer to remain anonymous.

## Scope

In scope:

- Code in `@dtcg-formulas/*` packages published to npm.
- Code in this repository's `packages/` directory.

Out of scope:

- Third-party adapters not maintained in this repository.
- Vulnerabilities in transitive dependencies (please report those upstream).
- Issues that require a malicious `.module.scssdef` file authored by the user themselves — formula definitions are trusted input.
