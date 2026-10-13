---
name: project-agent-init
description: Initialize or adapt a repository's agent instruction system using its actual stack, commands, and boundaries. Use when asked to set up AGENTS.md, project agent rules, or migrate an existing rule system to a new project.
metadata:
  version: "0.1.0"
---

# Project agent initialization

Build a compact instruction system that fits the target repository. Use English
for instruction files and match the user's language for explanations. Honor any
explicit language preference for generated files.

## Inspect before adapting

Read existing ancestor and repository instructions first. Inspect the smallest
useful set of files: README, dependency manifests, scripts, workspace configuration,
CI, formatter configuration, and relevant directory boundaries. Resolve the target
path before writing; do not modify the template repository when initializing a
separate project. Do not read credentials, generated output, or dependency trees
unless needed for a specific compatibility check.

State the intended scope and a verifiable success check. If the repository is empty,
write only the known working agreement; ask about the intended stack when needed.
Do not invent commands, versions, workspace ownership, branches, or release policies.
If runtime commands are unavailable, report what could not be verified.

## Select only useful material

Read [adaptation guidance](references/adaptation.md). Start with
[the root template](assets/root-agents.md), replacing its template fields with
verified facts. Select profiles only when the repository uses their technologies:

- [JavaScript / TypeScript](references/javascript.md): package scripts, toolchain,
  dependency policy, and formatting.
- [React / Next.js](references/react-next.md): component boundaries, installed
  framework documentation, and UI library compatibility.
- [Monorepo](references/monorepo.md): workspace boundaries and scoped verification.

Compose selected guidance into existing instruction files; do not copy every
reference into the target project. Add [workspace instructions](assets/workspace-agents.md)
only for directories with distinct constraints. Avoid repeating root guidance.
Use [the workflow skill template](assets/workflow-skill.md) only for a concrete,
recurring workflow requested by the user or demonstrated by the repository.
Do not create empty skill folders or import every skill from a source project.

## Preserve and verify

For existing projects, merge narrowly and preserve project-specific decisions.
On repeated runs, update the existing sections instead of appending parallel guides.
If repository evidence and requirements have not changed, avoid rewriting equivalent
instructions. Preserve unrelated README content and local customizations.
For migration, extract reusable rules and adapt project names, integration URLs,
release policies, and commands. When existing rules conflict, use actual repository
configuration as evidence and ask about unresolved policy decisions.

Inspect CLAUDE.md or other agent entry points if they exist. Preserve their current
arrangement; create an adapter only if the user requests that agent's support.
Keep one maintained source for shared instructions and use supported references or
links rather than duplicated full guides.

Review generated files for unfilled template fields, missing references, unsupported
claims, duplicate rules, and executable commands that do not exist. Run the relevant
existing formatter and the agreed verification where available. Do not install new
dependencies or change CI just to initialize instruction files; propose necessary
mechanical enforcement separately unless the user authorized it.

Update the target README with the rule locations, available skills, and verified
commands. Summarize changed paths, selected profiles, preserved conventions, checks,
and unresolved facts. Instruction files guide behavior; hooks and CI enforce
mechanically testable rules. Do not claim Markdown alone guarantees compliance.
