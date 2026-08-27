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
