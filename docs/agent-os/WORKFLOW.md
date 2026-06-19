# Agent OS Workflow

This document outlines the standard operating workflow for AI platforms/agents working on this repository.

## Agent Reporting Contract

Every task uses one report folder:

`reports/YYYY-MM-DD/<task-id>/`

Each AI worker that participates must create its own role-specific report before handoff. Reports from other roles must be reviewed when available, but must never be fabricated, renamed, overwritten, or used as a substitute.

| Platform / role | Required file | Purpose |
| --- | --- | --- |
| Codex | `CODEX_JOB_REPORT.md` | Implementation or audit report from Codex. |
| Antigravity | `ANTIGRAVITY_QA_REPORT.md` | Local terminal, browser, visual, and manual QA report from Antigravity. |
| Pablo / ChatGPT | `PABLO_REVIEW_REPORT.md` | Review decision including PR status, files reviewed, risks, decision, merge advice, and next action. |
| Final task summary | `FINAL_JOB_REPORT.md` | Optional combined summary created after the task is merged. |

The Codex, Antigravity, and Pablo reports are mandatory whenever that role participates. The final report is optional, post-merge only, and does not replace any role report.

Use [JOB_REPORT_TEMPLATE.md](./JOB_REPORT_TEMPLATE.md) for implementation and QA reports. Pablo / ChatGPT must use [PABLO_REVIEW_REPORT_TEMPLATE.md](./PABLO_REVIEW_REPORT_TEMPLATE.md).

## Step-by-Step Workflow

1. **Understand requirements**: Read the instructions/task prompt.
2. **Review rules**: Check [AGENTS.md](file:///c:/Website/AGENTS.md) for active rules, constraints, and privacy gates.
3. **Execute changes**: Make the necessary edits. Remember:
   - Keep changes small and understandable.
   - Do not edit unrelated files.
   - Do not touch secrets, API keys, `.env` files, or credentials.
4. **Run tests & verify**: Perform automated and manual verification. Do not claim tests passed unless they actually did.
5. **Create the role-specific Job Report**:
   - Locate the applicable template.
   - Create the required report in `reports/YYYY-MM-DD/<task-id>/` using the exact filename assigned above.
   - Fill out all required fields and mark anything not checked as `Pending verification.`
6. **Review handoff evidence**: Review reports from earlier workers when available. If a required upstream report is unavailable, record that fact rather than inventing its contents.
7. **Handoff**: Provide the user with a summary and links to the reports created or reviewed.
8. **Optional post-merge summary**: After merge, a final coordinator may create `FINAL_JOB_REPORT.md` as a combined task summary.
