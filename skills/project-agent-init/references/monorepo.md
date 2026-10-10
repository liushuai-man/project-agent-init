# Monorepo profile

Inspect workspace declarations, task runner configuration, dependency catalogs,
package scripts, README, and existing local instruction files.

- Identify the primary product, active workspaces, shared packages, and explicitly
  excluded directories from evidence. Do not infer inactivity from unfamiliar names.
- Root instructions define shared policy; workspace instructions contain exceptions
  and contracts. Require reading relevant local guidance before editing a workspace.
- Separate workspace dependency rules from external dependency rules where the
  repository does so. Preserve catalogs and shared-version constraints.
- Record scoped verification commands when available, accounting for affected
  dependents when a shared package changes.
- Document ownership and release boundaries only when maintained repository sources
  establish them. Never import another team's branches or tracker lifecycle labels.
- Keep reusable workflow skills in one maintained location; create compatibility
  links only when the requested tooling needs them and the platform supports them.
