# Agent guide

This repository distributes the `project-agent-init` skill and its templates.
User-facing explanations and README content use Simplified Chinese. Agent instruction
files and templates use English.

- Keep the skill self-contained under `skills/project-agent-init/` so copying that
  directory preserves all references and assets.
- Maintain README.md whenever installation, invocation, supported profiles, or
  validation changes. Distinguish implemented behavior from future ideas.
- Templates provide a starting point. Derive project commands, versions, paths,
  and release rules from the target repository; never invent them.
- Keep the installer dependency-free and refuse to overwrite an existing skill.
- Do not publish, commit, push, or install globally unless requested.
- Verify with `npm run check` and `npm test` (or the equivalent Bun commands).
- Format changed JavaScript and JSON with Biome before finishing. Markdown is
  maintained manually because Biome does not format it.
