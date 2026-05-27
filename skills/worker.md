---
name: worker
type: skill
version: 1.0.0
description: UI Conversion Worker. Konvertiert rohes HTML oder Design-Specs in produktionsreife React- oder React-Native-Komponenten nach dem Plan-Validate-Execute-Muster. Schreibt keinen Code, bevor der Plan gegen theme.json und cdd-state.json validiert ist.
trigger: Pro Komponente — nach /manager init.
---

# Worker Skill — UI Conversion (Plan → Validate → Execute)

Du bist der **Worker Agent**. Dein Job ist es, eine einzelne Komponente aus rohem HTML oder einer Design-Beschreibung in produktionsreifen React- oder React-Native-Code umzuwandeln. Du folgst dem **Plan → Validate → Execute**-Muster strikt — kein Code wird geschrieben, bevor der Plan die Validierung besteht.

## Input

```
/worker <ComponentName> [--target react|rn] [--source <file-path>]
```

Beispiele:
- `/worker Button --target rn`
- `/worker WorkoutCard --target rn --source packages/shared-components/src/WorkoutCard.tsx`
- `/worker FilterTabs --target react`

---

## Phase 1 — PLAN

Vor dem Anfassen einer Datei einen schriftlichen Plan erstellen:

```
KOMPONENTEN-PLAN: WorkoutCard (React Native)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Datei:    packages/shared-components/src/atoms/WorkoutCard.tsx
Story:    packages/shared-components/stories/WorkoutCard.stories.tsx

Props Interface:
  title:              string
  durationInMinutes:  number
  difficulty:         WorkoutDifficulty
  onPress?:           () => void

Verwendete Tokens:
  colors.surface.low       → backgroundColor der Card
  colors.surface.high      → Badge-Hintergrund
  colors.text.primary      → Titel-Farbe
  colors.text.secondary    → Meta-Farbe
  colors.primary           → Akzent-Badge (Advanced)
  spacing.lg               → Card-Padding
  spacing.md               → Gap-Wert
  radius.lg                → Card-Radius
  radius.pill              → Badge-Radius

RN-spezifische Konvertierungen:
  flex-direction: row  → flexDirection: 'row'    (RN-Standard ist column!)
  margin: 8px 16px    → marginVertical: 8, marginHorizontal: 16
  font-weight: 700    → fontWeight: '700'         (muss String in RN sein)
  border-radius: 24px → borderRadius: 24          (kein 'px' in RN)
  display: flex       → (weglassen — RN nutzt flex standardmäßig)
  cursor: pointer     → (weglassen — in RN ungültig)
  box-shadow          → elevation + shadowColor + shadowOffset
```

---

## Token-Mapping: theme.json Pfade → kineticTheme TypeScript

Der Plan referenziert Tokens via theme.json-Pfade (für Validierung). Im EXECUTE-Code wird immer `kineticTheme` aus `./kineticTheme` importiert:

| theme.json Pfad             | kineticTheme TypeScript-Eigenschaft                        |
|-----------------------------|------------------------------------------------------------|
| `colors.bg`                 | `colors.background`                                        |
| `colors.surface.low`        | `colors.surfaceContainerLow`                               |
| `colors.surface.default`    | `colors.surfaceContainer`                                  |
| `colors.surface.high`       | `colors.surfaceContainerHigh`                              |
| `colors.surface.variant`    | `colors.surfaceVariant`                                    |
| `colors.surface.bright`     | `colors.surfaceBright`                                     |
| `colors.outline.default`    | `colors.outline`                                           |
| `colors.outline.variant`    | `colors.outlineVariant`                                    |
| `colors.text.primary`       | `colors.onBackground` / `colors.onSurface`                 |
| `colors.text.secondary`     | `colors.onSurfaceVariant`                                  |
| `colors.primary`            | `colors.primary`                                           |
| `colors.primaryDim`         | `colors.primaryDim`                                        |
| `colors.onPrimary`          | `colors.onPrimary`                                         |
| `colors.secondary`          | `colors.secondary`                                         |
| `colors.tertiary`           | `colors.tertiary`                                          |
| `colors.error`              | `colors.error`                                             |
| `colors.difficulty.*`       | `colors.difficulty.beginner/intermediate/advanced.{bg,text,dot}` |
| `spacing.*`                 | `spacing.*` (identische Namen)                             |
| `radius.*`                  | `radius.*` (identische Namen)                              |
| `typography.*`              | `typography.*` (identische Namen)                          |

**Import-Konventionen nach Komponenten-Level:**
```ts
// Atom (liegt in src/atoms/)
import { kineticTheme } from '../kineticTheme';

// Molecule (liegt in src/molecules/)
import { kineticTheme } from '../../kineticTheme';
import { SomeAtom } from '../atoms/SomeAtom';

// Datei-Zielordner:
// Atoms    → packages/shared-components/src/atoms/<Name>.tsx
// Molecules → packages/shared-components/src/molecules/<Name>.tsx
// Organisms → apps/workout-app/src/screens/<Name>.tsx
```

---

## Phase 2 — VALIDATE

Plan gegen zwei Sources of Truth prüfen:

**Check 1 — Token-Existenz:**
Jeden Token aus dem Plan in `packages/shared-components/src/theme.json` verifizieren.

```
✅ colors.surface.low    → gefunden: #1d1c10
✅ spacing.lg            → gefunden: 24
❌ colors.brand          → NICHT in theme.json gefunden
```

Bei fehlendem Token: STOP. Nicht weitermachen. Fehler melden und `/discovery` vorschlagen.

**Check 2 — CDD Gate:**
Komponente in `.claude/cdd-state.json` nachschlagen. Status prüfen.
Alle Abhängigkeiten in `blockedUntil` müssen `completed` sein.

```
✅ CDD Gate: WorkoutCard — Abhängigkeiten Button (atom-001), Badge (atom-002) completed
⛔ CDD Gate: FilterTabs blockiert — Tag (atom-003) noch nicht completed
```

**Check 3 — React Native spezifisch:**
Bei `--target rn` die Quell-HTML/CSS auf ungültige RN-Properties scannen und alle im Plan flaggen:
- `cursor`, `user-select` → weglassen
- `box-shadow` → in `elevation`/`shadow*` konvertieren
- `%`-Einheiten → flex-Verhältnis oder `Dimensions` API
- `vh`/`vw` → `Dimensions.get('window')`
- `position: fixed` → nicht unterstützt, andere Strategie nötig

Nur wenn **alle Checks** bestehen → Execute.

---

## Phase 3 — EXECUTE

Komponentendatei schreiben. Regeln:

**React Native:**
```tsx
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { WorkoutDifficulty } from '@workout/shared-types';
import { formatWorkoutDuration } from '@workout/shared-utils';
import { kineticTheme } from '../kineticTheme';

const { colors, spacing, radius } = kineticTheme;

export interface WorkoutCardProps {
  title: string;
  durationInMinutes: number;
  difficulty: WorkoutDifficulty;
  onPress?: () => void;
}

export function WorkoutCard({ title, durationInMinutes, difficulty, onPress }: WorkoutCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.badge, diffBadgeStyle[difficulty]]}>
          <Text style={[styles.badgeText, diffTextStyle[difficulty]]}>{difficulty}</Text>
        </View>
      </View>
      <Text style={styles.meta}>{formatWorkoutDuration(durationInMinutes)}</Text>
    </Pressable>
  );
}

const diffBadgeStyle: Record<WorkoutDifficulty, object> = {
  Beginner:     { backgroundColor: '#162816' },
  Intermediate: { backgroundColor: '#2a2200' },
  Advanced:     { backgroundColor: '#2a0a0a' },
};

const diffTextStyle: Record<WorkoutDifficulty, object> = {
  Beginner:     { color: '#86efac' },
  Intermediate: { color: '#fde68a' },
  Advanced:     { color: '#fca5a5' },
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: colors.onBackground,
  },
  badge: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  meta: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
  },
});
```

---

## Phase 4 — Post-Execute

Nach dem Schreiben der Datei:

1. `.claude/cdd-state.json` aktualisieren — Status dieser Komponente auf `completed` setzen
2. Berichten, welche Molecules/Organisms jetzt freigeschaltet sind
3. Vorschlagen: "Führe `/storybook-gen <ComponentName>` aus, um die Storybook-Story zu generieren."

---

## RN Konvertierungstabelle

| CSS                        | React Native                                       |
|----------------------------|----------------------------------------------------|
| `flex-direction: row`      | `flexDirection: 'row'`                             |
| `margin: 8px 16px`         | `marginVertical: 8, marginHorizontal: 16`          |
| `padding: 12px 22px`       | `paddingVertical: 12, paddingHorizontal: 22`       |
| `border-radius: 24px`      | `borderRadius: 24`                                 |
| `font-weight: 700`         | `fontWeight: '700'`                                |
| `box-shadow: 0 4px 12px`   | `elevation: 4` (Android) + `shadowColor/Offset`   |
| `display: flex`            | (weglassen — flex ist Standard in RN)              |
| `overflow: hidden`         | `overflow: 'hidden'`                               |
| `cursor: pointer`          | (weglassen)                                        |
| `100vw`                    | `Dimensions.get('window').width`                   |
| `background-color`         | `backgroundColor`                                  |

---

## Progressive Disclosure

Dieser Skill liest nur:
- `theme.json` (Token-Validierung)
- `cdd-state.json` (Gate-Check)
- Die einzelne Ziel-HTML/Komponentendatei via `--source`

Er scannt **nicht** die gesamte Codebase. Context bleibt fokussiert.
