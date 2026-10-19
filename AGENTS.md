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
- For skill development in this repository, create a local commit after each
  independent, complete change passes the required checks, then push it to the
  current branch's configured upstream. The user has authorized this workflow;
  no additional confirmation is needed for routine commits and pushes.
- Keep unrelated changes in separate commits. Stage only files or hunks belonging
  to the current task; do not include pre-existing unrelated work.
- Never force-push. If the upstream is missing or a push is rejected, report the
  blocker without inventing a remote destination or rewriting shared history.
- Do not publish releases or install globally unless requested. This repository's
  commit and push authorization must not be copied into target project templates.
- Verify with `npm run check` and `npm test` (or the equivalent Bun commands).
- Format changed JavaScript and JSON with Biome before finishing. Markdown is
  maintained manually because Biome does not format it.
