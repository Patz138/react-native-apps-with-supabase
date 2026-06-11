# Skills — AI Agent Workflow

Dieser Ordner enthält die Skill-Definitionen für den KI-Agenten-Workflow nach dem Podcast-Konzept.
Jeder Skill folgt dem [Agent Skills Format](https://agentskills.io/specification): ein Ordner mit `SKILL.md` (Pflicht: `name` + `description` im Frontmatter) plus optionalen `assets/`, `scripts/`, `references/`.

## Skill-Übersicht

| Skill | SKILL.md | Claude Code Command | Ausführen |
|---|---|---|---|
| Discovery | `discovery/SKILL.md` | `/discovery` | Zuerst — extrahiert Tokens |
| Manager | `manager/SKILL.md` | `/manager` | Nach Discovery — erstellt Roadmap, erzwingt Composition-Gate |
| Worker | `worker/SKILL.md` | `/worker` | Pro Komponente — baut Code |
| Storybook Gen | `storybook-gen/SKILL.md` | `/storybook-gen` | Nach Worker — generiert Stories |
| CDD Analysis | `cdd-analysis-skill/SKILL.md` | — | Pre-Processing für HTML-Prototypen |

## Pipeline

```
/discovery  →  /manager init  →  /worker <Atom>  →  /storybook-gen <Atom>
                                       ↓
                              /manager complete <id>
                                       ↓
                              /worker <Molecule>  →  /storybook-gen <Molecule>
```

## Composition-Gate (Atomic Dependency Rule)

Der Manager-Skill erzwingt seit v1.1.0 eine harte Abhängigkeitsregel:

- **Molecules** brauchen ≥1 Atom in `dependsOn`
- **Organisms** brauchen ≥1 Atom oder Molecule in `dependsOn`
- **Templates** brauchen ≥1 Organism in `dependsOn`

Eine Komponente ohne erfüllte Abhängigkeit darf nicht zur Roadmap hinzugefügt werden — es sei denn, ein begründetes `gateException`-Objekt (`reason`, `recommendation`, `approvedAt`) dokumentiert die Ausnahme. `/manager status` zeigt Exceptions als ⚠️ an. Details: `manager/SKILL.md` Phase 1.5.

## Theme als Single Source of Truth

```
packages/shared-components/src/theme.json   ← KANONISCH (von /discovery geschrieben)
skills/<skill>/assets/theme.json            ← synchronisierte Kopien für jeden Skill
```

Nach jeder Theme-Änderung:

```bash
node skills/discovery/scripts/sync-theme.mjs
```

Das Script kopiert die kanonische `theme.json` in `assets/theme.json` jedes Skill-Ordners (jeder Ordner mit `SKILL.md`). `/discovery` ruft es automatisch als letzten Schritt auf.

## Dateien die diese Skills erzeugen

| Datei | Erzeugt von | Zweck |
|---|---|---|
| `packages/shared-components/src/theme.json` | `/discovery` | Source of Truth für alle Design Tokens |
| `skills/*/assets/theme.json` | `sync-theme.mjs` | Synchronisierte Theme-Kopie pro Skill |
| `.claude/cdd-state.json` | `/manager init` | CDD Roadmap + Build State (inkl. Composition-Gate) |
| `packages/shared-components/src/atoms/*.tsx` | `/worker` | Atom-Komponenten |
| `packages/shared-components/src/molecules/*.tsx` | `/worker` | Molecule-Komponenten |
| `packages/shared-components/src/organisms/*.tsx` | `/worker` | Organism-Komponenten |
| `packages/shared-components/stories/*.stories.tsx` | `/storybook-gen` | Storybook CSF3 Stories |

## Progressive Disclosure

Jeder Skill lädt nur, was er gerade braucht:
1. **Discovery** — Name + kurze Beschreibung (~50 Tokens)
2. **Activation** — Volle `SKILL.md`-Instruktionen (~500 Tokens)
3. **Execution** — `assets/theme.json`, `cdd-state.json`, einzelne Komponentendateien on-demand

## Architektur

```
skills/
  discovery/
    SKILL.md
    assets/theme.json          ← synchronisierte Kopie
    scripts/sync-theme.mjs     ← Theme-Sync-Script (canonical → skills/*/assets/)
  manager/
    SKILL.md
    assets/theme.json
  worker/
    SKILL.md
    assets/theme.json
  storybook-gen/
    SKILL.md
    assets/theme.json
  cdd-analysis-skill/
    SKILL.md
    assets/theme.json
    references/
    scripts/

.claude/commands/            ← Schlanke Wrapper (Claude Code Slash Commands)
  discovery.md                → referenziert skills/discovery/SKILL.md
  manager.md                  → referenziert skills/manager/SKILL.md
  worker.md                   → referenziert skills/worker/SKILL.md
  storybook-gen.md            → referenziert skills/storybook-gen/SKILL.md

.claude/cdd-state.json       ← Build State (vom Manager erzeugt)

packages/shared-components/src/theme.json  ← Design Tokens (kanonisch, von Discovery erzeugt)
```
