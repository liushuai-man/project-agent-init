# React and Next.js profile

Use only the portions that match the target. A React repository need not use Next.js.
Inspect installed dependencies, route structure, and existing component patterns.

- Identify server/client boundaries when the framework uses them; preserve the
  existing boundary and follow installed-version APIs.
- For Next.js, check bundled documentation under node_modules/next/dist/docs when
  available. Otherwise consult version-matched official documentation as needed.
- For UI libraries, use local documentation caches and installed types first; check
  official documentation when needed. Do not copy old variant names or compound
  component APIs from memory.
- Preserve the project's styling system, utility helpers, and accessibility patterns.
  Do not impose HeroUI, Tailwind, or another source project's component stack.
- Distinct app constraints belong in app-level AGENTS.md when useful. Do not create
  a separate guide for every component directory.
- Document UI verification already supported by the project, such as a preview or
  screenshot workflow. Do not add browser infrastructure merely to generate rules.
