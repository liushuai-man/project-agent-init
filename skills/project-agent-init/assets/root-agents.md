# {{project_name}} — Agent guide

## Project and boundaries

{{project_purpose_and_active_paths}}

Read the relevant nested AGENTS.md before editing a workspace. Follow existing
README and configuration as the source of truth.

## Working agreement

- State material assumptions and a verifiable success check before implementation.
- Make the smallest change that solves the request; preserve surrounding conventions.
- Resolve consequential ambiguity before dependent work, while progressing on
  independent work that is already authorized.
- Run the existing formatter on changed supported files and appropriate checks.
- Report actual verification results and limitations.
- Update guidance only for durable constraints or corrected instructions; do not
  use agent files as a changelog.

## Commit workflow

- Follow the project's commit policy and the user's authorization for Git actions.
- Plan changes as small, coherent units that can be reviewed and reverted independently.
- When commits are authorized, commit each complete unit after its required checks
  pass, before starting the next independent change. Do not defer all commits until
  the end of a multi-change task.
- Keep implementation and its necessary tests and documentation together. Do not
  split mechanically by file, line count, or a fixed number of commits.
- Inspect the staged diff and include only files or hunks for the current unit;
  preserve pre-existing unrelated work. Use a message describing the change's purpose.
- Commit authorization does not imply push authorization; follow the project's
  separate push policy.

## Verified commands

{{verified_commands}}

## Project-specific constraints

{{durable_constraints_and_sources}}
