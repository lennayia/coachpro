# Jak aplikovat migration plan patch

Tento patch obsahuje 2 commity s MONOREPO_MIGRATION_PLAN.md

## Aplikace na tvém Macu:

```bash
cd ~/coachpro
git checkout claude-code-12list

# Stáhni aktuální větev
git pull origin claude-code-12list

# Aplikuj patch
git apply docs/migration-plan.patch

# Zkontroluj
git status

# Commitni
git add docs/MONOREPO_MIGRATION_PLAN.md
git commit -m "docs: Add complete monorepo migration plan with ContentPro

- 5-phase migration strategy (8-11 weeks)
- ProApp central auth hub architecture
- SQLite → Supabase migration guide
- Cost analysis ($25/month unified)
- Detailed code examples for each phase
- ContentPro module (social media management)
- Success criteria and risk mitigation"

# Push
git push origin claude-code-12list
```

Pak můžeš smazat tento soubor i patch.
