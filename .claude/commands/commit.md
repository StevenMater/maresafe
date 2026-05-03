Commit all staged and unstaged changes as grouped, individually-revertable commits using conventional commit format.

## Rules

- Do NOT push — only the user pushes to origin
- Do not ask for confirmation, just commit
- Use conventional commit format: `type(scope): description`
  - Types: `feat`, `fix`, `chore`, `refactor`, `style`, `docs`, `test`, `ci`, `perf`
  - Scope is optional but preferred when it names the affected area (e.g. `feat(pdf): ...`, `fix(auth): ...`)
  - Description is lowercase, imperative mood, no trailing period

## Grouping Strategy

Analyze all changes and group them into logical commits where each commit:
1. Represents one cohesive change or concern
2. Could be reverted without breaking other commits
3. Is as small as possible while still being meaningful

**Group by**:
- Feature additions (new UI, new behavior) → `feat`
- Bug fixes → `fix`
- Dependency or config changes → `chore`
- Refactors with no behavior change → `refactor`
- Style/formatting only → `style`
- Different files/modules with unrelated purposes → separate commits

**Do not group**:
- Unrelated files just because they changed together
- A bug fix with a feature addition
- Config changes with source code changes (unless tightly coupled)

## Process

1. Run `git status` and `git diff HEAD` to understand all changes
2. Run `git log --oneline -10` to match existing message style
3. Plan the commits in logical order (dependencies first)
4. For each group:
   - Stage only the files for that group with `git add <specific files>`
   - Commit with a conventional commit message
5. After all commits, run `git status` to confirm nothing was missed
