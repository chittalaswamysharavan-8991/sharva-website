# Sharva Agent Rules

This project uses the Sharva Agent Job Report Method.

Every AI platform working on this project must create its role-specific job report after completing its work on a task.

## Required report location

reports/YYYY-MM-DD/<task-id>/

## Mandatory report contract

Each participating role must use its assigned filename. Do not overwrite or substitute another role's report.

| Platform / role | Required report file | Purpose |
| --- | --- | --- |
| Codex | `CODEX_JOB_REPORT.md` | Implementation or audit report. |
| Antigravity | `ANTIGRAVITY_QA_REPORT.md` | Local terminal, browser, visual, and manual QA report. |
| Pablo / ChatGPT | `PABLO_REVIEW_REPORT.md` | Visible PR review decision, risks, merge advice, and next action. |
| Final task summary | `FINAL_JOB_REPORT.md` | Optional combined summary created after the task is merged. |

The first three files are mandatory when that role participates in the task. `FINAL_JOB_REPORT.md` is optional and must not replace a participating role's report.

Examples:
- /reports/2026-06-19/task-001/CODEX_JOB_REPORT.md
- /reports/2026-06-19/task-001/ANTIGRAVITY_QA_REPORT.md
- /reports/2026-06-19/task-001/PABLO_REVIEW_REPORT.md
- /reports/2026-06-19/task-001/FINAL_JOB_REPORT.md

## Implementation and QA report minimum fields

Codex, Antigravity, and optional final reports must include:

1. Task ID
2. Platform used
3. Goal
4. Files changed
5. What was done
6. Commands/tests run
7. Result
8. Bugs or risks found
9. Pending verification
10. Next recommended action

Pablo / ChatGPT reports must follow `docs/agent-os/PABLO_REVIEW_REPORT_TEMPLATE.md`.

## Rules

- Do not edit unrelated files.
- Do not touch secrets, API keys, .env files, or credentials.
- Do not claim tests passed unless they were actually run.
- If something was not checked, write: Pending verification.
- Keep changes small and understandable.
