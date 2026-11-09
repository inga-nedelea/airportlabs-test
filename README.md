# Airport flight board

A frontend interview project built with React, Vite, and strict TypeScript.

## Set up locally

You need Git, Node **26.13.0**, and pnpm **12.16.1**. Node is pinned in `.nvmrc`; pnpm is pinned in `package.json`. The commands below assume `nvm` is already installed and available in your shell. With another Node version manager, install/select the version from `.nvmrc` instead of running the two `nvm` commands.

```sh
git clone https://github.com/inga-nedelea/airportlabs-test.git
cd airportlabs-test
nvm install
nvm use
npm install --global pnpm@12.16.1
pnpm install --frozen-lockfile
```

Skip the global pnpm installation if `pnpm --version` already reports `12.16.1`. Run the remaining commands from the `airportlabs-test` directory. No `.env` file, API key, or backend setup is needed.

Internet access is needed to install dependencies and load/refresh data from `https://jsonplaceholder.typicode.com/posts`. Flight fields are deterministic demo data, not live airport information. If the service is unavailable, the board shows an error; restore connectivity and choose **Retry now**.

## Review the production build

After setup, run all checks and start the local production preview:

```sh
pnpm check
pnpm preview
```

`pnpm check` runs formatting, lint, TypeScript, the six automated tests, and the production build. To rebuild without running all checks, use `pnpm build` before `pnpm preview`.

Open the URL printed by Vite, normally [http://localhost:4173](http://localhost:4173). If that port is occupied, use the different URL Vite prints. Leave the terminal running while reviewing; press **Ctrl+C** to stop the server. The presentation demo uses this local production build; no hosted deployment is needed.

### Try the board

1. Confirm each flight shows departure time, flight number, destination, status, gate, and terminal. Flights start grouped by terminal, and times are labelled **Europe/Chisinau**, using a 24-hour clock.
2. Change **Status** from **All statuses** to **Delayed**. The URL gains `status=delayed`; reload it, then change the selection and use browser Back/Forward to restore earlier selections.
3. Choose **Refresh**, or wait for the 30-second automatic refresh. Existing flights remain visible during a background request, and the last-success timestamp changes only after success.
4. Expand **Demo controls**, choose **Fail next request**, then **Refresh**. The next manual or automatic request consumes the one-shot failure. Existing flights and their last-success time remain visible with a stale-data warning. Choose **Retry now**; success clears the warning, and automatic retries continue if a request fails.
5. Choose **Reload with a simulated failure** to demonstrate failure before any data has loaded. The current URL is preserved; **Retry now** loads the board again. This reload action needs browser session storage; if storage is blocked, use **Fail next request** instead.
6. Narrow the browser to see flight cards with the same fields, and use Tab to reach the labelled controls and visible focus indicators. Search, **Group by**, and terminal jump links provide additional ways to navigate the board.

## Development server

For development with live updates, use this instead of the production preview:

```sh
pnpm dev
```

Open the printed URL, normally [http://localhost:5173](http://localhost:5173). Stop either server with **Ctrl+C** before starting the other, or use a second terminal.

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
