# Code structure and style

These rules are acceptance criteria for every code change. Review the diff against them before handing work back.

- Keep feature code under `src/features/flights`, separated by responsibility: `components/` with nearby CSS Modules, `types/`, `constants/`, `errors/`, `mapping/`, `utils/`, and `hooks/`. Create directories only when they contain actual functionality; do not add empty scaffolding or a general framework.
- Put types in separate type files. Keep them simple; do not use `any` or assertions that conceal unvalidated external data.
- Centralize domain statuses, prefixes, schedule values, error codes, and error messages in constants files. Do not scatter magic strings or numbers through behavior. Native API option keys and trivial index arithmetic do not need their own constants.
- Use a small typed feature error mechanism for expected domain failures at external boundaries, with stable codes and relevant field, duplicate-ID, or cause details. Do not throw a generic `new Error` for those failures or build an application-wide error framework.
- Validate response shape, individual consumed fields, and uniqueness in readable sequential steps. Use small named guards; do not hide validation in a giant compound condition.
- Separate validation from mapping. Use a named post-to-flight mapper and named status, gate, and departure helpers. Keep callbacks small; do not combine validation, duplicate checks, and domain construction in one callback or use nested ternaries.
- Make arithmetic explain itself through named intermediate values: flight index, gate index, gate number, departure slot, and elapsed minutes. Avoid compressed calculation chains inside returned objects. Add a short why comment when cycling or wraparound is not obvious.
- Separate declarations, guards, iteration/transformation, and returns with blank lines. Keep cohesive consecutive declarations together and separate distinct type declarations.
- Keep control-flow bodies in braces. `pnpm lint` enforces statement padding, braces, and no nested ternaries. Run `pnpm lint --fix` for available fixes, then `pnpm format`.
- Do not disable or weaken lint rules to make checks pass without discussing the change with the owner.
