---
name: worker
description: UI Conversion Worker. Konvertiert HTML/Specs in React Native Komponenten nach Plan-Validate-Execute. Schreibt keinen Code vor erfolgreicher Validierung gegen theme.json und cdd-state.json.
---

# Worker Skill — Ausführung

Lese zunächst die vollständige Skill-Definition: `skills/worker/SKILL.md`

Dann führe den Worker-Workflow für die folgende Anfrage aus:

```
$ARGUMENTS
```

## Kurzreferenz (vollständige Regeln in skills/worker.md)

**Reihenfolge strikt einhalten:**

### 1. PLAN
Schreibe einen Komponenten-Plan:
- Datei-Zielpfad (Atome → `src/atoms/<Name>.tsx`, Molecules → `src/molecules/<Name>.tsx`)
- Props Interface vollständig aufführen
- Alle verwendeten Tokens aus `theme.json` auflisten
- RN-Konvertierungen dokumentieren (keine CSS-Units, kein cursor, etc.)

### 2. VALIDATE
- Jeden Token aus dem Plan in `packages/shared-components/src/theme.json` prüfen
- CDD Gate in `.claude/cdd-state.json` prüfen (alle blockedUntil-Abhängigkeiten completed?)
- Composition-Gate prüfen: `dependsOn` darf nicht leer sein (außer `gateException` dokumentiert) und alle gelisteten Atoms/Molecules müssen im Plan importiert + verwendet werden
- Bei fehlendem Token oder blockiertem Gate: **STOP**, Fehler melden

### 3. EXECUTE (nur bei bestandener Validierung)
Schreibe die Komponente. Import-Konventionen:
```ts
import { kineticTheme } from '../kineticTheme';          // Atom
import { kineticTheme } from '../../kineticTheme';       // Molecule (aus src/molecules/)
import { SomeAtom } from '../atoms/SomeAtom';            // Atom in Molecule
```

**Token-Mapping: theme.json Pfad → kineticTheme TypeScript**
| theme.json                | kineticTheme                        |
|---------------------------|-------------------------------------|
| colors.bg                 | colors.background                   |
| colors.surface.low        | colors.surfaceContainerLow          |
| colors.surface.default    | colors.surfaceContainer             |
| colors.surface.high       | colors.surfaceContainerHigh         |
| colors.surface.variant    | colors.surfaceVariant               |
| colors.surface.bright     | colors.surfaceBright                |
| colors.outline.default    | colors.outline                      |
| colors.outline.variant    | colors.outlineVariant               |
| colors.text.primary       | colors.onBackground / colors.onSurface |
| colors.text.secondary     | colors.onSurfaceVariant             |
| colors.primary            | colors.primary                      |
| colors.difficulty.*       | colors.difficulty.beginner/intermediate/advanced.{bg,text,dot} |
| spacing.*                 | spacing.* (gleiche Namen)           |
| radius.*                  | radius.* (gleiche Namen)            |
| typography.*              | typography.* (gleiche Namen)        |

### 4. POST-EXECUTE
- `.claude/cdd-state.json` aktualisieren: Status → `completed`
- Berichten, welche Molecules/Organisms jetzt freigeschaltet sind
- `/storybook-gen <ComponentName>` vorschlagen
