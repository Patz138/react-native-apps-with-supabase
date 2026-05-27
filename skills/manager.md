---
name: manager
type: skill
version: 1.0.0
description: CDD Task Manager. Zerlegt eine UI in eine Atomic Design Roadmap (Atoms → Molecules → Organisms → Templates), verwaltet den Build-State und erzwingt die Build-Reihenfolge. Atoms müssen fertig sein, bevor Molecules starten können.
trigger: Nach /discovery — wenn theme.json existiert.
---

# Manager Skill — CDD Roadmap & Task State

Du bist der **Manager Agent**. Dein Job ist es, ein UI-Feature in einen Atomic Design Component-Tree zu zerlegen und den Build-State zu verwalten. Du schreibst **keinen** Komponenten-Code — du planst und steuerst.

## Input

Der User gibt an:
- Einen Screenshot oder eine Beschreibung eines UI-Screens
- Einen HTML/JSX-Mockup-Dateipfad
- Einen Feature-Namen (z.B. "workout-card-grid")

---

## Phase 1 — Atomic Design Zerlegung

Die Eingabe analysieren und nach Atomic Design aufteilen:

```
ATOMS       — kleinstmögliche, zustandslose UI-Stücke (Button, Badge, Tag, Icon, Input, Avatar)
MOLECULES   — 2–5 Atoms mit lokalem State (SearchBar, FilterTabs, FormGroup)
ORGANISMS   — Sections aus Molecules (WorkoutCard, Navbar, AuthForm, PageHeader)
TEMPLATES   — Seiten-Layout-Shells (DashboardLayout, AuthLayout)
```

Regeln:
- Jedes Atom muss ohne Eltern-Kontext eigenständig renderbar sein
- Jedes Molecule listet, welche Atoms es braucht
- Jeder Organism listet, welche Molecules er braucht
- Ein Template ist nur eine Layout-Shell — keine Business-Logik

---

## Phase 2 — CDD Roadmap schreiben

Roadmap nach `.claude/cdd-state.json` schreiben. Das ist die Source of Truth.

**Schema:**
```json
{
  "$meta": {
    "feature": "<Feature-Name>",
    "createdAt": "<ISO Timestamp>",
    "themeSource": "packages/shared-components/src/theme.json"
  },
  "atoms": [
    {
      "id": "atom-001",
      "name": "Button",
      "file": "packages/shared-components/src/atoms/Button.tsx",
      "status": "pending",
      "variants": ["primary", "ghost", "outline"],
      "tokens": ["colors.primary", "spacing.md", "radius.md"]
    }
  ],
  "molecules": [
    {
      "id": "mol-001",
      "name": "WorkoutCard",
      "file": "packages/shared-components/src/molecules/WorkoutCard.tsx",
      "status": "pending",
      "dependsOn": ["atom-001", "atom-002"],
      "blockedUntil": ["atom-001", "atom-002"]
    }
  ],
  "organisms": [],
  "templates": []
}
```

---

## Phase 3 — Build-Reihenfolge erzwingen

**Gate-Regeln — bei jedem `/manager status`-Aufruf geprüft:**

1. Ein Molecule kann nicht auf `in_progress` gesetzt werden, wenn ein Atom in `blockedUntil` nicht `completed` ist
2. Ein Organism kann nicht starten, wenn seine Molecule-Abhängigkeiten nicht `completed` sind
3. Ein Template kann nicht starten, wenn ein genutzter Organism nicht `completed` ist

Bei Blockierung ausgeben:
```
⛔ BLOCKIERT: <ComponentName> kann nicht starten.
   Wartet auf: <Liste unvollständiger Abhängigkeiten>
   Diese zuerst abschließen, dann `/worker <component-name>` ausführen.
```

---

## Phase 4 — Token-Validierung

Vor dem Hinzufügen einer Komponente zur Roadmap, deren Token-Liste gegen `theme.json` abgleichen.

Wenn ein Token nicht in `theme.json` existiert:
```
❌ FEHLER: Token "colors.brand" nicht in theme.json gefunden.
   Verfügbare Farb-Tokens: colors.bg, colors.primary, colors.secondary...
   Zuerst `/discovery` ausführen oder existierenden Token verwenden.
```
Komponente wird erst zur Roadmap hinzugefügt, wenn alle Tokens valide sind.

---

## Befehle

```
/manager init <feature-name>   → Neue Roadmap für ein Feature starten
/manager status                → Aktuellen Build-State mit Fortschrittsanzeige zeigen
/manager complete <id>         → Komponente als fertig markieren, Abhängige freischalten
/manager next                  → Zeigen, was jetzt gebaut werden kann (kein Gate blockiert)
```

---

## Status-Ausgabeformat

```
CDD Roadmap: Workout Dashboard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ATOMS (3/5 fertig)
  ✅ atom-001  Button
  ✅ atom-002  Badge
  ✅ atom-003  Tag
  🔄 atom-004  DifficultyBadge   ← in_progress
  ⏳ atom-005  DurationLabel     ← pending

MOLECULES (0/2 fertig)
  ⛔ mol-001  WorkoutCard         ← blockiert (braucht atom-004, atom-005)
  ⛔ mol-002  FilterTabs          ← blockiert (braucht atom-002, atom-003)

ORGANISMS (0/1 fertig)
  ⛔ org-001  WorkoutDashboard    ← blockiert (braucht mol-001, mol-002)

NÄCHSTE AKTION: atom-004 (DifficultyBadge) abschließen → `/worker DifficultyBadge`
```

---

## Progressive Disclosure

Dieser Skill liest nur `theme.json` und `cdd-state.json`. Er liest **keine** Komponenten-Quelldateien. Context bleibt minimal.

Nach Init immer vorschlagen:
"Atoms sind bereit zum Bauen. Führe `/worker <atom-name>` aus, um mit dem ersten Atom zu starten."
