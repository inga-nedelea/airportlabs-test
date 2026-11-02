# Airport flight board

A frontend interview project built with React, Vite, and strict TypeScript.

## Run locally

Use Node **26.13.0** and pnpm **12.16.1**. Node is pinned in `.nvmrc`; pnpm is pinned in `package.json`.

```sh
nvm install
nvm use
npm install --global pnpm@12.16.1
pnpm install --frozen-lockfile
pnpm dev
```

If you use another Node version manager, select the version from `.nvmrc`. The global pnpm installation is only needed if that version is not already available. Vite prints the local development URL.

## Checks and commands

| Command             | Purpose                                        |
| ------------------- | ---------------------------------------------- |
| `pnpm dev`          | Start the development server                   |
| `pnpm build`        | Check types and create `dist/`                 |
| `pnpm preview`      | Serve a production build locally               |
| `pnpm typecheck`    | Check application and tool configuration types |
| `pnpm lint`         | Run ESLint, including React Hooks rules        |
| `pnpm format:check` | Check formatting                               |
| `pnpm format`       | Apply formatting                               |
| `pnpm test`         | Run tests once; fails if there are no tests    |
| `pnpm test:watch`   | Run tests in watch mode                        |
| `pnpm check`        | Run all foundation checks                      |

CI runs formatting, lint, types, tests, and build on every PR and on pushes to `main`, using a frozen lockfile. There are no product tests yet: CI and `pnpm check` currently use `--passWithNoTests`. A passing empty suite does not verify application behavior.

Vitest, React Testing Library, and jsdom are configured.

`pnpm lint` enforces blank lines between logical steps, braces around control-flow bodies, and no nested ternaries. Run `pnpm lint --fix` to apply available fixes, then `pnpm format`.

## Project structure

- `src/features/flights/components` contains the flight board and its CSS Module.
- `src/features/flights/types` defines the API and flight types.
- `src/features/flights/constants` contains airport and schedule values.
- `src/features/flights/errors` defines typed flight-data errors.
- `src/features/flights/mapping` transforms API data into flights.
- `src/features/flights/utils` validates responses and handles airport dates.
- `src/test/setup.ts` configures the test environment.
- `.github/workflows/ci.yml` defines the CI checks.
