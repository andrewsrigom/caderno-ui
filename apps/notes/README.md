# Caderno Notes

A small React / Next.js App Router consumer. It starts empty and stores notes
under `caderno-ui:notes-example:v1` in this browser. No backend or authentication.
Storage failures preserve the previous data and the current draft. Other tabs
refresh from storage; concurrent edits to the same note are last-write-wins.

From the repository root:

```sh
pnpm build:packages
pnpm --filter @caderno-ui/notes-example dev
```

The development app uses port 5190. The public example is a static export built
by `pnpm docs:check` at `/caderno-ui/examples/react/`.

`pnpm pack:check && pnpm test:frameworks` installs tarballs in a fresh OS
temporary directory and checks both a static export and a separate Next.js
server. The server-only fixture calls `connection()` and changes its render ID
on every request; it is not included in the public static app.

Component appearance comes entirely from public Caderno UI exports. Local CSS
only arranges the app. Native slotted content is server-rendered; this example
does not provide Lit shadow-root SSR or pretend local notes are available
without JavaScript.

Unmodified Caveat fonts are self-hosted under SIL OFL 1.1; see
`public/Caveat-OFL.txt`. No font binaries are added to the library packages.
