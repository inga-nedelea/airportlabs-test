# Airport flight board

A frontend interview project built with React, Vite, and strict TypeScript.

**Current status: foundation plus flight model.** D1 adds validated, deterministic mapping independent of the UI. The app still renders the starter page; fetching, filters, grouping, refresh behavior, product tests, and deployment remain planned.

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

CI runs formatting, lint, types, tests, and build as five checks on every PR and on pushes to `main`, using a frozen lockfile. **There are no product tests yet.** During foundation setup only, CI and `pnpm check` explicitly use `--passWithNoTests`; the CI summary calls out the empty suite. This proves the runner starts, not that flight behavior works. Remove the allowance when adding the two planned async tests.

Vitest, React Testing Library, and jsdom are configured. The later tests will cover out-of-order request completion and failed-refresh retention/recovery.

## Structure and decisions

- `src/features/flights` holds the starter and `flightModel.ts`; future flight UI, fetching, grouping, CSS Modules, and nearby tests stay here.
- [AGENTS.md](AGENTS.md) records the core requirements, agreed implementation choices, and agent responsibilities. [CLAUDE.md](CLAUDE.md) imports those same instructions.
- Optional planning notes in `docs/` stay local and gitignored. They are not needed to run or contribute to a clean clone.

Keep the app client-side with native `fetch` and React hooks. Use local reducer state for the board and the URL for the status filter. Deployment to Vercel follows the flight-board implementation.

## Flight mapping (D1)

`mapFlightResponse(unknown, sessionAirportDate)` validates the entire JSONPlaceholder posts response. IDs and user IDs must be positive safe integers, titles must be nonblank strings, and duplicate IDs reject the response. Extra fields are ignored, titles are preserved verbatim, and `[]` succeeds. The mapping does not mutate its input.

`id` becomes `FL-{id}`, `userId` becomes the numeric terminal, and `title` becomes the destination. IDs divisible by 10 are Cancelled; otherwise those divisible by 3 are Delayed; the rest are On Time. Gates cycle through G-1–G-20. Departures cycle through 216 five-minute slots from 06:00 to 23:55 using `(id - 1) % 216`, so refreshes and record reordering do not change derived values.

`createSessionAirportDate(now)` gets the calendar date in `Europe/Chisinau`, independent of the viewer's timezone. D2 must capture it once when the dashboard session starts and reuse it for every refresh. A departure stores that ISO calendar date plus minutes after midnight as **airport civil time**, not a UTC instant or a string to parse with the viewer's local `Date`. D3 can render hours/minutes directly and label the airport timezone. The fixed daytime schedule avoids missing/repeated local times at DST transitions and includes past departures; it does not roll forward at midnight during a session.

## AI use and reflection

The candidate selected and challenged the design and implementation choices through discussion. AI generated the foundation code, configuration, and documentation, then the D1 model/mapping and shared documentation updates. The candidate approved duplicate-ID rejection, field validation rules, and the fixed daytime schedule during the D1 discussion. The candidate has not been represented as manually writing that generated code.

One correction to AI output: the initial dependency selection used TypeScript 7.0.2, but the lint check showed that typescript-eslint does not support it. The compiler was changed to TypeScript 6.0.3, the latest compatible stable release, instead of introducing two compiler installations. The candidate also corrected the initial planning approach and selected Vite, pnpm, and a current LTS Node version.

Local frozen installation, peer dependency validation, formatting, lint, type checking, and production build passed. A temporary two-case test verified the React Testing Library/jsdom setup and cleanup, then was removed; it was not product coverage. CI results and subsequent corrections belong in the relevant PR. D1 was also checked with temporary Node assertions for valid/invalid/empty responses, deterministic mapping, input preservation, safe-integer limits, airport midnight, year rollover, and both 2026 DST transitions under UTC, America/Los_Angeles, Asia/Tokyo, and Europe/Chisinau viewer timezones. Those assertions are not committed product tests; the two planned async tests remain D2 work.

**One decision to revisit with more time:** pending experience with the completed implementation. Record a real tradeoff before submission rather than inventing a retrospective during setup.

Agents may implement, review, verify, commit, and open PRs according to their assigned role. The human repository owner reviews and merges.
