# Agent OS Workflow

This document outlines the standard operating workflow for AI platforms/agents working on this repository.

## Step-by-Step Workflow

1. **Understand requirements**: Read the instructions/task prompt.
2. **Review rules**: Check [AGENTS.md](file:///c:/Website/AGENTS.md) for active rules, constraints, and privacy gates.
3. **Execute changes**: Make the necessary edits. Remember:
   - Keep changes small and understandable.
   - Do not edit unrelated files.
   - Do not touch secrets, API keys, `.env` files, or credentials.
4. **Run tests & verify**: Perform automated and manual verification. Do not claim tests passed unless they actually did.
5. **Create the Job Report**:
   - Locate the template at [JOB_REPORT_TEMPLATE.md](file:///c:/Website/docs/agent-os/JOB_REPORT_TEMPLATE.md).
   - Create a report in `/reports/YYYY-MM-DD/task-id/PLATFORM_JOB_REPORT.md` (e.g., `/reports/2026-06-19/task-001/ANTIGRAVITY_QA_REPORT.md`).
   - Fill out all required fields.
6. **Handoff**: Provide the user with a summary and a link to the job report.
