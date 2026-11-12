# Apeiron — Rules for AI agents (Antigravity and others)

Follow every rule in @CLAUDE.md exactly; it is the source of truth.

## Critical rules (repeated from CLAUDE.md)
- **Never run** `git commit`, `git commit --amend`, `git push`, `git merge`, `git rebase`, `git reset`, or `git filter-repo`, even if approved. Jefferson commits and pushes himself. Leave all changes uncommitted.
- **Never add** `Co-Authored-By` lines or any AI attribution to commit messages, code, or docs.
- **Read `docs/audit.md` and never re-audit the repo.** Trust it and update it when your work changes something it lists.
- **Never invent content.** Fields marked TBD stay empty; if something is not specified, stop and ask Jefferson.
- **Root-cause fixes only.** Always fix the root cause of a bug, never only hide the symptom. A guard is extra protection only, and the report must say which is which.

## Antigravity paths
- Skills: `.agents/skills/` (mirror of `.claude/skills/`)
- Agents: `.agents/agents/` (mirror of `.claude/agents/`)
- When you change a skill or agent, update both copies identically.
