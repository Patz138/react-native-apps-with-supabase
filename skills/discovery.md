---
name: discovery
type: skill
version: 1.0.0
description: Scannt die Codebase nach Design-Mustern, extrahiert alle Design Tokens (Farben, Abstände, Typografie, Radien) und kompiliert sie in eine strukturierte theme.json als Source of Truth.
trigger: Immer zuerst ausführen — bevor irgendeine Komponente gebaut wird.
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

1. `packages/shared-components/src/` — Theme-/Token-Dateien (`*.theme.ts`, `*.tokens.ts`, `kineticTheme.ts`, `theme.ts`)
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

spacing.xs / sm / md / lg / xl / 2xl   → 8-Stufen-Spacing-Skala
radius.sm / md / lg / xl / pill        → Border-Radius-Skala
typography.size.*       → Font-Size-Skala
typography.weight.*     → Font-Weight-Werte
animation.ease          → Standard-Transition
animation.duration      → Standard-Duration
breakpoints.mobile / tablet / desktop
```

---

## Phase 3 — theme.json schreiben

Ausgabe nach `packages/shared-components/src/theme.json`.

**Validierungsregeln vor dem Schreiben:**
- Jede Farbe muss ein gültiger CSS-Hex-, rgb()- oder hsl()-Wert sein — Fehler bei ungültigen Werten
- Jeder Spacing-Wert muss eine positive Zahl mit gültiger Einheit sein
- Keine doppelten Token-Namen
- Mindestens 4 Farb-Tokens, 4 Spacing-Tokens erforderlich — Warnung wenn weniger gefunden

Validierung erfolgreich → Datei schreiben.
Validierung fehlgeschlagen → Alle Fehler auflisten, Datei NICHT schreiben.

---

## Ausgabeformat — theme.json

```json
{
  "$meta": {
    "generatedBy": "discovery-skill",
    "version": "1.0.0",
    "extractedFrom": ["<Liste der Quelldateien>"]
  },
  "colors": {
    "bg": "#141408",
    "surface": {
      "low": "#1d1c10",
      "default": "#212013",
      "high": "#2b2b1d",
      "variant": "#363527",
      "bright": "#3b3a2b"
    },
    "outline": {
      "default": "#949277",
      "variant": "#494832"
    },
    "text": {
      "primary": "#e6e3ce",
      "secondary": "#cbc8ab"
    },
    "primary": "#ede900",
    "primaryDim": "#d0cc00",
    "onPrimary": "#1d1d00",
    "secondary": "#a4c9ff",
    "tertiary": "#99f1f3",
    "error": "#ffb4ab"
  },
  "spacing": {
    "xs": 8,
    "sm": 12,
    "md": 16,
    "lg": 24,
    "xl": 32,
    "containerMargin": 24,
    "cardPadding": 16
  },
  "radius": {
    "sm": 12,
    "md": 16,
    "lg": 24,
    "xl": 32,
    "pill": 9999
  },
  "typography": {
    "displayXL": { "fontSize": 32, "lineHeight": 38, "fontWeight": "700", "letterSpacing": -0.64 },
    "headlineLG": { "fontSize": 24, "lineHeight": 30, "fontWeight": "700", "letterSpacing": -0.24 },
    "titleMD":    { "fontSize": 18, "lineHeight": 22, "fontWeight": "700" },
    "bodyBase":   { "fontSize": 16, "lineHeight": 24, "fontWeight": "400" },
    "bodySM":     { "fontSize": 14, "lineHeight": 20, "fontWeight": "500" },
    "labelCaps":  { "fontSize": 10, "lineHeight": 10, "fontWeight": "700", "letterSpacing": 0.5, "textTransform": "uppercase" }
  },
  "animation": {
    "duration": 180,
    "ease": "ease"
  },
  "breakpoints": {
    "mobile": 600,
    "tablet": 900
  }
}
```

---

## Progressive Disclosure

Dieser Skill lädt **keinen** Komponenten-Code. Er liest nur bestehende Dateien nach Token-Werten. Context bleibt sauber.

Nach Abschluss berichten:
- Anzahl extrahierter Tokens pro Kategorie
- Gescannte Quelldateien
- Warnungen (fehlende Kategorien, zu wenige Tokens)
- Pfad zur geschriebenen `theme.json`

Dann vorschlagen: "Führe `/manager` als nächstes aus, um deine CDD-Roadmap zu erstellen."
