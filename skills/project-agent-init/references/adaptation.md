# Adapting instructions

## Put knowledge at the right scope

- Personal defaults belong in a user-level instruction file only when requested.
  Do not modify a user's global configuration as a side effect of project setup.
- Root AGENTS.md covers repository-wide boundaries, commands, working agreements,
  and durable constraints that cannot be reliably inferred from code.
- Nested AGENTS.md covers local exceptions and contracts. Codex startup discovery
  follows the root-to-working-directory path; instruct agents at the root to read
  relevant nested guidance before editing a workspace from a root session.
- Skills hold recurring procedures with precise triggers. References hold details
  needed only for specific modes; assets hold output templates.
- README explains how humans use and maintain the system.
- Formatters, type checks, tests, hooks, and CI enforce rules that tools can verify.

Do not write a rule for every file, version, or routine implementation decision.
Describe a source of truth when possible rather than duplicating its contents.
Record a version-specific trap only when it changes agent behavior; include how to
verify it against the installed version.

## Initializing and updating

1. Establish the target directory and inspect its existing guidance and configuration.
2. Choose relevant templates and keep unsupported policy decisions out of the output.
3. Replace `{{...}}` fields using repository evidence. Remove inapplicable sections.
4. Merge into existing files; never replace a customized guide wholesale.
5. Confirm every local reference resolves and every documented command exists.
6. Run the existing formatter/checks appropriate to the changed files.
7. Update README so installation and invocation match the delivered state.

A newly empty project can receive a concise guide without fictional commands.
Explain missing information in the completion report rather than leaving template
placeholders in generated files.

When updating from a newer template, compare changes and retain local customizations.
Do not re-copy a newer baseline over generated project instructions automatically.

## Completion evidence

Report what files were changed, which profile rules apply, what commands were
actually run, and what was verified by inspection only. A broken existing command
is a repository finding, not permission to expand initialization into unrelated fixes.

## Discovery references

Consult these official references only when discovery or cross-agent compatibility
needs verification; the workflow should still work without a documentation connector.

- [Codex instruction discovery](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [Codex skills](https://learn.chatgpt.com/docs/build-skills)
