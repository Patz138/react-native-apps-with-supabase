# Projektdokumentation — Workout App Platform

> Vollständige Übersicht über alle Dateien, Pakete, Apps und Systeme im Monorepo.

---

## Inhaltsverzeichnis

1. [Was ist dieses Projekt?](#was-ist-dieses-projekt)
2. [Komplette Ordnerstruktur](#komplette-ordnerstruktur)
3. [Apps](#apps)
4. [Packages](#packages)
5. [Skills-System](#skills-system)
6. [Design System — Kinetic Theme](#design-system--kinetic-theme)
7. [CDD State — Build Roadmap](#cdd-state--build-roadmap)
8. [Supabase / Backend](#supabase--backend)
9. [Tech Stack](#tech-stack)
10. [Alle Befehle](#alle-befehle)
11. [Datenfluss](#datenfluss)

---

## Was ist dieses Projekt?

Eine **React Native + Supabase Monorepo-Plattform** mit zwei mobilen Apps, einer Web-App, einem gemeinsamen Design System und einem **KI-Agenten-Workflow-System (Skills)** für komponentengetriebene Entwicklung (CDD).

Das Projekt besteht aus:
- Einer **Workout-App** für Endnutzer (React Native / Expo)
- Einer **Admin-App** für Backend-Verwaltung (React Native Web / Expo)
- Einer **Web-Landingpage** (KINETIC — `workout-web`)
- Einem **Agent-Dashboard** für den Skills-Workflow
- Einem **gemeinsamen Komponentenpaket** mit Design System und Storybook
- Einem **KI-Skills-System** mit 4 spezialisierten Agenten-Workflows

---

## Komplette Ordnerstruktur

```
react-native-apps-with-supabase/
│
├── apps/
│   ├── workout-app/              ← Mobile App (React Native + Expo)
│   │   ├── App.tsx               ← Root-Komponente, Navigation, alle Views
│   │   ├── app.json              ← Expo-Konfiguration
│   │   ├── index.ts              ← Entry Point
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── .env                  ← EXPO_PUBLIC_SUPABASE_URL + KEY
│   │
│   ├── admin-app/                ← Admin Web-App (React Native Web + Expo)
│   │   ├── App.tsx
│   │   ├── app.json
│   │   ├── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── workout-web/              ← Web Landingpage (Vanilla HTML/CSS/JS)
│   │   └── index.html            ← KINETIC Design, Auth-Formulare, Workout-Grid
│   │
│   └── agent-dashboard/          ← Agent-Workflow-Dashboard (Vanilla HTML/CSS/JS)
│       └── index.html            ← Übersicht der 4 Skills, Pipeline-Visualisierung
│
├── packages/
│   ├── shared-components/        ← Gemeinsames Design System
│   │   ├── src/
│   │   │   ├── index.ts          ← Exports: kineticTheme, WorkoutCard
│   │   │   ├── kineticTheme.ts   ← Design Tokens (TypeScript)
│   │   │   ├── theme.json        ← Design Tokens (JSON, von /discovery erzeugt)
│   │   │   └── WorkoutCard.tsx   ← Erste Komponente (auf Kinetic-Tokens migriert)
│   │   ├── stories/
│   │   │   └── WorkoutCard.stories.tsx  ← CSF3 Storybook Stories
│   │   ├── .storybook/
│   │   │   ├── main.ts           ← Storybook Konfiguration
│   │   │   └── preview.ts        ← Storybook Preview
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── shared-types/             ← Gemeinsame TypeScript-Typen
│   │   ├── src/
│   │   │   └── index.ts          ← WorkoutDifficulty, WorkoutSummary
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── shared-utils/             ← Gemeinsame Hilfsfunktionen
│       ├── src/
│       │   └── index.ts          ← formatWorkoutDuration(minutes)
│       ├── package.json
│       └── tsconfig.json
│
├── skills/                       ← KI-Agent Skills (Source of Truth)
│   ├── README.md                 ← Index, Pipeline, Architektur
│   ├── discovery.md              ← Discovery Skill (vollständige Definition)
│   ├── manager.md                ← Manager Skill (vollständige Definition)
│   ├── worker.md                 ← Worker Skill (vollständige Definition)
│   └── storybook-gen.md          ← Storybook Gen Skill (vollständige Definition)
│
├── supabase/
│   ├── config.toml               ← Supabase-Projektkonfiguration
│   ├── functions/                ← Edge Functions
│   ├── migrations/               ← Datenbankmigrationen
│   ├── seeds/                    ← Testdaten
│   └── tests/                    ← Edge Function Tests
│
├── .claude/
│   ├── commands/                 ← Claude Code Slash Commands (Wrapper)
│   │   ├── discovery.md          ← /discovery
│   │   ├── manager.md            ← /manager
│   │   ├── worker.md             ← /worker
│   │   └── storybook-gen.md      ← /storybook-gen
│   ├── cdd-state.json            ← CDD Build Roadmap (von /manager erzeugt)
│   └── settings.local.json       ← Claude Code Einstellungen
│
├── docs/
│   ├── PROJECT.md                ← Diese Datei
│   └── SKILLS.md                 ← Skills Tutorial
│
├── package.json                  ← Monorepo Root (Turborepo + Workspaces)
├── turbo.json                    ← Turbo Pipeline Konfiguration
├── tsconfig.base.json            ← Gemeinsame TypeScript-Basis
└── README.md                     ← Projekt-Übersicht
```

---

## Apps

### `apps/workout-app` — Mobile App

Die Haupt-App für Endnutzer. Läuft auf iOS und Android via Expo.

**Was sie kann:**
- Dashboard mit Workout-Karten (via `WorkoutCard` aus `shared-components`)
- Supabase Health Check — Verbindungsstatus zur Edge Function prüfen
- Navigation zwischen Dashboard, Health und Register
- Supabase Auth (vorbereitet — Login/Register-Flows bereit)

**Wichtige Dateien:**

| Datei | Zweck |
|---|---|
| `App.tsx` | Root-Komponente — Navigation, alle Views, Styles via `kineticTheme` |
| `app.json` | Expo App-Konfiguration (Name, Icons, Splash) |
| `.env` | `EXPO_PUBLIC_SUPABASE_URL` und `EXPO_PUBLIC_SUPABASE_KEY` |

**Design:** Vollständig auf das **Kinetic Dark Theme** migriert. Kein einziges hardcodiertes `#ffffff` oder `#111827` mehr — alle Farben kommen aus `kineticTheme.colors`.

**Starten:**
```bash
npm run dev --workspace @workout/workout-app
# oder mit LAN-Zugriff:
npm run dev:mobile
```

---

### `apps/admin-app` — Admin Web-App

Verwaltungs-Frontend für Backoffice-Funktionen. Läuft im Browser via Expo Web.

**Was geplant ist:**
- Übungen verwalten
- Trainingspläne erstellen und bearbeiten
- Nutzer und Fortschritte einsehen

**Starten:**
```bash
npm run dev --workspace @workout/admin-app
```

---

### `apps/workout-web` — Web Landingpage

Statische HTML-Seite mit dem vollständigen **KINETIC Design System** in Vanilla CSS.

**Was sie enthält:**
- Hero-Section mit CTA
- Feature-Grid (Workout-Tracking, Fortschrittsanalyse, Supabase Auth)
- Register-Formular (mit clientseitiger Validierung)
- Login-Formular (mit Google OAuth Platzhalter)
- Workout-Übersicht mit Filter und Suche

**Design Tokens** (direkt als CSS Custom Properties):
```css
--bg:       #141408    /* Hintergrund */
--primary:  #ede900    /* Gelb-Akzent */
--text:     #e6e3ce    /* Primärer Text */
```

**Öffnen:** Einfach `apps/workout-web/index.html` im Browser öffnen — kein Build nötig.

---

### `apps/agent-dashboard` — Agent Workflow Dashboard

Visualisierung des KI-Agenten-Workflows. Zeigt die 4 Skills, ihre Pipeline und Prinzipien.

**Was sie enthält:**
- Pipeline-Flow-Diagram (Discovery → Manager → Worker → Story Gen)
- 4 Agent-Cards mit Akzentfarben, Mouse-Tracking Glow, Features
- Progressive Disclosure Sektion mit Token-Visualisierung
- Quick-Start Terminal mit animiertem Cursor
- Philosophie-Karten (Atomic Design, Zero Trust, Metaskills)

**Öffnen:** `apps/agent-dashboard/index.html` im Browser öffnen.

---

## Packages

### `packages/shared-components` — Design System

Das Herzstück des UI-Systems. Alle Komponenten, Tokens und Storybook Stories.

**Exports** (`src/index.ts`):
```typescript
export { kineticTheme } from './kineticTheme';
export { WorkoutCard }  from './WorkoutCard';
```

**Wichtige Dateien:**

| Datei | Zweck |
|---|---|
| `src/kineticTheme.ts` | Design Tokens als TypeScript-Konstanten — Single Source of Truth für RN |
| `src/theme.json` | Gleiche Tokens als JSON — von `/discovery` generiert, für Skills nutzbar |
| `src/WorkoutCard.tsx` | Workout-Karte Komponente (auf Kinetic-Tokens migriert) |
| `stories/WorkoutCard.stories.tsx` | CSF3 Storybook Story mit 7 Story-Objects, ArgTypes, RN Decorator |

**Storybook starten:**
```bash
npm run storybook
# öffnet http://localhost:6006
```

---

### `packages/shared-types` — TypeScript-Typen

Gemeinsame Typdefinitionen für alle Apps.

```typescript
export type WorkoutDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface WorkoutSummary {
  id: string;
  title: string;
  durationInMinutes: number;
  difficulty: WorkoutDifficulty;
}
```

---

### `packages/shared-utils` — Hilfsfunktionen

Gemeinsame Utility-Funktionen.

```typescript
// Minuten in lesbares Format umwandeln
formatWorkoutDuration(40)  // → "40 min"
formatWorkoutDuration(90)  // → "1 h 30 min"
formatWorkoutDuration(120) // → "2 h"
```

---

## Skills-System

Vier KI-Agenten-Skills für komponentengetriebene Entwicklung. Ausführliche Erklärung in [`docs/SKILLS.md`](./SKILLS.md).

**Übersicht:**

| Skill | Command | Erzeugt | Zweck |
|---|---|---|---|
| Discovery | `/discovery` | `theme.json` | Design Tokens extrahieren |
| Manager | `/manager` | `cdd-state.json` | CDD Roadmap + Gate-System |
| Worker | `/worker` | Komponenten-Dateien | HTML → React/RN Konvertierung |
| Storybook Gen | `/storybook-gen` | `.stories.tsx` | Storybook CSF3 generieren |

**Skill-Dateien:**

```
skills/              ← Source of Truth (vollständige Definitionen)
.claude/commands/    ← Claude Code Slash Commands (schlanke Wrapper)
```

---

## Design System — Kinetic Theme

Das **Kinetic Theme** ist das visuelle Fundament aller Apps.

### Farben

| Token | Wert | Verwendung |
|---|---|---|
| `background` | `#141408` | App-Hintergrund |
| `surfaceContainerLow` | `#1d1c10` | Card-Hintergrund |
| `surfaceContainer` | `#212013` | Mittlere Surfaces |
| `surfaceContainerHigh` | `#2b2b1d` | Erhöhte Surfaces |
| `primary` | `#ede900` | Gelb — Haupt-Akzent, CTAs |
| `primaryDim` | `#d0cc00` | Hover-Zustand |
| `onPrimary` | `#1d1d00` | Text auf gelbem Hintergrund |
| `onBackground` | `#e6e3ce` | Primärer Text |
| `onSurfaceVariant` | `#cbc8ab` | Sekundärer Text |
| `secondary` | `#a4c9ff` | Blau — Info |
| `tertiary` | `#99f1f3` | Türkis — Erfolg |
| `error` | `#ffb4ab` | Rot — Fehler |
| `outline` | `#949277` | Borders |
| `outlineVariant` | `#494832` | Schwache Borders |

### Difficulty-Farben

| Stufe | Hintergrund | Text | Dot |
|---|---|---|---|
| Beginner | `#162816` | `#86efac` | `#22c55e` |
| Intermediate | `#2a2200` | `#fde68a` | `#f59e0b` |
| Advanced | `#2a0a0a` | `#fca5a5` | `#ef4444` |

### Spacing

| Token | Wert | Verwendung |
|---|---|---|
| `xs` | 8px | Sehr kleiner Abstand |
| `sm` | 12px | Kleiner Abstand |
| `md` | 16px | Standard-Abstand |
| `lg` | 24px | Großer Abstand |
| `xl` | 32px | Sehr großer Abstand |
| `containerMargin` | 24px | Seitenränder |
| `cardPadding` | 16px | Card-Innenabstand |

### Radius

| Token | Wert | Verwendung |
|---|---|---|
| `sm` | 12px | Kleine Elemente |
| `md` | 16px | Buttons, Inputs |
| `lg` | 24px | Cards |
| `xl` | 32px | Große Cards, Modals |
| `pill` | 9999px | Badges, Tags, Pills |

### Verwendung in React Native

```typescript
import { kineticTheme } from '@workout/shared-components';

const { colors, spacing, radius } = kineticTheme;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
});
```

---

## CDD State — Build Roadmap

Die Datei `.claude/cdd-state.json` enthält die aktuelle Build-Roadmap des Projekts, verwaltet vom **Manager Skill**.

**Aktueller Stand:**

| ID | Komponente | Status | Blockiert durch |
|---|---|---|---|
| `atom-001` | DifficultyBadge | pending | — |
| `atom-002` | DurationLabel | pending | — |
| `atom-003` | NavButton | pending | — |
| `atom-004` | StatusPill | pending | — |
| `mol-001` | WorkoutCard | completed | — |
| `mol-002` | HealthCard | pending | atom-004 |
| `org-001` | WorkoutDashboard | pending | mol-001, atom-003 |
| `org-002` | HealthScreen | pending | mol-002, atom-003, atom-004 |
| `tpl-001` | AppShell | pending | org-001, org-002 |

**Nächste Schritte (unblockiert):**
```bash
/worker DifficultyBadge --target rn   # atom-001
/worker DurationLabel --target rn     # atom-002
/worker NavButton --target rn         # atom-003
/worker StatusPill --target rn        # atom-004
```

---

## Supabase / Backend

### Architekturprinzip

```
Client (App)  →  Edge Function  →  SQL Function  →  PostgreSQL
```

- **Edge Functions** = schlanke API-Schicht (Validation, Auth, Routing)
- **SQL Functions** = Fachlogik direkt in der Datenbank
- **Row Level Security** = Datenzugriff abgesichert

### Aktuelle Edge Functions

| Funktion | Endpoint | Zweck |
|---|---|---|
| `health` | `/functions/v1/client-connection-check` | Verbindungstest vom Client |

### Umgebungsvariablen

```bash
# apps/workout-app/.env
EXPO_PUBLIC_SUPABASE_URL=https://dktvzuoyexrasqqemebz.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=<publishable key>
```

---

## Tech Stack

### Frontend

| Technologie | Version | Verwendung |
|---|---|---|
| React Native | 0.81.5 | Mobile App Framework |
| Expo | latest | Build, Dev Server, OTA Updates |
| TypeScript | 5.8.3 | Typsicherheit im gesamten Repo |
| Storybook | 10.3.6 | Komponentenentwicklung isoliert |
| React Native Web | 0.21.0 | Web-Ausgabe der Admin-App |

### Backend

| Technologie | Verwendung |
|---|---|
| Supabase | BaaS-Plattform (Auth, DB, Storage, Edge Functions) |
| PostgreSQL | Datenbank + SQL Functions für Fachlogik |
| Deno | Runtime für Supabase Edge Functions |

### Build & Tooling

| Tool | Verwendung |
|---|---|
| Turborepo 2.5 | Monorepo Build-Orchestrierung |
| npm Workspaces | Package-Management |
| tsup | TypeScript Bundling für Packages |

---

## Alle Befehle

### Monorepo

```bash
npm install              # Alle Abhängigkeiten installieren
npm run dev              # Alle Apps und Packages im Watch-Mode starten
npm run build            # Gesamtes Repo bauen
npm run check-types      # TypeScript-Typen prüfen (alle Packages)
npm run lint             # Linting im gesamten Repo
npm run clean            # node_modules in allen Packages löschen
```

### Apps

```bash
npm run dev --workspace @workout/workout-app   # Mobile App starten
npm run dev:mobile                             # Mit LAN-Zugriff (Expo Go)
npm run dev:mobile:tunnel                      # Mit Tunnel (Expo Go via Internet)
npm run dev --workspace @workout/admin-app     # Admin App starten
```

### Storybook

```bash
npm run storybook               # Storybook Dev Server (http://localhost:6006)
npm run build-storybook         # Storybook als statische Seite bauen
```

### Skills (Claude Code)

```bash
/discovery                       # Design Tokens extrahieren → theme.json
/manager init <feature>          # CDD Roadmap erstellen → cdd-state.json
/manager status                  # Aktuellen Build-Fortschritt anzeigen
/manager next                    # Nächste unblockierte Komponenten anzeigen
/worker <Name> --target rn       # Komponente als React Native bauen
/worker <Name> --target react    # Komponente als React (Web) bauen
/storybook-gen <Name>            # Storybook Story generieren
```

---

## Datenfluss

### Frontend → Backend

```
Expo App
  └─ fetch(SUPABASE_URL + '/functions/v1/...')
       └─ Edge Function (Deno)
            ├─ Auth prüfen (supabase.auth.getUser())
            ├─ Input validieren
            └─ SQL Function aufrufen
                 └─ PostgreSQL (Fachlogik, RLS)
                      └─ Response zurück zum Client
```

### Komponenten-Entwicklung (CDD)

```
/discovery           → theme.json (Tokens)
     ↓
/manager init        → cdd-state.json (Roadmap)
     ↓
/worker Atom         → Atom.tsx (Komponente)
     ↓
/storybook-gen Atom  → Atom.stories.tsx (Stories)
     ↓
/manager complete    → Nächste Atoms/Molecules freischalten
     ↓
/worker Molecule     → Molecule.tsx
     ...
```
