# HTML + Vite Reproduction Starter

A standalone starter project for reproducing Caderno UI bugs without cloning or building the entire repository.

## Requirements

- Node.js 22.12 or newer

## Getting Started

1. Copy this directory (`examples/reproductions/html`) to a local folder or create a sandbox (e.g. StackBlitz/CodeSandbox).
2. Install dependencies:

   ```sh
   npm install
   ```

   _(or `pnpm install` / `yarn install`)_

3. Start the Vite development server:

   ```sh
   npm run dev
   ```

4. To test a production bundle:

   ```sh
   npm run build
   npm run preview
   ```

## Where to Edit

- [`index.html`](./index.html): Add your component markup or repro structure.
- [`main.js`](./main.js): Import required styles, tokens, and specific component subpaths (e.g., `@caderno-ui/elements/button`), plus event listeners or logic.
