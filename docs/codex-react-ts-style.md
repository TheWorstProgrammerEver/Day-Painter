# Codex React TS Style

Day Painter is the reference project for Ryan's small React TypeScript MVP style.

Reference implementation:

```text
https://github.com/TheWorstProgrammerEver/Day-Painter
```

The durable Codex skill lives outside this repo:

```text
~/.codex/skills/day-painter-react-ts
```

Use it for future React TypeScript MVPs when the prompt says things like:

```text
Use the Day Painter style.
Use Ryan's React TS MVP guardrails.
Start this like Day Painter.
```

The skill captures:

- Vite, React, TypeScript, React Router, SCSS modules, Vitest, and Playwright
- semantic HTML and native controls before ARIA
- `src/domain`, `src/data`, `src/state`, `src/screens`, and component-folder conventions
- small files, low-noise TypeScript, no semicolons
- runtime `window.config` via `public/config.js` and `config.deploy.js`
- skeptical dependency selection with preference for official/high-reputation vendors
- minimal but meaningful unit and visual coverage

This repo should remain a useful concrete reference, but future agents should use the skill as the portable starting point.
