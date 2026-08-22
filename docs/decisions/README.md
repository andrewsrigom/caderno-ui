# Architecture decisions

Architecture Decision Records capture choices that affect every component or
published package. They are intentionally short and should be superseded by a
new record instead of silently rewritten after a decision changes.

| ADR                                            | Decision                                          |
| ---------------------------------------------- | ------------------------------------------------- |
| [0001](./0001-auto-registering-entrypoints.md) | Individual element entrypoints auto-register      |
| [0002](./0002-cem-contract-source.md)          | Source and CEM own the machine-readable contract  |
| [0003](./0003-css-token-source.md)             | CSS remains the token source of truth for 0.2     |
| [0004](./0004-framework-adapters.md)           | Framework adapters stay thin and justified        |
| [0005](./0005-ssr-and-hydration.md)            | Prefer resilient light DOM before Lit hydration   |
| [0006](./0006-optional-heavy-entrypoints.md)   | Keep dependency-heavy features in opt-in subpaths |
