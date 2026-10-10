# JavaScript and TypeScript profile

Inspect package.json, lockfiles, packageManager, engine constraints, formatter/linter
configuration, and existing scripts before writing rules.

- Follow the declared package manager and lockfile; do not assume npm, Bun, or pnpm.
- Document real install, format, lint, typecheck, test, and build commands only where
  they exist. Choose scoped checks appropriate to the change; do not require a full
  build for every prose edit.
- Resolve dependency versions from the existing catalog or manifests. Preserve the
  repository's policy for shared dependencies and internal packages.
- Preserve existing naming, import, and typing conventions. Put a long style guide
  in a skill or reference only if the project already needs that level of detail.
- Check installed toolchain documentation before recording version-specific limits.
  Do not transplant another project's TypeScript or bundler caveats blindly.
- Describe available formatter/hooks/CI. Do not claim missing enforcement exists.
