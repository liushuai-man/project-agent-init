# Behavioral acceptance

These are manual skill evaluations, not assertions executed by `npm test`.
Use a fresh temporary repository per case. Invoke the local skill explicitly and
retain the input, resulting diff, commands run, and findings. Never use a live
project or push fixture changes. Repeat the same request without changing inputs
and inspect the second diff for duplicated sections or unnecessary rewrites.

Common request: "Use project-agent-init to initialize or improve this repository's
AGENTS.md and README, deriving commands from the repository."

| Case | Minimal input to create | Observable acceptance |
| --- | --- | --- |
| Empty project | An empty directory; user specifies no stack yet | No invented package manager, build command, version, or release policy; only known agreements; missing stack is reported or clarified. |
| Existing custom rules | README with a product description; AGENTS.md requiring user approval before publishing; package.json with only a test script | Product description and publishing restriction survive; only real scripts are documented; no extra lint/build claims. |
| React without Next.js | package.json declaring React, with no Next.js dependency; a src component | React profile is adapted; no Next.js route or server-component requirements are imposed. |
| Monorepo | Root package.json with workspaces apps/* and packages/*; app and library manifests with different test scripts; app AGENTS.md with a local constraint | Root points to local guidance; app constraint survives; verification scope follows actual scripts; no invented ownership or release boundaries. |
| Conflicting policy | AGENTS.md says to use npm; packageManager and lockfile identify a different manager | Conflict is surfaced and resolved from evidence or user input; conflicting commands are not silently retained together. |

For every case, check that generated files have no template fields, all local
references resolve, and the completion report distinguishes executed checks from
inspection. Do not count a self-review or passing installer tests as an independent
behavioral evaluation. Record the agent/model and date when running these cases.
