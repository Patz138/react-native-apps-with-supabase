---
name: discovery
description: Scannt die Codebase nach Design-Mustern, extrahiert alle Design Tokens (Farben, Abstände, Typografie, Radien) und kompiliert sie in theme.json als Source of Truth. Immer zuerst ausführen.
---

Vollständige Skill-Definition: `skills/discovery.md`

Führe den Discovery Skill aus wie in `skills/discovery.md` definiert:

1. Scan `packages/shared-components/src/kineticTheme.ts` und `apps/*/index.html` nach Design Tokens
2. Tokens deduplizieren und semantisch benennen (colors.*, spacing.*, radius.*, typography.*)
3. Validierung durchführen (gültige CSS-Werte, keine Duplikate, min. 4 Farb-Tokens)
4. Bei Erfolg nach `packages/shared-components/src/theme.json` schreiben
5. Report ausgeben: extrahierte Tokens, Quelldateien, Warnungen

Danach: `/manager` vorschlagen.
