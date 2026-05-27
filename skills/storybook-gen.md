---
name: storybook-gen
type: skill
version: 1.0.0
description: Storybook Story Generator. Analysiert Komponenten-Metadaten (Props Interface, Varianten, Types) und generiert automatisch eine vollständige CSF3 .stories.tsx-Datei mit Title, Meta-Object, Story-Objects und Decorators. Kein manuelles Code-Anfassen nötig.
trigger: Nach /worker — für jede fertige Komponente.
---

# Storybook Generation Skill — Automatische CSF Story-Erstellung

Du bist der **Storybook Generation Agent**. Dein einziger Job ist es, eine einzelne Komponentendatei zu analysieren, ihre Metadaten zu extrahieren und eine vollständige, lauffähige `.stories.tsx`-Datei im CSF3-Format zu generieren. Der Entwickler muss die Story-Datei nie manuell anfassen.

## Input

```
/storybook-gen <ComponentName> [--file <pfad>]
```

Beispiele:
- `/storybook-gen WorkoutCard`
- `/storybook-gen Button --file packages/shared-components/src/atoms/Button.tsx`

Wenn `--file` nicht angegeben, Komponentenpfad aus `.claude/cdd-state.json` nachschlagen.

---

## Phase 1 — Metadaten-Extraktion

**Nur die Ziel-Komponentendatei lesen.** Extrahieren:

**1. Props Interface**
```tsx
interface WorkoutCardProps {
  title: string;
  durationInMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  onPress?: () => void;
}
```

Daraus extrahieren:
- Prop-Namen und Typen
- Required vs. Optional (`?`)
- Union Types → werden zu `argTypes`-Controls
- Funktions-Props → als `action` markieren
- Boolean Props → Toggle-Control
- String-Literal-Unions → Select-Control

**2. Komponenten-Anzeigename**
Aus `export function <Name>` oder `export const <Name>`.

**3. Import-Pfad**
Relativ vom Stories-Datei-Ort zur Komponentendatei.

**4. Bestehende Varianten**
Prop-Typen auf Variant/Size/Type-Unions scannen — jede Kombination wird ein Story-Object.

---

## Phase 2 — Stories-Datei generieren

**Ausgabeort:** IMMER flach im `stories/`-Ordner — keine Unterordner:
```
packages/shared-components/stories/<ComponentName>.stories.tsx
```

**Framework:** `@storybook/react` (webpack5 + react-native-web Alias) — **NICHT** `@storybook/react-native`.
Import: `import type { Meta, StoryObj } from '@storybook/react';`

**Import-Pfad zur Komponente** (relativ von stories/ aus):
```ts
import { DifficultyBadge } from '../src/atoms/DifficultyBadge';   // Atom
import { HealthCard }       from '../src/molecules/HealthCard';     // Molecule
import { WorkoutCard }      from '../src/WorkoutCard';              // Legacy-Root
```

**CSF3-Struktur:**

```tsx
import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { WorkoutCard } from '../src/WorkoutCard';

// ── META OBJECT ──────────────────────────────────────────
const meta: Meta<typeof WorkoutCard> = {
  title: 'Molecules/WorkoutCard',
  component: WorkoutCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'kinetic-dark',
      values: [
        { name: 'kinetic-dark',  value: '#141408' },
        { name: 'kinetic-surface', value: '#1d1c10' },
        { name: 'light',         value: '#ffffff' },
      ],
    },
  },
  // ── DECORATORS — verhindern Crash ohne Kontext ─────────
  decorators: [
    (Story) => (
      <View style={{ backgroundColor: '#141408', padding: 24, minWidth: 320, maxWidth: 400 }}>
        <Story />
      </View>
    ),
  ],
  // ── ARG TYPES ─────────────────────────────────────────
  argTypes: {
    title:             { control: 'text',   description: 'Workout-Titel' },
    durationInMinutes: { control: 'number', description: 'Dauer in Minuten' },
    difficulty: {
      control: 'select',
      options: ['Beginner', 'Intermediate', 'Advanced'],
      description: 'Schwierigkeitsstufe',
    },
    onPress: { action: 'pressed', description: 'Callback bei Tap' },
  },
  // ── DEFAULT ARGS (Meta-Object Standardargumente) ───────
  args: {
    title: 'Full Body Session',
    durationInMinutes: 40,
    difficulty: 'Intermediate',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ── STORY OBJECTS ─────────────────────────────────────────
export const Default: Story = {};

export const Beginner: Story = {
  args: {
    title: 'Mobility Warmup',
    durationInMinutes: 15,
    difficulty: 'Beginner',
  },
};

export const Intermediate: Story = {
  args: {
    title: 'Core Stability Circuit',
    durationInMinutes: 30,
    difficulty: 'Intermediate',
  },
};

export const Advanced: Story = {
  args: {
    title: 'Athlete Conditioning',
    durationInMinutes: 60,
    difficulty: 'Advanced',
  },
};

export const LongTitle: Story = {
  args: {
    title: 'Full Body Functional Strength & Hypertrophy',
    durationInMinutes: 75,
    difficulty: 'Advanced',
  },
};

export const QuickSession: Story = {
  args: {
    title: 'Express Core',
    durationInMinutes: 10,
    difficulty: 'Beginner',
  },
};
```

---

## Decorator-Regeln

Decorators hinzufügen, wenn die Komponente Kontext zum Rendern ohne Crash braucht:

| Bedingung | Decorator |
|-----------|-----------|
| React-Native-Komponente | `View`-Wrapper mit dunklem Hintergrund + Padding |
| Verwendet React Navigation | `NavigationContainer` |
| Verwendet Theme/Context-Provider | Relevanten Provider einwickeln |
| Hat required Children | Default-Children in args |

---

## Validierung vor dem Schreiben

1. Komponentendatei existiert und exportiert die benannte Komponente
2. `@storybook/react` oder `@storybook/react-native` ist in `package.json`
3. Atomares Level (Atoms/Molecules/etc.) in `cdd-state.json` für korrekten `title`-Pfad
4. Alle argType-Optionen stimmen exakt mit den Union-Werten im Props Interface überein

Validierung fehlgeschlagen → Fehler auflisten, NICHT schreiben.

---

## Nach dem Schreiben

1. Vollständigen Pfad der geschriebenen Stories-Datei berichten
2. Anzahl generierter Story-Objects berichten
3. Vorschlagen: `npm run storybook` zum isolierten Vorschau der Komponente
4. Wenn letzte Komponente in einem CDD-Level: "Alle Atoms fertig — führe `/manager next` aus, um freischaltbare Molecules zu sehen."

---

## Progressive Disclosure

Dieser Skill liest nur:
- Die einzelne Ziel-Komponentendatei (für Metadaten)
- `package.json` (um Storybook zu verifizieren)
- `.claude/cdd-state.json` (für atomares Level / title-Pfad)

Er liest **nicht** die gesamte Codebase. Context bleibt minimal.
