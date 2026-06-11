---
name: discovery
description: Scannt die Codebase nach Design-Mustern, extrahiert alle Design Tokens (Farben, Abstände, Typografie, Radien) und kompiliert sie in theme.json als Source of Truth. Immer zuerst ausführen.
version: 1.0.0
trigger: Immer zuerst ausführen — bevor irgendeine Komponente gebaut wird, oder nach einer Design-Änderung an globalen Tokens.
assets:
  theme_template: assets/theme.json
scripts:
  sync_theme: scripts/sync-theme.mjs
canonical_theme: packages/shared-components/src/theme.json
---

# Discovery Skill — Design Token Extraction

Du bist der **Discovery Agent**. Dein Sichtfeld ist bewusst eng: Scan die Codebase nach vorhandenen Design-Mustern und extrahiere jeden Design-Token in eine einzige `theme.json` als kanonische Source of Truth.

## Wann ausführen
- Zu Beginn eines neuen UI-Features oder Component-Sets
- Wenn `theme.json` noch nicht existiert oder veraltet ist
- Nach einer Design-Änderung, die globale Tokens betrifft

---

## Phase 1 — Scan

Durchsuche folgende Stellen in dieser Reihenfolge:

1. `packages/shared-components/src/` — Theme-/Token-Dateien (`*.theme.ts`, `*.tokens.ts`, `kineticTheme.ts`, `theme.json`)
2. `apps/*/index.html` — CSS Custom Properties aus `:root { }` Blöcken
3. `apps/*/src/` und `packages/*/src/` — hardcodierte Hex-Werte, numerische Abstände, Font-Size-Literale
4. `*.json`-Dateien mit Namen wie `*theme*`, `*tokens*`, `*design*`

Für jede gefundene Datei extrahieren:
- **Colors** — hex, rgb, hsl, CSS-Vars
- **Spacing** — numerische Werte (px, rem, em) für padding/margin/gap
- **Typography** — fontSize, fontWeight, letterSpacing, lineHeight
- **Border Radius** — alle Radius-Werte
- **Shadows** — box-shadow / elevation-Werte
- **Transitions/Easing** — Duration und Easing-Funktionen
- **Breakpoints** — max-width / min-width in Media Queries

---

## Phase 2 — Deduplizieren & Benennen

Gleiche oder ähnliche Werte gruppieren. Semantische Benennung anwenden:

```
colors.bg               → dunkelster Hintergrund
colors.surface.*        → gestufte Surface-Ebenen (low, default, high, variant, bright)
colors.outline.*        → Border/Divider-Farben
colors.text.*           → Text-Hierarchie (primary, secondary, disabled)
colors.primary          → Brand-Akzent
colors.secondary        → Unterstützender Akzent
colors.tertiary         → Tertiärer Akzent
colors.error            → Destruktiv/Fehler-Zustand
colors.difficulty.*      → Status-/Schwierigkeits-Varianten (bg, text, dot)

gradients.*             → benannte Gradient-Stops (primary, avatar, hero, ...)
spacing.xs / sm / md / lg / xl / 2xl   → Spacing-Skala
radius.sm / md / lg / xl / pill        → Border-Radius-Skala
typography.size.*       → Font-Size-Skala
typography.weight.*     → Font-Weight-Werte
animation.ease          → Standard-Transition
animation.duration      → Standard-Duration
breakpoints.mobile / tablet / desktop
```

---

## Phase 3 — theme.json schreiben (Canonical Source)

Ausgabe nach `packages/shared-components/src/theme.json` — das ist die **einzige kanonische Quelle**.
Die Datei `assets/theme.json` in diesem Skill-Ordner ist nur ein **synchronisiertes Template** (siehe Phase 4) und darf NIE direkt editiert werden.

**Validierungsregeln vor dem Schreiben:**
- Jede Farbe muss ein gültiger CSS-Hex-, rgb()- oder hsl()-Wert sein — Fehler bei ungültigen Werten
- Jeder Spacing-Wert muss eine positive Zahl mit gültiger Einheit sein
- Keine doppelten Token-Namen
- Mindestens 4 Farb-Tokens, 4 Spacing-Tokens erforderlich — Warnung wenn weniger gefunden

Validierung erfolgreich → Datei schreiben.
Validierung fehlgeschlagen → Alle Fehler auflisten, Datei NICHT schreiben.

---

## Ausgabeformat — theme.json

Siehe `assets/theme.json` für die vollständige, aktuell synchronisierte Struktur. Grundgerüst:

```json
{
  "$meta": {
    "generatedBy": "discovery-skill",
    "version": "2.0.0",
    "extractedFrom": ["<Liste der Quelldateien>"]
  },
  "colors": {
    "bg": "#0D0D0D",
    "surface": { "low": "#141414", "default": "#1A1A1A", "high": "#222222", "variant": "#1e1e1e", "bright": "#2a2a2a" },
    "outline": { "default": "#3a3a3a", "variant": "#2a2a2a" },
    "text": { "primary": "#FFFFFF", "secondary": "#888888" },
    "primary": "#E8FF47",
    "primaryDim": "#c8df2a",
    "onPrimary": "#000000",
    "secondary": "#4FA3FF",
    "tertiary": "#4ADE80",
    "error": "#FF5C5C",
    "difficulty": {
      "beginner":     { "bg": "#16280f", "text": "#4ade80", "dot": "#4ade80" },
      "intermediate": { "bg": "#2a2400", "text": "#facc15", "dot": "#facc15" },
      "advanced":     { "bg": "#2a1212", "text": "#ff5c5c", "dot": "#ff5c5c" }
    }
  },
  "gradients": { "primary": ["#E8FF47", "#c8df2a"] },
  "spacing": { "xs": 8, "sm": 12, "md": 16, "lg": 20, "xl": 24, "xxl": 32, "huge": 48 },
  "radius": { "sm": 8, "md": 16, "lg": 24, "xl": 32, "pill": 9999 },
  "typography": {
    "displayXL": { "fontSize": 38, "lineHeight": 42, "fontWeight": "900", "letterSpacing": -1 },
    "bodyBase":  { "fontSize": 15, "lineHeight": 22, "fontWeight": "400" },
    "labelCaps": { "fontSize": 11, "lineHeight": 14, "fontWeight": "700", "letterSpacing": 0.5, "textTransform": "uppercase" }
  },
  "animation": { "duration": 150, "ease": "ease" },
  "breakpoints": { "mobile": 480, "tablet": 900 }
}
```

---

## Phase 4 — Theme-Sync (Propagation)

`theme.json` ist die **eine** Source of Truth für alle Skills (`discovery`, `manager`, `worker`, `storybook-gen`, `cdd-analysis-skill`). Jeder Skill besitzt eine synchronisierte Kopie unter `skills/<skill>/assets/theme.json`, damit er sein Token-Set referenzieren kann, ohne die gesamte Codebase zu lesen.

**Nach jedem erfolgreichen Schreiben von `packages/shared-components/src/theme.json`:**

```bash
node skills/discovery/scripts/sync-theme.mjs
```

Das Script:
1. Liest `packages/shared-components/src/theme.json` (kanonisch)
2. Kopiert den Inhalt nach `skills/*/assets/theme.json` für jeden Skill-Ordner mit `SKILL.md`
3. Meldet, welche Dateien aktualisiert wurden

**Regel:** Eine Theme-Änderung gilt erst als abgeschlossen, wenn der Sync gelaufen ist und alle `assets/theme.json`-Kopien identisch mit der kanonischen Datei sind. Falls das Script fehlschlägt → vor dem Report melden, NICHT ignorieren.

---

## Progressive Disclosure

Dieser Skill lädt **keinen** Komponenten-Code. Er liest nur bestehende Dateien nach Token-Werten. Context bleibt sauber.

Nach Abschluss berichten:
- Anzahl extrahierter Tokens pro Kategorie
- Gescannte Quelldateien
- Warnungen (fehlende Kategorien, zu wenige Tokens)
- Pfad zur geschriebenen `theme.json`
- Ergebnis des Theme-Syncs (Phase 4)

Dann vorschlagen: "Führe `/manager` als nächstes aus, um deine CDD-Roadmap zu erstellen."
