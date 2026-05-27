---
name: storybook-gen
description: Storybook Story Generator. Analysiert Komponenten-Metadaten und generiert vollständige CSF3 .stories.tsx mit Title, Meta-Object, Story-Objects und Decorators. Kein manuelles Code-Anfassen.
---

# Storybook Gen Skill — Ausführung

Lese zunächst die vollständige Skill-Definition: `skills/storybook-gen.md`

Dann generiere die Story für:

```
$ARGUMENTS
```

## Kurzreferenz (vollständige Regeln in skills/storybook-gen.md)

**Ausgabeort — IMMER flach (keine Unterordner):**
```
packages/shared-components/stories/<ComponentName>.stories.tsx
```

**Framework:** `@storybook/react` (webpack5 + react-native-web — NICHT `@storybook/react-native`)

**CSF3-Pflichtstruktur:**
```tsx
import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from '../src/atoms/ComponentName';   // oder molecules/

const meta: Meta<typeof ComponentName> = {
  title: 'Atoms/ComponentName',   // Level aus cdd-state.json: Atoms|Molecules|Organisms
  component: ComponentName,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'kinetic-dark',
      values: [
        { name: 'kinetic-dark',    value: '#141408' },
        { name: 'kinetic-surface', value: '#1d1c10' },
        { name: 'light',           value: '#ffffff' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <View style={{ backgroundColor: '#141408', padding: 24, minWidth: 280 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: { /* Union → select, boolean → boolean, function → action */ },
  args: { /* sinnvolle Standardwerte */ },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
// Pro Variant ein Story-Object
// Zusätzlich: AllVariants render-Story wenn sinnvoll
```

**Validierung vor dem Schreiben:**
1. Komponentendatei existiert?
2. `@storybook/react-webpack5` in `packages/shared-components/package.json`?
3. Atomares Level in `.claude/cdd-state.json` für korrekten `title`-Pfad?
4. argType-Optionen stimmen exakt mit Union-Werten überein?
