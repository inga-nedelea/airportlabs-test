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

The board fetches JSONPlaceholder posts from `https://jsonplaceholder.typicode.com/posts`, so loading and refreshing real data requires internet access. Flight fields are deterministic demo data, not live airport information.

## Local production demo

```sh
pnpm build
pnpm preview
```

Open the URL printed by Vite (normally `http://localhost:4173`). The demo uses the local production build; no hosted deployment is required. Expand **Demo controls** to simulate a failed refresh or reload with an initial failure, then use **Retry now** to recover.

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
| `pnpm check`        | Run formatting, lint, types, tests, and build  |

CI runs three jobs on every PR and on pushes to `main`, using a frozen lockfile: **Lint** checks formatting and ESLint, **Test** runs Vitest, and **Build** checks TypeScript and builds the app. An empty test suite fails.

Six tests use Vitest, React Testing Library, and jsdom: three async hook tests cover request ordering, stale-data recovery, and failure simulation with controlled fetch responses and fake timers; three board tests cover search, group navigation, focus, and URL history.

`pnpm lint` enforces blank lines between logical steps, braces around control-flow bodies, and no nested ternaries. Run `pnpm lint --fix` to apply available fixes, then `pnpm format`.

## Project structure

- `src/main.tsx` bootstraps React and the router; `src/App.tsx` composes routes.
- `src/pages` composes the flight dashboard and Not Found page.
- `src/features/flights/api` owns fetching, HTTP checks, and JSON decoding.
- `src/features/flights/hooks` owns request state/lifecycle, demo failure controls, and URL-backed filters/grouping.
- `src/features/flights/components` contains the board, request feedback, demo controls, and CSS Modules.
- `src/features/flights/types` defines the API and flight types.
- `src/features/flights/constants` contains airport and schedule values.
- `src/features/flights/errors` defines typed data and request errors.
- `src/features/flights/mapping` transforms API data into flights.
- `src/features/flights/utils` validates responses, groups flights, and handles airport dates/times.
- `src/styles/tokens.css` contains shared design values; local styles use CSS Modules.
- Feature tests live beside the code they verify.
- `src/test/setup.ts` configures the test environment.
- `.github/workflows/ci.yml` defines the CI checks.

## Contributions and reflection

**Candidate:** supplied the challenge brief and repository, chose and challenged tooling and behavior decisions, and retained final merge responsibility. **AI:** generated the application, tests, configuration, CI, and documentation through developer agents, with owner-agent review and verification.

**Corrections:** the candidate redirected the initial Next.js/npm suggestions to Vite/pnpm. AI agents made verification-driven fixes too: TypeScript 7 was replaced with TypeScript 6.0.3 after linting exposed an unsupported compiler version, and review of blocked browser storage led to a safe fallback for the failure demo.

**With more time:** I would refine information hierarchy and navigation for long flight lists: consolidate update status, the visible flight count, and Refresh into a compact persistent toolbar, then evaluate terminal-based browsing or pagination. Windowing would be considered only if larger datasets showed a rendering problem. These are future UI/UX improvements, not implemented features.
