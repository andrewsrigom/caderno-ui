# Release and recovery

## Normal release

Changesets keep all public packages in a fixed version group while the project
is below 1.0. Merging a public change to `main` creates or updates the version
pull request. Merging that pull request causes the release workflow to verify,
pack, dry-run, and publish the exact validated tarballs with npm provenance.

Run `pnpm release:dry-run` locally before a high-risk release. Local execution
can never publish; the publishing path requires the trusted GitHub Actions
environment.

Before publishing, the release script also runs the production documentation
tests and packed consumer checks for React 18 / Astro 5 / TypeScript 5 and
React 19 / Astro 7 / TypeScript 6. Compatibility failures stop the release;
they must not rely only on the separate CI workflow.

The gate also runs React 18/19 browser consumers and Next.js 16 static/SSR
consumers, plus Vue 3 and Svelte 5 property/event/slot checks in Chromium,
Firefox and WebKit. All consumers install exact tarballs in fresh OS temporary
directories. Laboratory tests use port 5198, docs use 5187, framework consumers
use 5192–5194, and the isolated SeniorPath candidate uses 5196.

Before publication, run `node scripts/check-senior-consumer.mjs <checkout>`.
It copies tracked/non-ignored SeniorPath source, installs the candidate tarballs,
and exercises the library integration with disposable content. It does not run
the separate editorial-catalog unit suite against private production data.
Documentation tests also serve a disposable copy of the build, without taking
over the developer's Astro preview.
After publication, update the product's dependencies and remove development
overrides. Never run fixture generation against the user's active content.

The automated gate does not replace the [manual accessibility checks](accessibility.md).
Record their results before authorizing publication. A successful dry run is a
package verification result, not evidence of NVDA or VoiceOver testing.

Documentation can deploy before npm publication. Keep the release-status
notice in the README and Getting started page until the candidate is published;
remove it after confirming all six package versions on npm.

See the [0.5.1 release record](validation/0.5.1.md) for delivery evidence and
the maintainer-approved exception for unperformed manual accessibility checks.
The [0.5.0 candidate record](validation/0.5.0.md) retains the earlier results.

`pnpm docs:check` includes the Next.js static export under
`/caderno-ui/examples/react/`. The hosted example must not be described as an
SSR deployment. The independent `next start` consumer is the SSR evidence.

## Failure and recovery

npm versions are immutable, so there is no transactional rollback across the
fixed package group. If publishing stops partway through:

1. Do not replace or unpublish already released versions.
2. Inspect the workflow log and npm package pages to identify which exact
   versions exist.
3. Correct credentials or infrastructure without changing package contents.
4. Re-run the same release only for missing packages, then verify the complete
   fixed group.
5. If an artifact is defective, publish a new patch with a Changeset and mark
   the defective version deprecated with a precise replacement message.

Use `npm deprecate @caderno-ui/package@version "Use version X.Y.Z: reason"` only
after confirming the exact package and version. Deprecation is preferred over
unpublishing because it preserves reproducible installs.

## Compatibility changes

Deprecate an API in documentation and release notes before removal. Include its
replacement and expected removal window. Below 1.0, removals follow the support
policy and still require an explicit migration note; security exceptions must
be explained in the advisory and release notes.
