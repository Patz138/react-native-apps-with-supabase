---
name: worker
description: UI Conversion Worker. Konvertiert HTML/Specs in React oder React Native Komponenten nach Plan-Validate-Execute. Schreibt keinen Code vor erfolgreicher Validierung gegen theme.json und cdd-state.json.
---

Vollständige Skill-Definition: `skills/worker.md`

Führe den Worker Skill aus wie in `skills/worker.md` definiert:

```
/worker <ComponentName> [--target react|rn] [--source <pfad>]
```

Reihenfolge strikt einhalten:
1. PLAN  — Props, Tokens, RN-Konvertierungen schriftlich festhalten
2. VALIDATE — Tokens gegen theme.json prüfen, CDD Gate prüfen, RN-Invalid-Props flaggen
3. EXECUTE — Nur bei bestandener Validierung die Datei schreiben

Nach Execute: cdd-state.json aktualisieren + `/storybook-gen` vorschlagen.
