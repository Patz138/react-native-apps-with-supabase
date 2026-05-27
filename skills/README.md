# Skills — AI Agent Workflow

Dieser Ordner enthält die 4 Skill-Definitionen für den KI-Agenten-Workflow nach dem Podcast-Konzept.

## Skill-Übersicht

| Skill | Datei | Claude Code Command | Ausführen |
|---|---|---|---|
| Discovery | `discovery.md` | `/discovery` | Zuerst — extrahiert Tokens |
| Manager | `manager.md` | `/manager` | Nach Discovery — erstellt Roadmap |
| Worker | `worker.md` | `/worker` | Pro Komponente — baut Code |
| Storybook Gen | `storybook-gen.md` | `/storybook-gen` | Nach Worker — generiert Stories |

## Pipeline

```
/discovery  →  /manager init  →  /worker <Atom>  →  /storybook-gen <Atom>
                                       ↓
                              /manager complete <id>
                                       ↓
                              /worker <Molecule>  →  /storybook-gen <Molecule>
```

## Dateien die diese Skills erzeugen

| Datei | Erzeugt von | Zweck |
|---|---|---|
| `packages/shared-components/src/theme.json` | `/discovery` | Source of Truth für alle Design Tokens |
| `.claude/cdd-state.json` | `/manager init` | CDD Roadmap + Build State |
| `packages/shared-components/src/atoms/*.tsx` | `/worker` | Atom-Komponenten |
| `packages/shared-components/stories/*.stories.tsx` | `/storybook-gen` | Storybook CSF3 Stories |

## Progressive Disclosure

Jeder Skill lädt nur, was er gerade braucht:
1. **Trigger** — Name + kurze Beschreibung (~50 Tokens)
2. **Instruktionen** — Vollständige Anweisungen (~500 Tokens)
3. **Externe Referenzdateien** — `theme.json`, `cdd-state.json` on-demand

## Architektur

```
skills/                      ← Primäre Skill-Definitionen (Source of Truth)
  discovery.md
  manager.md
  worker.md
  storybook-gen.md

.claude/commands/            ← Schlanke Wrapper (Claude Code Slash Commands)
  discovery.md               → referenziert skills/discovery.md
  manager.md                 → referenziert skills/manager.md
  worker.md                  → referenziert skills/worker.md
  storybook-gen.md           → referenziert skills/storybook-gen.md

.claude/cdd-state.json       ← Build State (vom Manager erzeugt)

packages/shared-components/src/theme.json  ← Design Tokens (vom Discovery erzeugt)
```
