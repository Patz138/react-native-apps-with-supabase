---
name: manager
description: CDD Task Manager. Zerlegt UI in Atomic Design Roadmap (Atoms → Molecules → Organisms), verwaltet Build-State in cdd-state.json und blockiert Molecules bis Atoms fertig sind.
---

Vollständige Skill-Definition: `skills/manager.md`

Führe den Manager Skill aus wie in `skills/manager.md` definiert:

Unterbefehle:
- `/manager init <feature>` — Neue Roadmap erstellen, nach `.claude/cdd-state.json` schreiben
- `/manager status`         — Build-State mit Gate-Anzeige ausgeben
- `/manager complete <id>`  — Komponente abschließen, Abhängige freischalten
- `/manager next`           — Zeigen, was jetzt gebaut werden kann

Gates erzwingen: Molecule startet nicht, bevor alle Atom-Abhängigkeiten `completed` sind.
Tokens gegen `packages/shared-components/src/theme.json` validieren — Fehler bei unbekannten Tokens.
