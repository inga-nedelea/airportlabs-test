# Code structure and style

These rules are acceptance criteria for every code change. Review the diff against them before handing work back.

## Application structure

Create files and directories when they own implemented functionality; this layout does not require empty scaffolding. A single-screen app may compose its feature directly in `App.tsx` until a page has a real layout responsibility. Pages do not require a router or another dependency.

```text
src/
  main.tsx
  App.tsx
  pages/
    <PageName>/
      <PageName>.tsx
      <PageName>.module.css
  features/
    <feature>/
      api/
      components/
      hooks/
      mapping/
      types/
      constants/
      errors/
      utils/
  shared/
  styles.css
  test/
```

- `main.tsx` bootstraps React; `App.tsx` composes the application root.
- `pages/<PageName>/` owns screen layout and composes feature components and hooks. Pages and components do not call `fetch` or perform transport decoding or business transformations. Colocate CSS Modules with their page or component.
- `features/<feature>/` owns its behavior. Keep components, hooks, API requests, mapping, types, constants, errors, and focused utilities in their respective directories rather than combining responsibilities.
- Feature `api/` modules own native `fetch`, HTTP-status checks, and JSON decoding, then invoke validation/mapping to return domain values. They do not own React state, timers, or request lifecycle.
- Feature `hooks/` own React request state, lifecycle, timers, cancellation, and latest-request protection. They invoke the API with an `AbortSignal` and stable session context as needed. Request flow is **page → feature hook → feature API → validation/mapping**.
- Pages compose features; features do not import pages or reach into another feature's internals. `shared/` is only for code with actual consumers across features and must not import feature or page code. Do not create a generic API framework or use shared utilities as a dumping ground.
- `styles.css` holds global styles. `test/` holds shared test setup only; keep tests beside the feature code they verify.

## Implementation rules

- Put types in separate type files. Keep them simple; do not use `any` or assertions that conceal unvalidated external data.
- Centralize domain labels, configuration values, identifiers, error codes, and error messages in constants files. Do not scatter magic strings or numbers through behavior. Native API option keys and trivial index arithmetic do not need their own constants.
- Use typed errors for expected domain failures at external boundaries, with stable categories and actionable context such as the invalid field, source identifier, or original cause. Do not throw a generic `new Error` for those failures. Keep the error mechanism small rather than introducing an elaborate framework.
- Validate input shape, consumed fields, and applicable invariants in readable sequential steps. Check uniqueness when the contract requires it. Use small named guards; do not hide validation in a giant compound condition.
- Separate validation from mapping. Use a named API-to-domain mapper and focused derivation helpers. Keep callbacks small; do not combine boundary validation, invariant checks, and domain construction in one callback or use nested ternaries.
- Make arithmetic explain itself through meaningful intermediate names for index conversion, wrapping, unit conversion, and multi-step formulas. Avoid compressed calculation chains inside returned objects. Add a short why comment when a formula or wraparound is not obvious.
- Separate declarations, guards, iteration/transformation, and returns with blank lines. Keep cohesive consecutive declarations together and separate distinct type declarations.
- Keep control-flow bodies in braces. `pnpm lint` enforces statement padding, braces, and no nested ternaries. Run `pnpm lint --fix` for available fixes, then `pnpm format`.
- Do not disable or weaken lint rules to make checks pass without discussing the change with the owner.
