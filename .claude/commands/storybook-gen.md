---
name: storybook-gen
description: Storybook Story Generator. Analysiert Komponenten-Metadaten und generiert vollständige CSF3 .stories.tsx mit Title, Meta-Object, Story-Objects und Decorators. Kein manuelles Code-Anfassen.
---

Vollständige Skill-Definition: `skills/storybook-gen.md`

Führe den Storybook Gen Skill aus wie in `skills/storybook-gen.md` definiert:

```
/storybook-gen <ComponentName> [--file <pfad>]
```

Ausgabe: `stories/<ComponentName>.stories.tsx` mit:
- Meta-Object (title aus cdd-state.json, backgrounds, decorators)
- ArgTypes: Union Types → select, Booleans → boolean, Functions → action
- Story-Objects: Pro Variant/Difficulty-Wert ein eigenes Story-Object
- RN Decorator: View-Wrapper mit Kinetic-Dark-Hintergrund (#141408)

Validieren: Komponentendatei existiert, Storybook in package.json, Tokens valid.
