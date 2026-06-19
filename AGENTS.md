# Sharva Agent Rules

This project uses the Sharva Agent Job Report Method.

Every AI platform working on this project must create a job report after completing a task.

## Required report location

/reports/YYYY-MM-DD/task-id/PLATFORM_JOB_REPORT.md

Examples:
- /reports/2026-06-19/task-001/CODEX_JOB_REPORT.md
- /reports/2026-06-19/task-001/ANTIGRAVITY_QA_REPORT.md
- /reports/2026-06-19/task-001/FINAL_JOB_REPORT.md

## Every job report must include

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

## Rules

- Do not edit unrelated files.
- Do not touch secrets, API keys, .env files, or credentials.
- Do not claim tests passed unless they were actually run.
- If something was not checked, write: Pending verification.
- Keep changes small and understandable.
